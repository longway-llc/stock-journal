import React, { FC } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import {
  Button,
  FormControl,
  Grid,
  InputLabel,
  makeStyles,
  MenuItem,
  Select,
  TextField,
  Typography,
} from '@material-ui/core'
import useAxios from 'axios-hooks'
import * as yup from 'yup'

interface FormData {
  time: string
  temperature: number
  freezerName: string
  employee: string
  note: string
}

type RegisterFreezerFormProps = {
  callback: React.Dispatch<number>
}

const schema: yup.SchemaOf<FormData> = yup.object().shape({
  time: yup.string(),
  temperature: yup.number().test('value', 'Значение вне диапазона', t => t < 50 && t > -50).required('Обязательное поле'),
  employee: yup.string().required('Обязательное поле'),
  freezerName: yup.string().required('Обязательное поле'),
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


const RegisterFreezerForm: FC<RegisterFreezerFormProps> = ({ callback }) => {
  const styles = useStyles()
  const { register, formState: { errors }, handleSubmit, control } = useForm<FormData>({
    mode: 'onBlur',
    resolver: yupResolver(schema),
    defaultValues: {
      freezerName: '№1',
    },
  })

  const [{ loading, error }, postDimensions] = useAxios({
    url: '/api/manufacture/freezer',
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
                    error={Boolean(errors.time)}
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
          <Grid item xs>
            <FormControl fullWidth>
              <InputLabel id="freezerName-label">Холодильник</InputLabel>
              <Select
                labelId="freezerName-label"
                id="freezerName"
                defaultValue={'№1'}
                inputProps={{ ...register('freezerName') }}
                error={!!errors.freezerName}

              >
                <MenuItem value={'№1'}>№1</MenuItem>
                <MenuItem value={'№2'}>№2</MenuItem>
              </Select>
            </FormControl>
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

export default RegisterFreezerForm
