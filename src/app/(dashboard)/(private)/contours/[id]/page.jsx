import { notFound } from 'next/navigation'

import Grid from '@mui/material/Grid2'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import CardHeader from '@mui/material/CardHeader'
import Chip from '@mui/material/Chip'
import Typography from '@mui/material/Typography'

import { readContour } from '@/db/actions/contour'
import ContourViewWithBead from '../ContourViewWithBead'
import ReverseContourForm from '@/components/ReverseContourForm'
import ContourDetailActions from './ContourDetailActions'

export default async function ContourPage( {params} )
{
  const {id} = await params
  const contour = await readContour( id )

  if( !contour )
    return notFound()

  return (
    <>
      <Grid container spacing={6}>
        <Grid size={{ xs: 12 }}>
          <Card>
            <CardContent className='flex flex-wrap items-center justify-between gap-6'>
              <div className='flex flex-col gap-2'>
                <Typography variant='h4'>{contour.name}</Typography>
                <Chip
                  label={contour.svgData ? 'Custom' : 'Basic Shape'}
                  size='small'
                  variant='tonal'
                  color={contour.svgData ? 'primary' : 'secondary'}
                  className='is-fit'
                />
              </div>
              <ContourDetailActions contour={contour} />
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12 }}>
          <Card>
            <CardHeader title='Contour' />
            <CardContent>
              <ContourViewWithBead contour={contour} />
              <ReverseContourForm id={id} />
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </>
  )
}
