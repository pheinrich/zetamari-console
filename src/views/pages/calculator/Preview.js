import { useState } from 'react'

// ** MUI Imports
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import CardHeader from '@mui/material/CardHeader'
import Checkbox from '@mui/material/Checkbox'
import Container from '@mui/material/Container'
import Divider from '@mui/material/Divider'
import Grid from '@mui/material/Grid'
import Icon from 'src/@core/components/icon'
import { styled } from '@mui/material/styles'
import Slider from '@mui/material/Slider'
import Stack from '@mui/material/Stack'
import Switch from '@mui/material/Switch'
import Tab from '@mui/material/Tab'
import Tabs from '@mui/material/Tabs'
import Tooltip from '@mui/material/Tooltip'
import Typography from '@mui/material/Typography'

import OptionsMenu from 'src/@core/components/option-menu'

import MirrorView from 'src/views/pages/calculator/MirrorView'
import MirrorOptionsForm from 'src/views/pages/calculator/MirrorOptionsForm'
import { PrimitiveShapeType } from 'src/modules/shape.mjs'
import { ShapeFactory } from 'src/modules/shape_factory.mjs'
import { ShapePresets } from 'src/modules/shape_presets.mjs'

function a11yProps( index )
{
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

function PreviewOptionsMenu()
{
  return(
    <OptionsMenu
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
      ]}
    />      
  )
}

function PreviewTabPanel( props )
{
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

function Preview( {id} ) {
  const [shape, setShape] = useState( ShapeFactory.create( PrimitiveShapeType.Oval ) )
  const [showGlass, setShowGlass] = useState( true )
  const [showBack, setShowBack] = useState( false )
  const [showDims, setShowDims] = useState( 0 )
  const [tab, setTab] = useState( 0 )
  const [zoom, setZoom] = useState( 65 )

  function updateMirrorOptions( type, lod, width, height, border )
  {
    setShape( ShapeFactory.create( type, lod, width, height, border ) )
  }

  return (
    <Card>
      <CardHeader
        title={shape.getName()}
        action={<PreviewOptionsMenu />}
      />
      <CardContent>
        <Box>
          <Stack direction='row' justifyContent='space-between'>
            <Stack>
              <MirrorView shape={shape} zoom={zoom} showGlass={showGlass} showBack={showBack} showDims={showDims} />
              <Stack direction='row' justifyContent='space-between' alignItems='center'>
                <Box>
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
                </Box>
                <Slider
                  sx={{ width: '50%', mr: '5px'}}
                  min={0}
                  max={100}
                  value={typeof zoom === 'number' ? zoom : 65}
                  valueLabelDisplay='auto'
                  onChange={(e,val) => setZoom( val )}
                />
              </Stack>
            </Stack>
            <Stack sx={{ width: '100%', height: '2', ml: '20px'}}>
              <Box sx={{ height: '100%'}}>
                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                  <Tabs value={tab} onChange={(evt, val) => setTab( val )}>
                    <Tab label="Options" {...a11yProps( 0 )} />
                    <Tab label="Pricing" {...a11yProps( 1 )} />
                    <Tab label="Presets" {...a11yProps( 2 )} />
                  </Tabs>
                </Box>
                <PreviewTabPanel value={tab} index={0}>
                  <MirrorOptionsForm shape={shape} update={updateMirrorOptions}/>
                </PreviewTabPanel>
                <PreviewTabPanel value={tab} index={1}>
                  Pricing
                </PreviewTabPanel>
                <PreviewTabPanel value={tab} index={2}>
                  Presets
                </PreviewTabPanel>
              </Box>
            </Stack>
          </Stack>
        </Box>
      </CardContent>
    </Card>
  )
}

export default Preview
