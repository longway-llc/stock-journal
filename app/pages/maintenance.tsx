import React, { useState } from 'react'
import {
  Container,
  FormControl,
  FormControlLabel,
  FormLabel,
  Grid,
  Link as StyledLink,
  Radio,
  RadioGroup,
  Typography,
  useTheme,
} from '@mui/material'
import { NextPage } from 'next'
import Head from 'next/head'
import Link from 'next/link'

import { DailyRefrigiratorForm } from '../modules/pages/maintenance/DailyRefrigiratorForm'
import { MonthlyRefrigiratorForm } from '../modules/pages/maintenance/MonthlyRefrigiratorForm'
import { ShelvingEquipmentForm }
  from '../modules/pages/maintenance/ShelvingEquipmentForm'
import { TableViewer } from '../modules/pages/maintenance/TableViewer'


const FormType = {
  shelvingEquipment: <ShelvingEquipmentForm />,
  dailyRefrigerator: <DailyRefrigiratorForm/>,
  monthlyRefrigerator: <MonthlyRefrigiratorForm/>,
}

export type MaintenanceName = 'shelvingEquipment' | 'dailyRefrigerator' | 'monthlyRefrigerator'

const Maintenance:NextPage = () => {
  const theme = useTheme()

  const [maintenance, setMaintenance] = useState<MaintenanceName>('shelvingEquipment')

  const handleChangeMaintenance = (event) => {
    setMaintenance(event.target.value)
  }

  return (
    <>
    <Head>
      <title>Журнал регламентных работ</title>
      <meta name={'robots'} content="noindex"/>
      <meta name="theme-color" content={theme.palette.text.primary}/>
      <link rel="icon" href="/favicon-admin-192x192.png" type="image/x-icon"/>
      <link rel="shortcut icon" href="/favicon-admin-192x192.png" type="image/x-icon"/>
    </Head>

      <Container maxWidth={'md'} sx={{
        mt: 7,
      }}>
        <Grid container spacing={3} direction={'column'}>
          <Grid item xs={12}>
            <Typography 
              variant={'h4'}
              sx={{
                backgroundColor: 'common.black',
                color: 'white',
                fontWeight: 'bold',
                p: 2,
                display: 'inline-block',
              }}
            >Журнал регламентных работ</Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography variant={'subtitle1'}>Перейти на страницу
              {' '}
              <Link href={'/'}><StyledLink style={{ cursor: 'pointer' }}>
                журнала измерений
              </StyledLink></Link>
            </Typography>

          </Grid>
          <Grid item xs={12}>
            <FormControl component="fieldset">
              <FormLabel component="legend">Тип регламента</FormLabel>
              <RadioGroup
                aria-label="maintenance"
                name="maintenance"
                value={maintenance}
                onChange={handleChangeMaintenance}
              >
                <FormControlLabel
                  value="shelvingEquipment"
                  control={<Radio color={'primary'} />}
                  label="График периодической еженедельной проверки стеллажного оборудования"
                />
                <FormControlLabel
                  value="dailyRefrigerator"
                  control={<Radio color={'primary'} />}
                  label="Журнал ежедневных регламентных работ холодильного оборудования"
                />
                <FormControlLabel
                  value="monthlyRefrigerator"
                  control={<Radio color={'primary'} />}
                  label="Журнал ежемесячных регламентных работ холодильного оборудования"
                />
              </RadioGroup>
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            {FormType[maintenance]}
          </Grid>
          <Grid item xs={12}>
            <hr/>
          </Grid>
          <Grid item xs={12}>
            <TableViewer maintenance={maintenance}/>
          </Grid>
        </Grid>
      </Container>
    </>
  )
}

export default Maintenance
