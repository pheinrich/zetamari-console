'use client'

import { useRouter } from 'next/navigation'
import { z } from 'zod'

import { useEffect, useState } from 'react'

import Grid from '@mui/material/Grid2'
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import Button from '@mui/material/Button'
import Alert from '@mui/material/Alert'
import Autocomplete from '@mui/material/Autocomplete'
import FormControl from '@mui/material/FormControl'
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import Select from '@mui/material/Select'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import NextLink from 'next/link'

import { useFormSubmit } from '@/utils/formSubmitHook'
import { createContour, updateContour } from '@/db/actions/contour'

const optionalString = z.preprocess( (val) => (val === '' || val == null ? undefined : val), z.string().optional() )

const schema = z.object({
  id: z.preprocess( (val) => (val === '' || val == null ? undefined : val), z.coerce.number().optional() ),
  name: z.string().min( 1 ),
  svgData: optionalString,
  // Set (and required) for a parametric ("no path data") contour - picked
  // from the Select below, which only lists shape families buildFromType()
  // (@/libs/mirror) actually knows how to draw.
  shapeTypeId: z.preprocess( (val) => (val === '' || val == null ? undefined : val), z.coerce.number().int().optional() ),
  // Set (and required) for a custom (svgData) contour - free-typed into
  // the Autocomplete below; the server resolves it to an existing or
  // brand-new ShapeType by name (see resolveShapeTypeId in
  // @/db/actions/contour).
  shapeName: optionalString,
})
  .refine( data => Boolean( data.svgData ) || Boolean( data.shapeTypeId ), {
    message: 'A basic shape (no path data) requires a shape type',
    path: ['shapeTypeId'],
  })
  .refine( data => !data.svgData || Boolean( data.shapeName ), {
    message: 'A custom shape requires a shape family name',
    path: ['shapeName'],
  })

export default function ContourForm( {initialData={}, shapeTypes=[]} )
{
  const router = useRouter()
  const isEdit = Boolean( initialData?.id )
  const [hasSvgData, setHasSvgData] = useState( Boolean( initialData?.svgData ) )
  const [shapeName, setShapeName] = useState( initialData?.shape?.name || '' )
  const { handleSubmit, loading, errors, success } = useFormSubmit({
    schema,
    onSubmit: isEdit ? updateContour : createContour
  })

  // Only the shapes buildFromType() can actually draw parametrically -
  // custom (svgData) contours can belong to any shape family, including
  // ones that only ever exist as traced paths, so the Select is
  // deliberately narrower than the full shapeTypes list the Autocomplete
  // below draws from.
  const parametricShapeTypes = shapeTypes.filter( s => s.key )

  // See ProductForm.jsx for why this is a router.push() effect rather
  // than a render-time redirect() call.
  useEffect( () => {
    if( success )
      router.push( '/contours' )
  }, [success, router] )

  function handleFormSubmit( e )
  {
    const svgData = e.target.elements.svgData?.value

    if( !svgData || !svgData.trim() )
    {
      const proceed = confirm(
        'Creating a Contour with no path data establishes it as a fundamental shape. Do you wish to proceed?'
      )

      if( !proceed )
      {
        e.preventDefault()
        return
      }
    }

    handleSubmit( e )
  }

  return (
    <form onSubmit={handleFormSubmit}>
      <Grid container spacing={6}>
        <Grid size={{ xs: 12 }}>
          <div className='flex flex-wrap sm:items-center justify-between max-sm:flex-col gap-6'>
            <Typography variant='h4'>{isEdit ? 'Update' : 'Create'} Contour</Typography>
            <div className='flex flex-wrap gap-4'>
              <Button variant='outlined' color='secondary' component={NextLink} href={isEdit ? `/contours/${initialData.id}` : '/contours'}>
                Cancel
              </Button>
              <Button type='submit' variant='contained' disabled={loading}>
                {loading ? 'Saving...' : isEdit ? 'Save Changes' : 'Create Contour'}
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
            <CardHeader title='Contour' />
            <CardContent className='flex flex-col gap-5'>
              <TextField fullWidth label='Name' name='name' defaultValue={initialData?.name || ''} required />
              <TextField
                fullWidth
                multiline
                minRows={8}
                label='SVG Path Data (optional)'
                name='svgData'
                defaultValue={initialData?.svgData || ''}
                onChange={e => setHasSvgData( Boolean( e.target.value.trim() ) )}
                helperText='Leave blank to make this a fundamental/basic shape instead of a custom contour.'
              />

              {hasSvgData ? (
                <>
                  <Autocomplete
                    freeSolo
                    fullWidth
                    options={shapeTypes.map( s => s.name )}
                    inputValue={shapeName}
                    onInputChange={(e, value) => setShapeName( value )}
                    renderInput={params => (
                      <TextField
                        {...params}
                        label='Shape Family'
                        required
                        helperText='Existing shape families are suggested - type a new name to create one (e.g. adding a matching "..., Inside" contour to an existing shape).'
                      />
                    )}
                  />
                  <input type='hidden' name='shapeName' value={shapeName} />
                </>
              ) : (
                <FormControl fullWidth required>
                  <InputLabel id='shapeTypeId'>Shape Type</InputLabel>
                  <Select
                    labelId='shapeTypeId'
                    label='Shape Type'
                    name='shapeTypeId'
                    defaultValue={initialData?.shapeTypeId ?? ''}
                  >
                    <MenuItem value=''>—</MenuItem>
                    {parametricShapeTypes.map( shapeType => (
                      <MenuItem key={shapeType.id} value={shapeType.id}>{shapeType.name}</MenuItem>
                    ) )}
                  </Select>
                </FormControl>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </form>
  )
}
