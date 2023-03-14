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
  isWorking: boolean
  isClean: boolean
  isTempCorrect	: boolean
  isRunIn:boolean
}

const schema: ObjectSchema<FormData> = object({
  time: string(),
  employee: string().required('Обязательное поле'),
  isWorking: boolean(),
  isClean:boolean(),
  isTempCorrect	: boolean(),
  isRunIn:boolean(),
})

const MonthlyRefrigiratorForm = () => {
  const { mutate } = useSWRConfig()
  const { register, formState: { errors }, handleSubmit } = useForm<FormData>({
    mode: 'onBlur',
    resolver: yupResolver(schema),
    defaultValues: {
      isClean: false,
      isRunIn: false,
      isTempCorrect: false,
      isWorking: false,
    },
  })

  const [{ loading, error }, postDimensions] = useAxios({
    url: '/api/maintenance/monthlyRefrigerator',
    method: 'post',
  }, { manual: true })

  const submit = async (data: FormData) => {
    await postDimensions({ data })
    await mutate('/api/maintenance/monthlyRefrigerator/10')
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
          {...register('isClean')}
          control={<Checkbox color={'primary'} />}
          label="Очистка агрегатов от грязи и пыли"
        />
        <FormControlLabel
          {...register('isWorking')}
          control={<Checkbox color={'primary'} />}
          label="Проверка герметичности холодильной
                  системы. Выявление возможных
                  неисправностей и неполадок"
        />
        <FormControlLabel
          {...register('isTempCorrect')}
          control={<Checkbox color={'primary'} />}
          label="Проверка температурного режима камер,
                  системы оттаивания испарителя и слива талой
                  воды. Регулировка режимов оттайки"
        />
        <FormControlLabel
          {...register('isRunIn')}
          control={<Checkbox color={'primary'} />}
          label="Обкатка оборудования после проведения регламентных работ"
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

export default MonthlyRefrigiratorForm
