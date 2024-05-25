import { useEffect, useState } from 'react'
import { useMirror } from 'src/hooks/useMirror'

import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import CardHeader from '@mui/material/CardHeader'
import Stack from '@mui/material/Stack'
import Tab from '@mui/material/Tab'
import Tabs from '@mui/material/Tabs'

import MirrorPanel from 'src/views/pages/calculator/MirrorPanel'
import ParamsPanel from 'src/views/pages/calculator/ParamsPanel'
import StatsView from 'src/views/pages/calculator/StatsView'


function a11yProps( index )
{
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
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

export default function Preview()
{
  const [presets, setPresets] = useState([
    {
      name: 'Chapel Arch',
      sku: 'Ca1424',
      width: 14.25,
      height: 23.5,
      border: 2.75,
      isStock: false,
      isPreset: false,
      outside:
      {
        id: 1,
        name: 'Chapel Arch',
        prefix: 'Ca',
        svgData: null
      },
      inside: null,
      rabbet: null
    }
  ])

  useEffect( () => {
    fetch( '/api/substrates' )
      .then( (res) => res.json() )
      .then( setPresets )
  }, [] )

	const [width, setWidth] = useState( presets[0].width )
	const [height, setHeight] = useState( presets[0].height )
	const [border, setBorder] = useState( presets[0].border )
	const [outside, setOutside] = useState( presets[0].outside )
	const [inside, setInside] = useState( presets[0].inside )
	const [rabbet, setRabbet] = useState( presets[0].rabbet )

  const mirror = useMirror( width, height, border, outside, inside, rabbet )
  const [tab, setTab] = useState( 0 )
  const params = {
  	width, setWidth,
  	height, setHeight,
  	border, setBorder,
  	outside, setOutside,
  	inside, setInside,
  	rabbet, setRabbet
  }

  return (
    <Card>
      <CardHeader
        title={'Name TBD'}
      />
      <CardContent>
        <Box>
          <Stack direction='row' justifyContent='space-between'>
            <MirrorPanel mirror={mirror}/>
            <Stack sx={{ width: '100%', height: '2', ml: '20px'}}>
              <Box sx={{ height: '100%'}}>
                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                  <Tabs value={tab} onChange={(evt, val) => setTab( val )}>
                    <Tab label="Dimensions" {...a11yProps( 0 )} />
                    <Tab label="Materials" {...a11yProps( 1 )} />
                    <Tab label="Rates" {...a11yProps( 2 )} />
                  </Tabs>
                </Box>
                <PreviewTabPanel value={tab} index={0}>
                  <ParamsPanel params={params} />
                  <StatsView mirror={mirror} />
                </PreviewTabPanel>
                <PreviewTabPanel value={tab} index={1}>
                  Materials
                </PreviewTabPanel>
                <PreviewTabPanel value={tab} index={2}>
                  Rates
                </PreviewTabPanel>
              </Box>
            </Stack>
          </Stack>
        </Box>
      </CardContent>
    </Card>
  )
}
