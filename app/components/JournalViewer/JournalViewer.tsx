import React, { FC, useEffect, useMemo, useState } from 'react'
import {
  Button,
  Grid,
  makeStyles,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from '@material-ui/core'
import useAxios from 'axios-hooks'

const useStyles = makeStyles(theme => ({
  table: {},
  textField: {
    maxWidth: '100px',
  },
  box: {
    display: 'flex',
    alignItems: 'baseline',
    flexWrap: 'wrap',
    '& *': {
      margin: theme.spacing(1),
    },
  },
}))

type TableResponse = {
  headers: string[],
  rows: string[][]
}

type JournalViewerProps = {
  type: string,
  needUpdate: boolean
}

const JournalViewer:FC<JournalViewerProps> = ({ type, needUpdate }) => {
  const styles = useStyles()
  const [countRows, setCountRows] = useState(3)

  const [{ data, loading, error }, getDimensions] = useAxios<TableResponse>({
    url: `/api/manufacture/${type}/${countRows}`,
    method: 'get',
    headers: {
      'Cache-Control': 'no-cache',
      'Pragma': 'no-cache',
      'Expires': '0',
    },
  }, { manual: true })

  useEffect(() => {
    getDimensions()
  }, [type, needUpdate, getDimensions])

  const tableHeaders = useMemo(() => data?.headers?.map(
    (header) => <TableCell key={header}>{header}</TableCell>,
  ), [data])

  const tableRows = useMemo(() => data && data.rows.map((row, i) => (
    <TableRow key={`${row[0][0]}_${i}`}>
      {row.map((cell) => (
        <TableCell key={cell}>{cell}</TableCell>
      ))}
    </TableRow>
  )), [data])

  const setCount = (value: string) => {
    const v = parseInt(value, 10)
    if (v > 0 && v < 6) {
      setCountRows(parseInt(value, 10))
    } else {
      setCountRows(1)
    }
  }
  return (
        <Grid container>
            <Grid item xs={12} className={styles.box}>
                <Typography component={'span'}>Отобразить последние измерения <i>(макс: 5)</i></Typography>
                <TextField label={'кол-во'}
                           className={styles.textField}
                           value={countRows}
                           onChange={e => setCount(e.target.value)}/>
                <Button variant={'text'} color={'primary'} onClick={() => getDimensions()}>отобразить</Button>
            </Grid>
            <Grid item xs={12}>
                {loading && <img src="/small_preloader.svg" alt="loading..."/>}
                {!!data &&
                <TableContainer component={Paper}>
                    <Table className={styles.table} size="small" aria-label="a dense table">
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
                }
                {error &&
                <Typography color={'error'} variant={'subtitle2'}>{error?.response?.data.message}</Typography>}
            </Grid>
        </Grid>
  )
}

export default JournalViewer
