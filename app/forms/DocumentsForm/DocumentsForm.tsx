import React, { useEffect, useState } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import {
  Alert,
  Button,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select, SelectChangeEvent, Snackbar,
  TextField,
  Typography, useMediaQuery, useTheme,
} from '@mui/material'
import useAxios from 'axios-hooks'
import { format } from 'date-fns'
import { number, object, ObjectSchema, string } from 'yup'

import { TFormData } from './types'

const schema: ObjectSchema<TFormData> = object({
  date: string().required('Обязательное поле'),
  type: string().oneOf(['memo', 'order', 'doc', 'proxy']).required('Обязательное поле'),
  target: string().required('Обязательное поле'),
  theme: string().required('Обязательное поле'),
  listCount: number().required('Обязательное поле').positive('Должно быть положительным значением'),
  handler: string().required('Обязательное поле'),
  number: string().required('Обязательное поле, если отсутствует поставьте "-"'),
  lastReplyDate: string().notRequired(),
})

const DocumentsForm = ({ refetch }) => {
  const theme = useTheme()
  const isXs = useMediaQuery(theme.breakpoints.down('md'))

  const [openSnackbar, setOpenSnackbar] = useState(false)


  const handleClose = (event?: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      return
    }

    setOpenSnackbar(false)
  }

  const [{ data: sendingData, loading: sendingLoading, error: sendingErorr, response: sendingResponse }, sendData] = useAxios({
    url: '/api/documents',
    method: 'post',
  }, { manual: true })

  useEffect(() => {
    if (sendingData) {
      setOpenSnackbar(true)
    }
  }, [sendingData])

  const [{ data: employeesData, loading: employeesLoading, error: employeesError }] = useAxios({
    url: '/api/employees',
    method: 'get',

  } )

  const { register, formState: { errors }, handleSubmit } = useForm<TFormData>({
    mode: 'onBlur',
    // @ts-ignore TODO: Разобраться в ошибке типов
    resolver: yupResolver(schema),
  })


  const [messageType, setMessageType] = useState<TFormData['type']>('memo')
  const [handler, setHandler] = useState<TFormData['handler']>('')
  const handleSelectMessageType = (event: SelectChangeEvent<TFormData['type']>) => {
    setMessageType(event.target.value as TFormData['type'])
  }

  const handleSelectHandler = (event: SelectChangeEvent<TFormData['handler']>) => {
    setHandler(event.target.value as TFormData['handler'])
  }
  const onSubmit: SubmitHandler<TFormData> = async (data) => {
    try {
      await sendData({ data })
      await refetch()
    } catch (e) {
      console.log(e)
    }
  }

  return (
    <>
    <Grid component="form" container wrap="wrap" item xs={12} md={4} lg={3} xl={2} onSubmit={handleSubmit(onSubmit)}>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6} md={12}>
          <TextField
            defaultValue={format(new Date(), 'yyyy-MM-dd')}
            inputProps={{ ...register('date') }}
            fullWidth
            label="Дата"
            type="date"
            error={!!errors.date}
            helperText={errors.date?.message}
            InputLabelProps={{
              shrink: true,
            }}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={12}>
          <FormControl fullWidth>
            <InputLabel id="select-message-type-label">Тип документа</InputLabel>
            <Select
              labelId="select-message-type-label"
              id="select-message-type"
              label="Тип документа"
              value={messageType}
              onChange={handleSelectMessageType}
              inputProps={{ ...register('type') }}
              error={!!errors.type}
            >
              <MenuItem value="memo">Служебная записка</MenuItem>
              <MenuItem value="order">Приказ</MenuItem>
              <MenuItem value="doc">Распоряжение</MenuItem>
              <MenuItem value="proxy">Доверенность</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={6} md={12}>
          <TextField
            inputProps={{ ...register('target') }}
            fullWidth
            label="От кого / Кому"
            type="text"
            error={!!errors.target}
            helperText={errors.target?.message}
            InputLabelProps={{
              shrink: true,
            }}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={12}>
          <TextField
            inputProps={{ ...register('theme') }}
            fullWidth
            label="Наименование"
            type="text"
            error={!!errors.theme}
            helperText={errors.theme?.message}
            InputLabelProps={{
              shrink: true,
            }}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={12}>
          <TextField
            inputProps={{ ...register('listCount') }}
            fullWidth
            label="Количество листов"
            type="number"
            error={!!errors.listCount}
            helperText={errors.listCount?.message}
            InputLabelProps={{
              shrink: true,
            }}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={12}>
          <FormControl fullWidth>
            <InputLabel id="select-handler-label">Ответственный (Исполнитель)</InputLabel>
            <Select
              labelId="select-handler-label"
              id="select-handler-type"
              label="Ответственный (Исполнитель)"
              value={handler}
              onChange={handleSelectHandler}
              inputProps={{ ...register('handler') }}
              error={!!errors.handler && !employeesError}
              disabled={employeesLoading}
            >
              {employeesData?.rows.map(employee => <MenuItem key={employee} value={employee}>{employee}</MenuItem>)}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={6} md={12}>
          <TextField
            inputProps={{ ...register('number') }}
            fullWidth
            label="Регистрационный номер"
            type="text"
            error={!!errors.number}
            helperText={errors.number?.message}
            InputLabelProps={{
              shrink: true,
            }}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={12}>
          <TextField
            inputProps={{ ...register('lastReplyDate') }}
            fullWidth
            label="Крайняя дата обработки"
            type="date"
            error={!!errors.lastReplyDate}
            helperText={errors.lastReplyDate?.message}
            InputLabelProps={{
              shrink: true,
            }}
          />
        </Grid>
        <Grid item xs={12}>
          <Button
            fullWidth={isXs}
            type="submit"
            variant="contained"
            color="primary"
            disabled={sendingLoading}
          >
            Отправить
          </Button>
        </Grid>
        {sendingErorr && (
          <Grid item>
            <Typography color="error">
              отправка не удалась: {sendingErorr.response.data.message}
            </Typography>
          </Grid>
        )}
      </Grid>
    </Grid>
      <Snackbar
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        open={openSnackbar}
        onClose={handleClose}
      >
        {
          sendingResponse?.status !== 200
            ? (
              <Alert onClose={handleClose} severity="error">
                При добавлении письма произошла ошибка
              </Alert>
            ) : (
              <Alert severity="success" onClose={handleClose}>Письмо успешно добавлено</Alert>
            )
        }
      </Snackbar>
    </>
  )
}

export default DocumentsForm
