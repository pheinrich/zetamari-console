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

import CameraIcon from '@mui/icons-material/CameraAlt'

export default function SnapshotDialog( {imageRef} )
{
  const [open, setOpen] = useState( false );

  function downloadImage( width )
  {
    let img = new Image();
    let svgXML = new XMLSerializer().serializeToString( imageRef.current );

    img.onload = () => {
      let targetWidth = parseFloat( width );
      let ratio = img.width / img.height;
      let canvas = document.createElement( 'canvas' );

      canvas.width = targetWidth;
      canvas.height = targetWidth / ratio;
      canvas.getContext( '2d' ).drawImage( img, 0, 0, canvas.width, canvas.height );

      let dlLink = document.createElement( 'a' );

      dlLink.download = 'image';
      dlLink.href = canvas.toDataURL( 'image/png' );
      dlLink.dataset.downloadurl = `image/png:image:${dlLink.href}`;

      document.body.appendChild(dlLink);
      dlLink.click();
      document.body.removeChild(dlLink);
    }

    img.src = `data:image/svg+xml;base64,${window.btoa( svgXML )}`;
  }

  return (
    <>
      <IconButton onClick={() => setOpen( true )}>
        <CameraIcon />
      </IconButton>

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

          <TextField
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
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen( false )}>Cancel</Button>
          <Button type="submit">Save to Disk</Button>
        </DialogActions>
      </Dialog>
    </>
  )
}
