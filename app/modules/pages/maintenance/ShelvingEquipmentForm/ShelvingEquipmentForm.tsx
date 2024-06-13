import React from 'react'
import { Controller, useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { Button, Grid, TextField, Typography } from '@mui/material'
import makeStyles from '@mui/styles/makeStyles'
import useAxios from 'axios-hooks'
import { useSWRConfig } from 'swr'
import { object, ObjectSchema, string } from 'yup'


interface FormData {
  time: string
  employee: string
  note: string
}

const schema: ObjectSchema<FormData> = object({
  time: string(),
  employee: string().required('Обязательное поле'),
  note: string(),
})

const useStyles = makeStyles(() => ({
  textArea: {
    width: '100%',
    resize: 'none',
  },
}))

const ShelvingEquipmentForm = () => {
  const styles = useStyles()
  const { mutate } = useSWRConfig()
  const { register, formState: { errors }, handleSubmit, control } = useForm<FormData>({
    mode: 'onBlur',
    // @ts-ignore TODO: Разобраться в ошибке типов
    resolver: yupResolver(schema),
  })

  const [{ loading, error }, postDimensions] = useAxios({
    url: '/api/maintenance/shelvingEquipment',
    method: 'post',
  }, { manual: true })

  const submit = async (data: FormData) => {
    await postDimensions({ data })
    await mutate('/api/maintenance/shelvingEquipment/10')
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

export default ShelvingEquipmentForm
