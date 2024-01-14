import { useState } from 'react'

// ** MUI Imports
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import ButtonGroup from '@mui/material/ButtonGroup'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import CardHeader from '@mui/material/CardHeader'
import Checkbox from '@mui/material/Checkbox'
import Divider from '@mui/material/Divider'
import Grid from '@mui/material/Grid'
import Icon from 'src/@core/components/icon'
import { styled } from '@mui/material/styles'
import Slider from '@mui/material/Slider'
import Switch from '@mui/material/Switch'
import Tooltip from '@mui/material/Tooltip'
import Typography from '@mui/material/Typography'

import OptionsMenu from 'src/@core/components/option-menu'

import MirrorView from 'src/views/pages/calculator/MirrorView'
import { ShapeFactory } from 'src/modules/shape_factory.mjs'
import { ShapePresets } from 'src/modules/shape_presets.mjs'

// Temporary preset
const preset = ShapePresets.all[ 20 ]
const shape = ShapeFactory.createFromPreset( preset )

// Styled Box component
const StyledBox = styled(Box)(({ theme }) => ({
  [theme.breakpoints.up('sm')]: {
    borderRight: `1px solid ${theme.palette.divider}`
  }
}))

function Preview() {
  const [showGlass, setShowGlass] = useState( true )
  const [showBack, setShowBack] = useState( false )
  const [showDims, setShowDims] = useState( 0 )
  const [zoom, setZoom] = useState( 65 )

  return (
    <Card>
      <CardHeader action={<OptionsMenu
        iconProps={{ fontSize: 20 }}
        iconButtonProps={{ size: 'small' }}
        menuProps={{ sx: { '& .MuiMenuItem-root svg': { mr: 2 } } }}
        options={[
          {
            text: 'Print',
            icon: <Icon icon='mdi:printer' fontSize={20} />
          },
          {
            text: 'Share',
            icon: <Icon icon='mdi:share-variant' fontSize={20} />
          },
          {
            text: 'Delete',
            icon: <Icon icon='mdi:delete' fontSize={20} />
          }
        ]} />} />
      <CardContent>
        <Grid container>
          <Grid item>
            <MirrorView shape={shape} zoom={zoom} showGlass={showGlass} showBack={showBack} showDims={showDims} />
            <Grid container justifyContent='space-between' alignItems='flex-end'>
              <Grid item xs={6}>
                <Tooltip title={showBack ? 'Show Front' : 'Show Back'}>
                  <Checkbox
                    checked={showBack}
                    icon={<Icon icon='bi:back' fontSize={20} />}
                    checkedIcon={<Icon icon='bi:front' fontSize={20} />}
                    onChange={() => setShowBack( !showBack )} />
                </Tooltip>
                <Tooltip title={showGlass ? 'Hide Glass' : 'Show Glass'}>
                  <Checkbox
                    checked={showGlass}
                    icon={<Icon icon='mdi:mirror' fontSize={24} />}
                    checkedIcon={<Icon icon='mdi:mirror' fontSize={24} />}
                    onChange={() => setShowGlass( !showGlass )} />
                </Tooltip>
                <Tooltip title={(showDims & 1) === 1 ? 'Hide Outside Dimensions' : 'Show Outside Dimensions'}>
                  <Checkbox
                    checked={(showDims & 1) === 1}
                    icon={<Icon icon='mdi:border-outside' fontSize={24} />}
                    checkedIcon={<Icon icon='mdi:border-outside' fontSize={24} />}
                    onChange={() => setShowDims( showDims ^ 1 )} />
                </Tooltip>
                <Tooltip title={(showDims & 2) === 2 ? 'Hide Inside Dimensions' : 'Show Inside Dimensions'}>
                  <Checkbox
                    checked={(showDims & 2) === 2}
                    icon={<Icon icon='mdi:border-inside' fontSize={24} />}
                    checkedIcon={<Icon icon='mdi:border-inside' fontSize={24} />}
                    onChange={() => setShowDims( showDims ^ 2 )} />
                </Tooltip>
              </Grid>
              <Grid item xs={6}>
                <Slider
                  min={0}
                  max={100}
                  value={typeof zoom === 'number' ? zoom : 65}
                  valueLabelDisplay='auto'
                  onChange={(e,val) => setZoom( val )}
                />
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  )
}

export default Preview
