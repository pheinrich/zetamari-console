'use client'

import { useEffect } from 'react'
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
import Typography from '@mui/material/Typography'

import { useFormSubmit } from '@/utils/formSubmitHook'
import { createPermission, updatePermission } from '@/db/actions/permission'

const schema = z.object({
  id: z.preprocess( (val) => (val === '' || val == null ? undefined : val), z.coerce.number().optional() ),
  name: z.string().min( 1 ),
  description: z.preprocess( (val) => (val === '' ? undefined : val), z.string().optional() ),
})

export default function PermissionForm( {initialData={}} )
{
  const router = useRouter()
  const isEdit = Boolean( initialData?.id )

  const { handleSubmit, loading, errors, success } = useFormSubmit({
    schema,
    onSubmit: isEdit ? updatePermission : createPermission
  })

  useEffect( () => {
    if( success )
      router.push( '/permissions' )
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [success, router] )

  return (
    <form onSubmit={handleSubmit}>
      <Grid container spacing={6}>
        <Grid size={{ xs: 12 }}>
          <div className='flex flex-wrap sm:items-center justify-between max-sm:flex-col gap-6'>
            <Typography variant='h4'>{isEdit ? 'Update' : 'Create'} Permission</Typography>
            <div className='flex flex-wrap gap-4'>
              <Button variant='outlined' color='secondary' component={NextLink} href='/permissions'>
                Cancel
              </Button>
              <Button type='submit' variant='contained' disabled={loading}>
                {loading ? 'Saving...' : isEdit ? 'Save Changes' : 'Create Permission'}
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
            <CardHeader title='Permission Information' />
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
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </form>
  )
}
