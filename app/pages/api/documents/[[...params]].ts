import { format } from 'date-fns'
import { GoogleSpreadsheet, GoogleSpreadsheetWorksheet } from 'google-spreadsheet'
import { NextApiRequest, NextApiResponse } from 'next'

import { TFormData } from '../../../forms/CorrespondenceForm/types'
import { creds } from '../../../settings/creds'


enum DocType {
  'memo' = 'СЗ',
  'order' = 'П',
  'doc' = 'Р',
}

const ldf = 'dd.MM.yyyy'

const type = {
  memo: 'Служебная записка',
  order: 'Приказ',
  doc: 'Распоряжение',
}

const getDateFromCell = (dateCell: string): Date => {
  const [d, m, y] = dateCell.split('.')
  return new Date(Number(y), Number(m), Number(d))
}

export default async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const doc = new GoogleSpreadsheet('19x3eufCEPZla6qAk7Qsfu4Wqjk-DbWWuPFgv1EJ6yEs')
    await doc.useServiceAccountAuth(creds)
    await doc.loadInfo()

    const sheet: GoogleSpreadsheetWorksheet = await doc.sheetsByTitle.documentsData
    const rows = await sheet.getRows()

    switch (req.method) {
      case 'POST': {
        const body = req.body as TFormData
        const reqDate = new Date(body.date)
        let id: string = null

        if (rows.length === 0) {
          id = `${format(reqDate, 'dd-MM-yyyy')}-${DocType[body.type]}.${'1'}`
          const newRow = {
            ...body,
            date: format(new Date(body.date), 'dd.MM.yyyy'),
            id,
          }
          await sheet.addRow(newRow)
          return res.status(200).json(newRow)
        }

        const lastDate = getDateFromCell(rows[rows.length - 1].date)

        const isNewestDay = lastDate.getDate() < reqDate.getDate()

        let isNeedReplace = false
        // Если письмо первое за день
        if (isNewestDay) {
          id = `${format(reqDate, ldf)}-${DocType[body.type]}.1`
          //  Если дата совпадает с последней, наращиваем количество сообщений за день
        } else if (reqDate.getDate() == lastDate.getDate()) {
          const todayMessageCount = rows.filter(row => row.date == format(reqDate, ldf)).length
          id = `${format(reqDate, ldf)}-${DocType[body.type]}.${todayMessageCount}`
          // Если добавить в конец документа в данном случае невозможно, то переходим к вставке с перезаписью документа
        } else {
          isNeedReplace = true
        }

        if (!isNeedReplace) {
          const newRow = {
            ...body,
            date: format(new Date(body.date), ldf),
            type: type[body.type],
            id,
          }
          await sheet.addRow(newRow)
          return res.status(200).json(newRow)
        } else {
          const currentDate = format(reqDate, ldf)

          const rawRows = rows.map(row => row._rawData)
          let firstIndexOfReqDate = rows.map(row => row.date).indexOf(currentDate)
          let lastIndexOfReqDate: number = null
          let isSingle = false
          // Если вставляемой даты нет в документе, ищем первую, которая больше
          if (firstIndexOfReqDate === -1) {
            isSingle = true
            firstIndexOfReqDate = rows.findIndex(row => {
              const checkDate = getDateFromCell(row.date)
              return checkDate.getDate() > reqDate.getDate()
            })
            const isFirst = firstIndexOfReqDate == 0
            firstIndexOfReqDate = isFirst ? 0 : firstIndexOfReqDate - 1
            lastIndexOfReqDate = isFirst ? -1 : firstIndexOfReqDate
          } else {
            lastIndexOfReqDate = rows.map(row => row.date).lastIndexOf(currentDate)
          }

          const headRows = rawRows.slice(0, firstIndexOfReqDate)
          const replaceRows = rawRows.slice(firstIndexOfReqDate, lastIndexOfReqDate + 1)
          const tailRows = rawRows.slice(lastIndexOfReqDate + 1)

          const insertedId = isSingle ? 1 : replaceRows.length + 1
          const newRow = [
            `${currentDate}-${DocType[body.type]}.${insertedId}`,
            currentDate,
            type[body.type],
            body.target,
            body.theme,
            body.listCount,
            body.handler,
            body.number,
            body?.lastReplyDate,
          ]

          replaceRows.push(newRow)

          const mergedRows = [
            ...headRows,
            ...replaceRows,
            ...tailRows,
          ]
          const headers = sheet.headerValues
          await sheet.clear()
          await sheet.setHeaderRow(headers)
          await sheet.addRows(mergedRows)
          return res.status(200).json('ok')
        }
      }
      case 'GET': {
        const { params } = req.query
        if (!params) {
          return res.status(400).json({ message: 'Неверно указаны параметры' })
        }

        const [perPage] = params as string[]

        const lastRows = (await sheet.getRows()).slice(-perPage)

        return res.status(200).json( {
          headers: sheet.headerValues,
          rows: lastRows.map(r=>r._rawData),
        })
      }
    }
  } catch (e) {
    return res.status(500).json({ message: e.message, stack: e.stack })
  }
}
