import React, { useState } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import {
  Button,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography, useMediaQuery, useTheme,
} from '@material-ui/core'
import useAxios from 'axios-hooks'
import { format } from 'date-fns'
import * as yup from 'yup'

import { employees } from '../../settings/emploees'
import { TFormData } from './types'

const schema: yup.SchemaOf<TFormData> = yup.object().shape({
  date: yup.string().required('Обязательное поле'),
  type: yup.mixed().oneOf(['incoming', 'outgoing']).required('Обязательное поле'),
  target: yup.string().required('Обязательное поле'),
  theme: yup.string().required('Обязательное поле'),
  listCount: yup.number().required('Обязательное поле').positive('Должно быть положительным значением'),
  handler: yup.string().required('Обязательное поле'),
  number: yup.string().required('Обязательное поле, если отсутствует поставьте "-"'),
  lastReplyDate: yup.string().notRequired(),
})

const CorrespondenceForm = ({ refetch }) => {
  const theme = useTheme()
  const isXs = useMediaQuery(theme.breakpoints.down('xs'))
  const [{ loading, error }, sendData] = useAxios({
    url: '/api/correspondence',
    method: 'post',
  }, { manual: true })

  const { register, formState: { errors }, handleSubmit } = useForm<TFormData>({
    mode: 'onBlur',
    resolver: yupResolver(schema),
  })


  const [messageType, setMessageType] = useState<TFormData['type']>('outgoing')
  const [handler, setHandler] = useState<TFormData['handler']>('')
  const handleSelectMessageType = (event: React.ChangeEvent<{ value: unknown }>) => {
    setMessageType(event.target.value as TFormData['type'])
  }

  const handleSelectHandler = (event: React.ChangeEvent<{ value: unknown }>) => {
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
            <InputLabel id="select-message-type-label">Тип письма</InputLabel>
            <Select
              labelId="select-message-type-label"
              id="select-message-type"
              value={messageType}
              onChange={handleSelectMessageType}
              inputProps={{ ...register('type') }}
              error={!!errors.type}
            >
              <MenuItem value="incoming">Входящее</MenuItem>
              <MenuItem value="outgoing">Исходящее</MenuItem>
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
            label="Тема письма"
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
              value={handler}
              onChange={handleSelectHandler}
              inputProps={{ ...register('handler') }}
              error={!!errors.handler}
            >
              {employees.map(employee => <MenuItem key={employee} value={employee}>{employee}</MenuItem>)}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={6} md={12}>
          <TextField
            inputProps={{ ...register('number') }}
            fullWidth
            label="Входящий / Исходящий номер"
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
            label="Крайняя дата ответа"
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
            disabled={loading}
          >
            Отправить
          </Button>
        </Grid>
        {error && (
          <Grid item>
            <Typography color="error">
              отправка не удалась: {error.response.data.message}
            </Typography>
          </Grid>
        )}
      </Grid>
    </Grid>
  )
}

export default CorrespondenceForm
