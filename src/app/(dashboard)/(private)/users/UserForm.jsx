'use client'

import { redirect } from 'next/navigation'
import { z } from 'zod'
import NextLink from 'next/link'

import Grid from '@mui/material/Grid2'
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import Button from '@mui/material/Button'
import Alert from '@mui/material/Alert'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'

import { useFormSubmit } from '@/utils/formSubmitHook'
import { createUser, updateUser } from '@/db/actions/user'

const optionalString = z.preprocess( (val) => (val === '' || val == null ? undefined : val), z.string().optional() )

const schema = z.object({
  id: z.preprocess( (val) => (val === '' || val == null ? undefined : val), z.coerce.number().optional() ),
  name: z.string().min( 1 ),
  email: z.string().email(),
  password: optionalString,
})

export default function UserForm( {initialData={}} )
{
  const isEdit = Boolean( initialData?.id )
  const { handleSubmit, loading, errors, success } = useFormSubmit({
    schema: isEdit ? schema : schema.extend( {password: z.string().min( 8, 'Password must be at least 8 characters' )} ),
    onSubmit: isEdit ? updateUser : createUser
  })

  if( success )
    redirect( '/users' )

  return (
    <form onSubmit={handleSubmit}>
      <Grid container spacing={6}>
        <Grid size={{ xs: 12 }}>
          <div className='flex flex-wrap sm:items-center justify-between max-sm:flex-col gap-6'>
            <Typography variant='h4'>{isEdit ? 'Update' : 'Create'} User</Typography>
            <div className='flex flex-wrap gap-4'>
              <Button variant='outlined' color='secondary' component={NextLink} href={isEdit ? `/users/${initialData.id}` : '/users'}>
                Cancel
              </Button>
              <Button type='submit' variant='contained' disabled={loading}>
                {loading ? 'Saving...' : isEdit ? 'Save Changes' : 'Create User'}
              </Button>
            </div>
          </div>
        </Grid>

        {isEdit && <input type='hidden' name='id' value={initialData?.id} />}

        {errors && (
          <Grid size={{ xs: 12 }}>
            <Alert severity='error'>
              <pre className='whitespace-pre-wrap font-sans m-0'>{JSON.stringify( errors, null, 2 )}</pre>
            </Alert>
          </Grid>
        )}

        <Grid size={{ xs: 12 }}>
          <Card>
            <CardHeader title='User Information' />
            <CardContent>
              <Grid container spacing={5}>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField fullWidth label='Name' name='name' defaultValue={initialData?.name || ''} required />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField fullWidth type='email' label='Email' name='email' defaultValue={initialData?.email || ''} required />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField
                    fullWidth
                    type='password'
                    label='Password'
                    name='password'
                    autoComplete='new-password'
                    required={!isEdit}
                    helperText={isEdit ? 'Leave blank to keep the current password.' : 'At least 8 characters.'}
                  />
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </form>
  )
}
