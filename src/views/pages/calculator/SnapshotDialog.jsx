import { useState } from 'react'

import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'
import InputAdornment from '@mui/material/InputAdornment'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogContentText from '@mui/material/DialogContentText'
import DialogTitle from '@mui/material/DialogTitle'
import TextField from '@mui/material/TextField'
import Tooltip from '@mui/material/Tooltip'

import CameraIcon from '@mui/icons-material/CameraAlt'

export default function SnapshotDialog( {imageRef} )
{
  const [open, setOpen] = useState( false );

  function downloadImage( width )
  {
    const img = document.createElement('img')
    const html = new XMLSerializer().serializeToString( imageRef.current )

    img.onload = (e) =>
    {
      const canvas = document.createElement( 'canvas' )

      canvas.width = parseFloat( width )
      canvas.height = canvas.width * (e.target.height / e.target.width)
      canvas.getContext( '2d' ).drawImage( e.target, 0, 0, canvas.width, canvas.height )

      let anchor = document.createElement( 'a' )
      anchor.download = 'image2.png'

      canvas.toBlob( (blob) => {
        anchor.href = URL.createObjectURL( blob )
        anchor.click()
      }, 'image/png' )
    }

    img.src = 'data:image/svg+xml,' + encodeURIComponent( `<svg xmlns="http://www.w3.org/2000/svg" width="${imageRef.current.offsetWidth}" height="${imageRef.current.offsetHeight}"><foreignObject width="100%" height="100%"><div xmlns="http://www.w3.org/1999/xhtml">${html}</div></foreignObject></svg>` )
  }

  return (
    <>
      <Tooltip title={'Take a Snapshot'}>
        <IconButton onClick={() => setOpen( true )}>
          <CameraIcon />
        </IconButton>
      </Tooltip>

      <Dialog
        open={open}
        onClose={() => setOpen( false )}
        PaperProps={{
          component: 'form',
          onSubmit: (event) =>
          {
            event.preventDefault()
            
            const formData = new FormData( event.currentTarget )
            const formJson = Object.fromEntries( formData.entries() )

            setOpen( false )
            downloadImage( formJson.width )
          },
        }}
      >
        <DialogTitle>Snapshot</DialogTitle>
        <DialogContent>
          <DialogContentText>
            This image may be scaled smoothly to any arbitrary size&mdash;simply
            specify a target width in pixels for the resulting PNG output file.
          </DialogContentText>

          <div style={{display: 'flex', justifyContent: 'center'}}>
            <TextField
              style={{width: 150}}
              autoFocus
              defaultValue='750'
              required
              margin='normal'
              id='width'
              name='width'
              helperText='Target Width'
              variant='outlined'
              InputProps={{
                endAdornment: <InputAdornment position='end'>px</InputAdornment>
              }}
            />
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen( false )}>Cancel</Button>
          <Button type="submit">Save to Disk</Button>
        </DialogActions>
      </Dialog>
    </>
  )
}
