'use client'

import { useEffect, useState } from 'react'

import { useRouter } from 'next/navigation'

import NextLink from 'next/link'

import { z } from 'zod'


import Grid from '@mui/material/Grid2'
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import Button from '@mui/material/Button'
import Alert from '@mui/material/Alert'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import Autocomplete from '@mui/material/Autocomplete'

import { useFormSubmit } from '@/utils/formSubmitHook'
import { createUser, updateUser } from '@/db/actions/person'

const optionalString = z.preprocess( (val) => (val === '' || val == null ? undefined : val), z.string().optional() )

const schema = z.object({
  id: z.preprocess( (val) => (val === '' || val == null ? undefined : val), z.coerce.number().optional() ),
  firstName: optionalString,
  lastName: optionalString,
  email: z.string().email(),
  password: optionalString,
})

// A User is just a Person with a password (see db/actions/person.js) -
// which capacities they act in (Owner, Assistant, Admin, ...) are Role
// assignments, submitted alongside the form fields rather than a single
// role Select.
export default function UserForm( {initialData={}, roleOptions=[]} )
{
  const router = useRouter()
  const isEdit = Boolean( initialData?.id )

  const [roles, setRoles] = useState(
    () => roleOptions.filter( r => initialData?.Roles?.some( ir => ir.id === r.id ) )
  )

  const { handleSubmit, loading, errors, success } = useFormSubmit({
    schema: isEdit ? schema : schema.extend( {password: z.string().min( 8, 'Password must be at least 8 characters' )} ),
    onSubmit: data => (isEdit ? updateUser : createUser)( {...data, roleIds: roles.map( r => r.id )} )
  })

  // See ProductForm.jsx for why this is a router.push() effect rather
  // than a render-time redirect() call.
  useEffect( () => {
    if( success )
      router.push( '/users' )
  }, [success, router] )

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
                  <TextField fullWidth label='First Name' name='firstName' defaultValue={initialData?.firstName || ''} />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField fullWidth label='Last Name' name='lastName' defaultValue={initialData?.lastName || ''} />
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
                <Grid size={{ xs: 12 }}>
                  <Autocomplete
                    multiple
                    options={roleOptions}
                    value={roles}
                    getOptionLabel={option => option.name}
                    getOptionKey={option => option.id}
                    isOptionEqualToValue={(option, value) => option.id === value.id}
                    onChange={(e, value) => setRoles( value )}
                    renderInput={params => <TextField {...params} label='Roles' placeholder='Add role' />}
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
