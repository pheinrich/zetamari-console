'use client'

import { useState } from 'react'

import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Divider from '@mui/material/Divider'
import Tab from '@mui/material/Tab'
import Tabs from '@mui/material/Tabs'
import Typography from '@mui/material/Typography'

import tableStyles from '@core/styles/table.module.css'

// The email as received: rendered HTML, plain text, headers, raw source.
//
// The HTML is the sender's, so it's shown in a sandboxed iframe - no
// scripts, forms or navigation of this page - with links opening in a
// new tab. Remote images still load, as they would in a mail client.
export default function EmailSourceView( {email} )
{
  const tabs = [
    email.html && 'rendered',
    email.text && 'text',
    'headers',
    'source',
  ].filter( Boolean )

  const [tab, setTab] = useState( tabs[0] )

  return (
    <Card>
      <Tabs value={tab} onChange={(_, value) => setTab( value )} className='pli-5'>
        {tabs.map( t => <Tab key={t} value={t} label={{rendered: 'Email', text: 'Plain text', headers: 'Headers', source: 'Raw source'}[t]} /> )}
      </Tabs>
      <Divider />
      <CardContent>
        {tab === 'rendered' && (
          <iframe
            title='Email'
            sandbox='allow-popups allow-popups-to-escape-sandbox'
            srcDoc={`<base target="_blank">${email.html}`}
            className='is-full border-0 bg-white'
            style={{minHeight: '70vh'}}
          />
        )}
        {tab === 'text' && <pre className='whitespace-pre-wrap text-sm'>{email.text}</pre>}
        {tab === 'headers' && (
          <div className='overflow-x-auto'>
            <table className={tableStyles.table}>
              <tbody>
                {email.headers.map( (h, i) => (
                  <tr key={i}>
                    <td className='align-top whitespace-nowrap'><Typography variant='body2' className='font-medium'>{h.key}</Typography></td>
                    <td><Typography variant='body2' className='break-all'>{h.value}</Typography></td>
                  </tr>
                ) )}
              </tbody>
            </table>
          </div>
        )}
        {tab === 'source' && <pre className='whitespace-pre-wrap break-all text-xs'>{email.source}</pre>}
      </CardContent>
    </Card>
  )
}
