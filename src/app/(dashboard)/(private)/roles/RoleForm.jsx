'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { z } from 'zod'
import NextLink from 'next/link'

import Grid from '@mui/material/Grid2'
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import Button from '@mui/material/Button'
import Alert from '@mui/material/Alert'
import TextField from '@mui/material/TextField'
import Autocomplete from '@mui/material/Autocomplete'
import Typography from '@mui/material/Typography'

import { useFormSubmit } from '@/utils/formSubmitHook'
import { createRole, updateRole, setRolePermissions } from '@/db/actions/role'

const schema = z.object({
  id: z.preprocess( (val) => (val === '' || val == null ? undefined : val), z.coerce.number().optional() ),
  name: z.string().min( 1 ),
  description: z.preprocess( (val) => (val === '' ? undefined : val), z.string().optional() ),
})

// Real CRUD for Role, visually modeled on the demo apps/roles page but
// backed by the actual Role/Permission/RolePermission tables. Permission
// assignment is a multi-select that always submits the full desired set
// (see setRolePermissions()) rather than incremental add/remove calls.
export default function RoleForm( {initialData={}, permissionOptions=[]} )
{
  const router = useRouter()
  const isEdit = Boolean( initialData?.id )

  const [permissions, setPermissions] = useState(
    () => permissionOptions.filter( p => initialData?.Permissions?.some( ip => ip.id === p.id ) )
  )

  const { handleSubmit, loading, errors, success } = useFormSubmit({
    schema,
    onSubmit: async data => {
      const result = isEdit ? await updateRole( data ) : await createRole( data )

      if( result?.error )
        return result

      await setRolePermissions( isEdit ? data.id : result.id, permissions.map( p => p.id ) )

      return result
    }
  })

  useEffect( () => {
    if( success )
      router.push( '/roles' )
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [success, router] )

  return (
    <form onSubmit={handleSubmit}>
      <Grid container spacing={6}>
        <Grid size={{ xs: 12 }}>
          <div className='flex flex-wrap sm:items-center justify-between max-sm:flex-col gap-6'>
            <Typography variant='h4'>{isEdit ? 'Update' : 'Create'} Role</Typography>
            <div className='flex flex-wrap gap-4'>
              <Button variant='outlined' color='secondary' component={NextLink} href='/roles'>
                Cancel
              </Button>
              <Button type='submit' variant='contained' disabled={loading}>
                {loading ? 'Saving...' : isEdit ? 'Save Changes' : 'Create Role'}
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
            <CardHeader title='Role Information' />
            <CardContent>
              <Grid container spacing={5}>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField fullWidth label='Name' name='name' defaultValue={initialData?.name || ''} required />
                </Grid>
                <Grid size={{ xs: 12 }}>
                  <TextField
                    fullWidth
                    multiline
                    minRows={2}
                    label='Description'
                    name='description'
                    defaultValue={initialData?.description || ''}
                  />
                </Grid>
                <Grid size={{ xs: 12 }}>
                  <Autocomplete
                    multiple
                    options={permissionOptions}
                    value={permissions}
                    getOptionLabel={option => option.name}
                    getOptionKey={option => option.id}
                    isOptionEqualToValue={(option, value) => option.id === value.id}
                    onChange={(e, value) => setPermissions( value )}
                    renderInput={params => <TextField {...params} label='Permissions' placeholder='Add permission' />}
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
