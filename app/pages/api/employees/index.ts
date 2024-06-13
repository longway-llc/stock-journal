import { GoogleSpreadsheet, GoogleSpreadsheetWorksheet } from 'google-spreadsheet'
import { NextApiRequest, NextApiResponse } from 'next'

import { jwt } from '../../../utils/JWT'


export default async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const doc = new GoogleSpreadsheet(process.env.EMPLOYEES_SHEET_ID, jwt)
    await doc.loadInfo()

    const sheet: GoogleSpreadsheetWorksheet = doc.sheetsByTitle.employees
    const rows = await sheet.getRows()

    switch (req.method) {
      case 'GET': {
        return res.status(200).json( {
          headers: sheet.headerValues,
          rows: rows.map(r=>r.get('employee')),
        })
      }
    }
  } catch (e) {
    return res.status(500).json({ message: e.message, stack: e.stack })
  }
}
