import React, { FC, useId } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { Button, FormControl, Grid, InputLabel, MenuItem, Select, TextField, Typography } from '@mui/material'
import useAxios from 'axios-hooks'
import { number, object, ObjectSchema, string } from 'yup'

interface FormData {
  time: string
  stockName: string
  temperature: number
  humidity: number
  employee: string
  note: string
}

const schema: ObjectSchema<FormData> = object({
  time: string(),
  stockName: string(),
  temperature: number().test('value', 'Значение вне диапазона', t => t < 50 && t > -50).required('Обязательное поле'),
  humidity: number().test('value', 'Значение вне диапазона', h => h < 100 && h >= 0).required('Обязательное поле'),
  employee: string().required('Обязательное поле'),
  note: string(),
})

type RegisterStockFormProps = {
  callback: React.Dispatch<number>
}

const RegisterStockForm: FC<RegisterStockFormProps> = ({ callback }) => {
  const randomId = useId()

  const { register, formState: { errors }, handleSubmit, control } = useForm<FormData>({
    mode: 'onBlur',
    // @ts-ignore TODO: Разобраться в ошибке типов
    resolver: yupResolver(schema),
  })

  const [{ loading, error }, postDimensions] = useAxios({
    url: '/api/manufacture/stock',
    method: 'post',
  }, { manual: true })

  const submit = async (data: FormData) => {
    try {
      await postDimensions({ data })
    } finally {
      callback(Date.now())
    }
  }

  return (
        <Grid container component={'form'} spacing={2} noValidate autoComplete="off"
              sx={{
                marginTop: 2,
                flexDirection: 'column',
              }}
              onSubmit={handleSubmit(submit)}>
            <Grid item>
                <TextField
                    inputProps={{ ...register('time') }}
                    label="Дата и время"
                    type="datetime-local"
                    error={!!errors.time}
                    helperText={errors.time?.message}
                    InputLabelProps={{
                      shrink: true,
                    }}
                />
            </Grid>
            <Grid item>
              <FormControl sx={{ minWidth:'230px' }}>
                <InputLabel id={`${randomId}-label`}>
                  Склад
                </InputLabel>
                <Select
                  labelId={`${randomId}-label`}
                  id={randomId}
                  inputProps={{ ...register('stockName') }}
                  label="Склад"
                  defaultValue="Склад №1"
                  error={!!errors?.stockName}
                >
                  <MenuItem value={'Склад №1'}>Склад №1</MenuItem>
                  <MenuItem value={'Склад №2'}>Склад №2</MenuItem>
                  <MenuItem value={'Склад №3'}>Склад №3</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item>
                <TextField label="Температура"
                           inputProps={{ ...register('temperature') }}
                           error={!!errors.temperature}
                           helperText={errors.temperature?.message}
                />
            </Grid>
            <Grid item>
                <TextField label="Влажность"
                           inputProps={{ ...register('humidity') }}
                           error={!!errors.humidity}
                           helperText={errors.humidity?.message}
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
                <Controller
                    render={({ field: { value, onChange, onBlur } }) => (
                      <textarea
                        onChange={onChange}
                        onBlur={onBlur}
                        value={value}
                        rows={5}
                        style={{
                          width: '100%',
                          resize: 'none',
                        }}
                    />)
                }
                    name="note"
                    control={control}
                    defaultValue=""
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

export default RegisterStockForm
