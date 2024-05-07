import { useState } from 'react'
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
	const [width, setWidth] = useState( 14.75 )
	const [height, setHeight] = useState( 23.25 )
	const [border, setBorder] = useState( 2.75 )
	const [outsideId, setOutsideId] = useState( 1 )
	const [insideId, setInsideId] = useState( undefined )
	const [rabbetId, setRabbetId] = useState( undefined )

  const mirror = useMirror( width, height, border, outsideId, insideId, rabbetId )
  const [tab, setTab] = useState( 0 )
  const params = {
  	width, setWidth,
  	height, setHeight,
  	border, setBorder,
  	outsideId, setOutsideId,
  	insideId, setInsideId,
  	rabbetId, setRabbetId
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
                    <Tab label="Shape" {...a11yProps( 0 )} />
                    <Tab label="Materials" {...a11yProps( 1 )} />
                    <Tab label="Pricing" {...a11yProps( 2 )} />
                  </Tabs>
                </Box>
                <PreviewTabPanel value={tab} index={0}>
                  <ParamsPanel params={params}/>
                </PreviewTabPanel>
                <PreviewTabPanel value={tab} index={1}>
                  Materials
                </PreviewTabPanel>
                <PreviewTabPanel value={tab} index={2}>
                  Pricing
                </PreviewTabPanel>
              </Box>
            </Stack>
          </Stack>
        </Box>
      </CardContent>
    </Card>
  )
}
