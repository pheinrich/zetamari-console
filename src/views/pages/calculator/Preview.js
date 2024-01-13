import { useState } from 'react'

// ** MUI Imports
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Grid from '@mui/material/Grid'
import Divider from '@mui/material/Divider'
import { styled } from '@mui/material/styles'
import Slider from '@mui/material/Slider'
import Switch from '@mui/material/Switch'
import Typography from '@mui/material/Typography'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

import MirrorView from 'src/views/pages/calculator/MirrorView'
import { ShapeFactory } from 'src/modules/shape_factory.mjs'
import { ShapePresets } from 'src/modules/shape_presets.mjs'

// Temporary preset
const preset = ShapePresets.all[ 55 ]
const shape = ShapeFactory.createFromPreset( preset )

// Styled Box component
const StyledBox = styled(Box)(({ theme }) => ({
  [theme.breakpoints.up('sm')]: {
    borderRight: `1px solid ${theme.palette.divider}`
  }
}))

const Preview = () => {
  const [showGlass, setShowGlass] = useState( true )
  const [showBack, setShowBack] = useState( false )
  const [showScale, setShowScale] = useState( false )
  const [zoom, setZoom] = useState( 65 )

  return (
    <Card>
      <Grid container spacing={6}>
        <Grid item sm={5} xs={12}
          sx={{ pt: ['0 !important', '1.5rem !important'], pl: ['1.5rem !important', '0 !important'] }}
        >
          <CardContent
            sx={{
              height: '100%',
              display: 'flex',
              textAlign: 'center',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: 'action.hover',
              p: theme => `${theme.spacing(18, 5, 16)} !important`
            }} >
            <div>
              <Box sx={{ mb: 3.5, display: 'flex', alignItems: 'flex-end', justifyContent: 'center' }}>
                <MirrorView shape={shape} zoom={zoom} showGlass={showGlass} showBack={showBack} showScale={showScale}/>
              </Box>
            </div>
          </CardContent>
        </Grid>
        <Grid item xs={12} sm={7}>
          <CardContent sx={{ p: theme => `${theme.spacing(3.25, 5.75, 6.25)} !important` }}>
            <Typography variant='h6' sx={{ mb: 3.5 }}>
              Lifetime Membership
            </Typography>
            <Typography variant='body2'>
              Here, I focus on a range of items and features that we use in life without giving them a second thought
              such as Coca Cola, body muscles and holding ones own breath. Though, most of these notes are not
              fundamentally necessary, they are such that you can use them for a good laugh, at a drinks party or for
              picking up women or men.
            </Typography>
            <Divider
              sx={{ mt: theme => `${theme.spacing(6.5)} !important`, mb: theme => `${theme.spacing(6.75)} !important` }}
            />
            <Grid container spacing={4}>
              <Grid item xs={12} sm={5}>
                <Switch
                  checked={showGlass}
                  onChange={() => setShowGlass( !showGlass )}
                />
                Show Glass
              </Grid>
            </Grid>
            <Grid container spacing={4}>
              <Grid item xs={12} sm={7}>
                <Switch
                  checked={showBack}
                  onChange={() => setShowBack( !showBack )}
                />
                Show Back
              </Grid>
            </Grid>
            <Grid container spacing={4}>
              <Grid item xs={12} sm={7}>
                <Switch
                  checked={showScale}
                  onChange={() => setShowScale( !showScale )}
                />
                Show Scale
              </Grid>
            </Grid>
            <Grid container spacing={4}>
              <Grid item xs={12} sm={7}>
                Zoom
                <Slider
                  min={0}
                  max={100}
                  value={typeof zoom === 'number' ? zoom : 65}
                  valueLabelDisplay='auto'
                  onChange={(e,val) => setZoom( val )}
                />
              </Grid>
            </Grid>
          </CardContent>
        </Grid>
      </Grid>
    </Card>
  )
}

export default Preview
