/* eslint-disable react/jsx-props-no-spreading */
import React from 'react'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import {
  Button, Checkbox, FormControlLabel,
  Grid,
  TextField, Typography,
} from '@mui/material'
import useAxios from 'axios-hooks'
import { useSWRConfig } from 'swr'
import { boolean, object, ObjectSchema, string } from 'yup'

interface FormData {
  time: string
  employee: string
  isCompleteness: boolean
  isWorking: boolean
}

const schema: ObjectSchema<FormData> = object().shape({
  time: string(),
  employee: string().required('Обязательное поле'),
  isCompleteness: boolean(),
  isWorking: boolean(),
})

const DailyRefrigiratorForm = () => {
  const { mutate } = useSWRConfig()
  const { register, formState: { errors }, handleSubmit } = useForm<FormData>({
    mode: 'onBlur',
    // @ts-ignore TODO: Разобраться в ошибке типов
    resolver: yupResolver(schema),
    defaultValues:{
      isCompleteness: false,
      isWorking: false,
    },
  })

  const [{ loading, error }, postDimensions] = useAxios({
    url: '/api/maintenance/dailyRefrigerator',
    method: 'post',
  }, { manual: true })

  const submit = async (data: FormData) => {
    await postDimensions({ data })
    await mutate('/api/maintenance/dailyRefrigerator/10')
  }

  return (
    <Grid
      container
      component={'form'}
      spacing={2}
      noValidate
      autoComplete="off"
      onSubmit={handleSubmit(submit)}
    >
      <Grid item>
        <TextField
          inputProps={{ ...register('time') }}
          label="Дата и время"
          type="datetime-local"
          error={Boolean(errors.time)}
          helperText={errors.time?.message}
          InputLabelProps={{
            shrink: true,
          }}
        />
      </Grid>
      <Grid item>
        <TextField label="Сотрудник"
                   inputProps={{ ...register('employee') }}
                   error={!!errors.employee}
                   helperText={errors.employee?.message}
        />
      </Grid>
      <Grid item xs={12}>
        <FormControlLabel
          {...register('isCompleteness')}
          control={<Checkbox color={'primary'} />}
          label="Проверка
                  комплектности и
                  технического состояния
                  оборудования,
                  работоспособности
                  всех его составляющих
                  на момент осмотра"
        />
        <FormControlLabel
          {...register('isWorking')}
          control={<Checkbox color={'primary'} />}
          label="Проверка режима
                  работы холодильной
                  установки"
        />
      </Grid>
      <Grid item>
        <Button type={'submit'} disabled={loading} variant={'outlined'}
                color={'primary'}>{!loading ? 'отправить' : 'отправка...'}</Button>
      </Grid>
      {!!error && <Grid item>
        <Typography color={'error'}>отправка не удалась: {error.response.data.message}</Typography>
      </Grid>
      }
    </Grid>
  )
}

export default DailyRefrigiratorForm
