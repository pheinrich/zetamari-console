'use client'

import { redirect } from 'next/navigation'
import { z } from 'zod'

import { useState } from 'react'

import Grid from '@mui/material/Grid2'
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import Button from '@mui/material/Button'
import Alert from '@mui/material/Alert'
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

// Same 7 primitives buildFromType() (@/libs/mirror) knows how to draw -
// only meaningful (and required) when svgData is blank.
const SHAPE_TYPES = ['chapel arch', 'circle', 'gothic arch', 'oval', 'rectangle', 'square', 'vesica picscis']

const schema = z.object({
  id: z.preprocess( (val) => (val === '' || val == null ? undefined : val), z.coerce.number().optional() ),
  name: z.string().min( 1 ),
  svgData: optionalString,
  shapeType: z.preprocess( (val) => (val === '' || val == null ? undefined : val), z.enum( SHAPE_TYPES ).optional() ),
}).refine( data => Boolean( data.svgData ) || Boolean( data.shapeType ), {
  message: 'A basic shape (no path data) requires a shape type',
  path: ['shapeType'],
})

function shapeTypeLabel( shapeType )
{
  return shapeType.replace( /\b\w/g, c => c.toUpperCase() )
}

export default function ContourForm( {initialData={}} )
{
  const isEdit = Boolean( initialData?.id )
  const [hasSvgData, setHasSvgData] = useState( Boolean( initialData?.svgData ) )
  const { handleSubmit, loading, errors, success } = useFormSubmit({
    schema,
    onSubmit: isEdit ? updateContour : createContour
  })

  if( success )
    redirect( '/contours' )

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
              <FormControl fullWidth disabled={hasSvgData} required={!hasSvgData}>
                <InputLabel id='shapeType'>Shape Type</InputLabel>
                <Select
                  labelId='shapeType'
                  label='Shape Type'
                  name='shapeType'
                  defaultValue={initialData?.shapeType || ''}
                >
                  <MenuItem value=''>—</MenuItem>
                  {SHAPE_TYPES.map( shapeType => (
                    <MenuItem key={shapeType} value={shapeType}>{shapeTypeLabel( shapeType )}</MenuItem>
                  ) )}
                </Select>
              </FormControl>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </form>
  )
}
