import { GoogleSpreadsheet, GoogleSpreadsheetWorksheet } from 'google-spreadsheet'
import { NextApiRequest, NextApiResponse } from 'next'

import { creds } from '../../../settings/creds'


export default async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const doc = new GoogleSpreadsheet(process.env.EMPLOYEES_SHEET_ID)
    await doc.useServiceAccountAuth(creds)
    await doc.loadInfo()

    const sheet: GoogleSpreadsheetWorksheet = await doc.sheetsByTitle.employees
    const rows = await sheet.getRows()

    switch (req.method) {
      case 'GET': {
        return res.status(200).json( {
          headers: sheet.headerValues,
          rows: rows.map(r=>r.employee),
        })
      }
    }
  } catch (e) {
    return res.status(500).json({ message: e.message, stack: e.stack })
  }
}
