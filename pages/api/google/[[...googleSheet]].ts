import type {NextApiRequest, NextApiResponse} from 'next'
import {GoogleSpreadsheet, GoogleSpreadsheetWorksheet} from 'google-spreadsheet'
import creds from '../../../utils/JournalRegistar-account.json'

type DimensionsType = 'stock' | 'freezer'


const getSheetByType = (doc: GoogleSpreadsheet, type: DimensionsType): GoogleSpreadsheetWorksheet | null => {
    switch (type) {
        case 'stock': {
            return doc.sheetsByTitle['stockData']
        }
        case 'freezer': {
            return doc.sheetsByTitle['freezerData']
        }
        default:
            return null
    }
}

export default async (req: NextApiRequest, res: NextApiResponse) => {
    // Разбираем путь на параметры
    const {googleSheet} = req.query
    // Если параметры отсутствуют, отправляем ошибку
    if (!googleSheet) {
        return res.status(400).json({message: 'Неверно указаны параметры'})
    }
    
    try {
        const [type, countLastRows] = googleSheet as string[]

        const doc = new GoogleSpreadsheet(process.env.SHEET_ID)
        await doc.useServiceAccountAuth(creds)
        await doc.loadInfo()

        // Загружаем лист
        const sheet: GoogleSpreadsheetWorksheet = getSheetByType(doc, type as DimensionsType)
        // Если листа нет, то отправляем ошибку
        if (sheet == null) {
            return res.status(404).json({message: 'Лист журнала не найден'})
        }

        switch (req.method) {
            // Метод POST записывает данные в таблицу
            case 'POST': {
                const newRow = {
                    ...req.body,
                    time: req.body.time ? new Date(req.body.time).toLocaleString() : new Date().toLocaleString(),
                }

                await sheet.addRow(newRow)
                return res.status(200).json({...newRow})
            }
            // Метод GET получает указанное число последних строк таблицы
            case 'GET': {

                const lastRows = (await sheet.getRows()).slice(-countLastRows)

                return res.status(200).json( {
                    headers: sheet.headerValues,
                    rows: lastRows.map(r=>r._rawData)
                })
            }
            default: {
                return res.status(500).json({message: 'unresolved method'})
            }
        }

    } catch (e) {
        return res.status(500).json({message: e.message, stack: e.stack})
    }
}