'use client'

import { useState } from 'react'

import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import CardHeader from '@mui/material/CardHeader'
import Grid from '@mui/material/Grid2'
import Tab from '@mui/material/Tab'
import TabContext from '@mui/lab/TabContext'
import TabPanel from '@mui/lab/TabPanel'
import Typography from '@mui/material/Typography'

import CustomTabList from '@core/components/mui/TabList'

const TABS = [
  { value: 'overview', label: 'Overview', icon: 'ri-information-line' },
  { value: 'bom', label: 'Bill of Materials', icon: 'ri-list-check-3' },
  { value: 'images', label: 'Images', icon: 'ri-image-line' },
  { value: 'suppliers', label: 'Suppliers', icon: 'ri-truck-line' },
  { value: 'orders', label: 'Orders', icon: 'ri-shopping-cart-2-line' },
]

function Placeholder( {title} )
{
  return (
    <Card>
      <CardHeader title={title} />
      <CardContent>
        <Typography color='text.secondary'>Coming soon.</Typography>
      </CardContent>
    </Card>
  )
}

// Right-hand pane of the product page: the major sections under pill tabs,
// modeled on the template's apps/user/view UserRight. `tabContent` maps a
// tab value to its (server-rendered) content; tabs without an entry show a
// placeholder until they're built out.
export default function ProductTabs( {tabContent = {}} )
{
  const [activeTab, setActiveTab] = useState( 'overview' )

  return (
    <TabContext value={activeTab}>
      <Grid container spacing={6}>
        <Grid size={{ xs: 12 }}>
          <CustomTabList onChange={(e, value) => setActiveTab( value )} variant='scrollable' pill='true'>
            {TABS.map( (tab) => (
              <Tab
                key={tab.value}
                value={tab.value}
                label={tab.label}
                icon={<i className={tab.icon} />}
                iconPosition='start'
              />
            ) )}
          </CustomTabList>
        </Grid>
        <Grid size={{ xs: 12 }}>
          {TABS.map( (tab) => (
            <TabPanel key={tab.value} value={tab.value} className='p-0'>
              {tabContent[tab.value] ?? <Placeholder title={tab.label} />}
            </TabPanel>
          ) )}
        </Grid>
      </Grid>
    </TabContext>
  )
}
