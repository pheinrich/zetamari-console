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
  const [tab, setTab] = useState( 0 )
  const [preset, setPreset] = useState( 17 )
  const [substrate, setSubstrate] = useState( null )

  useEffect( () => {
    fetch( `/api/substrates/${preset}` )
      .then( res => setSubstrate( res.json() ) )
  }, [preset] )

  return (
    <Card>
      <CardHeader
        title={'Name TBD'}
      />
      <CardContent>
        <Box>
          <Stack direction='row' justifyContent='space-between'>
            <MirrorPanel substrate={substrate}/>
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
                  <ParamsPanel preset={preset} setPreset={setPreset} substrate={substrate} setSubstrate={setSubstrate} />
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
