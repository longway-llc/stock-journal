import React, { useMemo, useState } from 'react'
import {
  Button,
  Container,
  Grid,
  Link,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
  useTheme,
} from '@mui/material'
import useAxios from 'axios-hooks'
import { NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'

import CorrespondenceForm from '../forms/CorrespondenceForm/CorrespondenceForm'


const Correspondence:NextPage = () => {
  const theme = useTheme()
  const [perPage, setPerPage] = useState(3)
  const [{ data, loading, error }, refetch] = useAxios({
    url: `/api/correspondence/${perPage}`,
    method: 'get',
    headers: {
      'Cache-Control': 'no-cache',
      'Pragma': 'no-cache',
      'Expires': '0',
    },
  }, { manual: true })

  const tableHeaders = useMemo(() => data && data.headers.map(
    (header) => <TableCell key={header}>{header}</TableCell>,
  ), [data] )

  const tableRows = useMemo(() => data && data.rows.map((row, i) => (
    <TableRow key={`${row[0][4]}_${i}`}>
      {row.map((cell, _i) => (
        <TableCell key={`${cell}-${_i}`}>{cell}</TableCell>
      ))}
    </TableRow>
  )), [data])

  const setCount = (value: string) => {
    const v = parseInt(value, 10)
    if (v > 0 && v <= 6) {
      setPerPage(parseInt(value, 10))
    } else {
      setPerPage(undefined)
    }
  }

  const handleClick = async () => {
    await refetch()
  }

  return <>
    <Head>
      <title>Журнал Корреспонденции</title>
      <meta name="description" content="Учёт бумажной корреспонденции LWAero"/>
      <meta name="robots" content="noindex"/>
      <meta name="theme-color" content={theme.palette.text.primary}/>
      <link rel="icon" href="/favicon-admin-192x192.png" type="image/x-icon"/>
      <link rel="shortcut icon" href="/favicon-admin-192x192.png" type="image/x-icon"/>
    </Head>
    <Container maxWidth="xl">
      <Grid component="header" container sx={{
        mt: 4,
      }}>
        <Grid item xs>
          <Typography variant="h5" component="h1" sx={{
            py: 2,
            px: 3,
            backgroundColor: 'common.black',
            color: 'common.white',
            fontWeight: 'bold',
            sm: {
              display: 'inline-block',
            },
          }}>
            Журнал корреспонденции
          </Typography>
        </Grid>
      </Grid>
      <Grid component="main" container spacing={2} sx={{ mt:4 }}>
        <Grid item xs={12}>
          <Typography variant={'subtitle1'}>
            Введите данные письма
          </Typography>
        </Grid>
        <CorrespondenceForm refetch={refetch}/>
        <Grid item xs={12} md={8} lg={9} xl={10}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Typography variant="subtitle1">Введите количество отображаемых записей (макс. 6)</Typography>
            </Grid>
            <Grid item xs={12} sm={4} lg={2}>
              <TextField
                label="кол-во записей"
                value={perPage}
                onChange={(e) => setCount(e.target.value)}
              />
            </Grid>
            <Grid container alignItems="flex-end" item xs={12} md={8}>
              <Button
                style={{ width: '200px' }}
                onClick={handleClick}
                variant="contained"
                disabled={loading}>
                {loading ? (
                  <Image src="/small_preloader.svg" width={28} height={28} alt="loading..."/>
                )
                  :
                  ('Получить записи')
                }
              </Button>
            </Grid>
            <Grid item xs={12}>
              {data && (
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
              )}
              {error && (
                <Typography color="error" variant="subtitle2">{error?.response?.data.message}</Typography>
              )}
            </Grid>
          </Grid>
        </Grid>
      </Grid>
      <Grid component="footer" container spacing={2} sx={{
        my: 4,
      }}>
        <Grid item xs>
          <Typography variant="subtitle2">
            Посмотреть все записи по
            {' '}
            <Link href="https://docs.google.com/spreadsheets/d/1QfXsOStDXUQr3Nzwyo-BaJvQ9clK4_GeSgNBVSN-fYQ">
              ссылке
            </Link>
          </Typography>
        </Grid>
        <Typography variant="caption">При возникновении ошибок, обратитесь по <a href="mailto:admin@lwaero.net">этому адресу</a></Typography>
      </Grid>
    </Container>
  </>
}

export default Correspondence
