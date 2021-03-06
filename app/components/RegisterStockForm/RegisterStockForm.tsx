import React, { FC } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { Button, Grid, makeStyles, TextField, Typography } from '@material-ui/core'
import useAxios from 'axios-hooks'
import * as yup from 'yup'

interface FormData {
  time: string
  temperature: number
  humidity: number
  employee: string
  note: string
}

const schema: yup.SchemaOf<FormData> = yup.object().shape({
  time: yup.string(),
  temperature: yup.number().test('value', 'Значение вне диапазона', t => t < 50 && t > -50).required('Обязательное поле'),
  humidity: yup.number().test('value', 'Значение вне диапазона', h => h < 100 && h >= 0).required('Обязательное поле'),
  employee: yup.string().required('Обязательное поле'),
  note: yup.string(),
})

const useStyles = makeStyles(theme => ({
  dimensions: {
    marginTop: theme.spacing(2),
  },
  textArea: {
    width: '100%',
    resize: 'none',
  },
}))

type RegisterStockFormProps = {
  callback: React.Dispatch<number>
}

const RegisterStockForm: FC<RegisterStockFormProps> = ({ callback }) => {
  const styles = useStyles()
  const { register, formState: { errors }, handleSubmit, control } = useForm<FormData>({
    mode: 'onBlur',
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
              className={styles.dimensions} onSubmit={handleSubmit(submit)}>
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
                    render={({ field: { value, onChange, onBlur } }) => <textarea onChange={onChange}
                                                                              onBlur={onBlur} value={value}
                                                                              className={styles.textArea} rows={5}/>}
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
