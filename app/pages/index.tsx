/* eslint-disable react/jsx-props-no-spreading */
import React, { useState } from 'react'
import { Container, createStyles, Grid, makeStyles, Tab, Tabs, Typography, useTheme } from '@material-ui/core'
import Head from 'next/head'

import JournalViewer from '../components/JournalViewer/JournalViewer'
import RegisterFreezerForm from '../components/RegisterFreezerForm/RegisterFreezerForm'
import RegisterStockForm from '../components/RegisterStockForm/RegisterStockForm'


interface TabPanelProps {
  children?: React.ReactNode;
  index: any;
  value: any;
}


const useStyles = makeStyles(theme => createStyles({
  root: {
    marginTop: theme.spacing(7),
  },
  header: {
    backgroundColor: theme.palette.common.black,
    color: 'white',
    fontWeight: 'bold',
    padding: theme.spacing(2),
    display: 'inline-block',
  },
}))

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props

  return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`scrollable-force-tabpanel-${index}`}
            aria-labelledby={`scrollable-force-tab-${index}`}
            {...other}
        >
            {value === index && (
              children
            )}
        </div>
  )
}


export default function Home() {
  const theme = useTheme()
  const styles = useStyles()
  const [page, setPage] = useState(0)
  const [type, setType] = useState('stock')
  const [isNeedUpdate, setIsNeedUpdate] = useState(null)

  const handleChange = (event: React.ChangeEvent<unknown>, newValue: number) => {
    setPage(newValue)
    switch (newValue) {
      case 0: {
        setType('stock')
        break
      }
      case 1: {
        setType('freezer')
        break
      }
    }
  }

  return (
        <>
            <Head>
                <title>Журнал регистрации</title>
                <meta name={'robots'} content="noindex"/>
                <meta name="theme-color" content={theme.palette.text.primary}/>
                <link rel="icon" href="/favicon-admin-192x192.png" type="image/x-icon"/>
                <link rel="shortcut icon" href="/favicon-admin-192x192.png" type="image/x-icon"/>
            </Head>

            <Container className={styles.root} maxWidth={'md'}>
                <Grid container spacing={3} direction={'column'}>
                    <Grid item xs={12}>
                        <Typography variant={'h4'} className={styles.header}>Журнал регистрации измерений</Typography>
                    </Grid>
                    <Grid item xs={12}>
                        <Typography variant={'subtitle1'}><b>Внести показания</b></Typography>
                        <Tabs
                            value={page}
                            onChange={handleChange}
                            indicatorColor="primary"
                            textColor="primary"
                        >
                            <Tab label="Склад"/>
                            <Tab label="Холодильник"/>
                        </Tabs>
                        <TabPanel value={page} index={0}>
                            <RegisterStockForm callback={setIsNeedUpdate}/>
                        </TabPanel>
                        <TabPanel value={page} index={1}>
                            <RegisterFreezerForm callback={setIsNeedUpdate}/>
                        </TabPanel>
                    </Grid>
                    <Grid item xs={12}>
                        <hr/>
                    </Grid>
                    <Grid item xs={12}>
                        <JournalViewer type={type} needUpdate={isNeedUpdate}/>
                    </Grid>
                </Grid>
            </Container>
        </>
  )
}
