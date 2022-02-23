import React, { FC, useMemo } from 'react'
import {
  makeStyles,
  Paper,
  Table,
  TableBody,
  TableCell, TableContainer,
  TableHead,
  TableRow,
} from '@material-ui/core'
import Image from 'next/image'
import useSWR from 'swr'

import { fetcher } from '../../../../utils/fetcher'

type TableViewerProps = {
  maintenance: string
}

const useStyles = makeStyles(() => ({
  center: {
    display: 'flex',
    justifyContent: 'center',
  },
}))

const TableViewer:FC<TableViewerProps> = ({ maintenance }) => {
  const styles = useStyles()
  const { data: tableData } = useSWR(`/api/maintenance/${maintenance}/10`, {
    refreshInterval: 3000,
    fetcher,
  })

  const tableHeaders = useMemo(() => tableData?.headers?.map(
    (header) => <TableCell key={header}>{header}</TableCell>,
  ), [tableData])

  const tableRows = useMemo(() => tableData && tableData.rows.map((row, i) => (
    <TableRow key={`${row[0][0]}_${i}`}>
      {row.map((cell, j) => (
        <TableCell key={`${cell}_${j}`}>{cell}</TableCell>
      ))}
    </TableRow>
  )), [tableData])

  if (!tableData) {
    return <div className={styles.center}>
      <Image src={'/small_preloader.svg'} width={80} height={80}/>
    </div>
  }
  return (
    <TableContainer component={Paper}>
      <Table size="small" aria-label="a dense table">
        <TableHead>
          <TableRow>
            {tableHeaders}
          </TableRow>
        </TableHead>
        <TableBody>
          {tableRows}
        </TableBody>
      </Table>
    </TableContainer>
  )
}

export default TableViewer
