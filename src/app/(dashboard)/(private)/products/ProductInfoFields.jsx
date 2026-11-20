'use client'

import FormControl from '@mui/material/FormControl'
import Grid from '@mui/material/Grid2'
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import Select from '@mui/material/Select'
import TextField from '@mui/material/TextField'

// The two Pieces Per Sheet fields are controlled when the caller passes an
// onChange (ProductForm, which shares them with its Cost Breakdown card),
// uncontrolled otherwise.
function sheetProps( value, onChange, initial )
{
  return onChange
    ? {value: value ?? '', onChange: (e) => onChange( e.target.value )}
    : {defaultValue: initial ?? ''}
}

// The type-specific "<Type> Details" inputs, named `<infoKey>.<field>` (see
// productInfo.js's INFO_KEY/infoSchemas). Shared by the full product form
// and the product page's Overview tab popup. Must sit inside a Grid
// container. `info` is the existing Info row, if any.
export default function ProductInfoFields( {
  type,
  info,
  contourList = [],
  piecesPerSheet,
  onPiecesPerSheetChange,
  glassPiecesPerSheet,
  onGlassPiecesPerSheetChange,
} )
{
  return (
    <>
      {type === 'bead' && (
        <>
          <Grid size={{ xs: 12, sm: 4 }}>
            <FormControl fullWidth>
              <InputLabel id='beadInfo-category'>Category</InputLabel>
              <Select labelId='beadInfo-category' label='Category' name='beadInfo.category' defaultValue={info?.category || 'plastic'}>
                <MenuItem value='glass'>Glass</MenuItem>
                <MenuItem value='metal'>Metal</MenuItem>
                <MenuItem value='plastic'>Plastic</MenuItem>
                <MenuItem value='ceramic'>Ceramic</MenuItem>
                <MenuItem value='shell'>Shell</MenuItem>
                <MenuItem value='rhinestone'>Rhinestone</MenuItem>
                <MenuItem value='other'>Other</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid size={{ xs: 12, sm: 4 }}>
            <FormControl fullWidth>
              <InputLabel id='beadInfo-finish'>Finish</InputLabel>
              <Select labelId='beadInfo-finish' label='Finish' name='beadInfo.finish' defaultValue={info?.finish || 'plain'}>
                <MenuItem value='fire-polished'>Fire-Polished</MenuItem>
                <MenuItem value='silvered'>Silvered</MenuItem>
                <MenuItem value='opaque'>Opaque</MenuItem>
                <MenuItem value='opaque luster'>Opaque Luster</MenuItem>
                <MenuItem value='transparent'>Transparent</MenuItem>
                <MenuItem value='aurora borealis'>Aurora Borealis</MenuItem>
                <MenuItem value='plain'>Plain</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid size={{ xs: 12, sm: 4 }}>
            <FormControl fullWidth>
              <InputLabel id='beadInfo-shape'>Shape</InputLabel>
              <Select labelId='beadInfo-shape' label='Shape' name='beadInfo.shape' defaultValue={info?.shape || 'round'}>
                <MenuItem value='round'>Round</MenuItem>
                <MenuItem value='faceted round'>Faceted Round</MenuItem>
                <MenuItem value='rondelle'>Rondelle</MenuItem>
                <MenuItem value='drop'>Drop</MenuItem>
                <MenuItem value='bicone'>Bicone/Diamond</MenuItem>
                <MenuItem value='rivoli'>Rivoli</MenuItem>
                <MenuItem value='chaton'>Chaton</MenuItem>
                <MenuItem value='other'>Other</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid size={{ xs: 12, sm: 3 }}>
            <TextField fullWidth label='Color' name='beadInfo.color' defaultValue={info?.color || ''} required />
          </Grid>
          <Grid size={{ xs: 12, sm: 3 }}>
            <TextField fullWidth label='Length' name='beadInfo.length' defaultValue={info?.length || ''} />
          </Grid>
          <Grid size={{ xs: 12, sm: 3 }}>
            <TextField fullWidth label='Height' name='beadInfo.height' defaultValue={info?.height || ''} />
          </Grid>
          <Grid size={{ xs: 12, sm: 3 }}>
            <TextField fullWidth label='Thickness' name='beadInfo.thickness' defaultValue={info?.thickness || ''} />
          </Grid>
        </>
      )}

      {type === 'picture frame' && (
        <>
          <Grid size={{ xs: 12, sm: 3 }}>
            <TextField fullWidth label='Width' name='pictureFrameInfo.width' defaultValue={info?.width || ''} />
          </Grid>
          <Grid size={{ xs: 12, sm: 3 }}>
            <TextField fullWidth label='Height' name='pictureFrameInfo.height' defaultValue={info?.height || ''} />
          </Grid>
          <Grid size={{ xs: 12, sm: 3 }}>
            <TextField fullWidth label='Thickness' name='pictureFrameInfo.thickness' defaultValue={info?.thickness || ''} />
          </Grid>
          <Grid size={{ xs: 12, sm: 3 }}>
            <TextField fullWidth label='Channel' name='pictureFrameInfo.channel' defaultValue={info?.channel} />
          </Grid>
          <Grid size={{ xs: 12, sm: 3 }}>
            <TextField fullWidth label='Border' name='pictureFrameInfo.border' defaultValue={info?.border || '1'} />
          </Grid>
          <Grid size={{ xs: 12, sm: 3 }}>
            <TextField fullWidth label='Photo Width' name='pictureFrameInfo.photoWidth' defaultValue={info?.photoWidth || 4} />
          </Grid>
          <Grid size={{ xs: 12, sm: 3 }}>
            <TextField fullWidth label='Photo Height' name='pictureFrameInfo.photoHeight' defaultValue={info?.photoHeight || 6} />
          </Grid>
        </>
      )}

      {type === 'millefiori' && (
        <>
          <Grid size={{ xs: 12, sm: 4 }}>
            <FormControl fullWidth>
              <InputLabel id='millefioriInfo-shape'>Shape</InputLabel>
              <Select labelId='millefioriInfo-shape' label='Shape' name='millefioriInfo.shape' defaultValue={info?.shape || 'round'}>
                <MenuItem value='round'>Round</MenuItem>
                <MenuItem value='square'>Square</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid size={{ xs: 12, sm: 4 }}>
            <TextField fullWidth label='Color' name='millefioriInfo.color' defaultValue={info?.color || ''} />
          </Grid>
          <Grid size={{ xs: 12, sm: 4 }}>
            <TextField fullWidth label='Length' name='millefioriInfo.length' defaultValue={info?.length || ''} />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField fullWidth label='Width' name='millefioriInfo.width' defaultValue={info?.width || ''} />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField fullWidth label='Height' name='millefioriInfo.height' defaultValue={info?.height || ''} />
          </Grid>
        </>
      )}

      {type === 'mirror glass' && (
        <>
          <Grid size={{ xs: 12, sm: 4 }}>
            <FormControl fullWidth>
              <InputLabel id='mirrorGlassInfo-shape'>Shape</InputLabel>
              <Select labelId='mirrorGlassInfo-shape' label='Shape' name='mirrorGlassInfo.shape' defaultValue={info?.shape || 'circle'}>
                <MenuItem value='chapel arch'>Chapel Arch</MenuItem>
                <MenuItem value='circle'>Circle</MenuItem>
                <MenuItem value='gothic arch'>Gothic Arch</MenuItem>
                <MenuItem value='oval'>Oval</MenuItem>
                <MenuItem value='rectangle'>Rectangle</MenuItem>
                <MenuItem value='square'>Square</MenuItem>
                <MenuItem value='vesica piscis'>Vesica Piscis</MenuItem>
                <MenuItem value='other'>Other</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid size={{ xs: 12, sm: 4 }}>
            <TextField fullWidth label='Width' name='mirrorGlassInfo.width' defaultValue={info?.width || ''} />
          </Grid>
          <Grid size={{ xs: 12, sm: 4 }}>
            <TextField fullWidth label='Height' name='mirrorGlassInfo.height' defaultValue={info?.height || ''} />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField fullWidth label='Thickness' name='mirrorGlassInfo.thickness' defaultValue={info?.thickness || ''} />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField fullWidth label='Bevel' name='mirrorGlassInfo.bevel' defaultValue={info?.bevel || 0} />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <FormControl fullWidth>
              <InputLabel id='mirrorGlassInfo-contourId'>Contour (optional)</InputLabel>
              <Select
                labelId='mirrorGlassInfo-contourId'
                label='Contour (optional)'
                name='mirrorGlassInfo.contourId'
                defaultValue={info?.contourId || ''}
              >
                <MenuItem value=''>None (use Shape above)</MenuItem>
                {contourList.map( (contour) => (
                  <MenuItem key={`mgc-${contour.id}`} value={contour.id}>{contour.name}</MenuItem>
                ) )}
              </Select>
            </FormControl>
          </Grid>
        </>
      )}

      {type === 'wooden base' && (
        <>
          <Grid size={{ xs: 12, sm: 4 }}>
            <FormControl fullWidth required>
              <InputLabel id='woodenBaseInfo-outsideId'>Outside Contour</InputLabel>
              <Select
                labelId='woodenBaseInfo-outsideId'
                label='Outside Contour'
                name='woodenBaseInfo.outsideId'
                defaultValue={info?.outsideId || ''}
              >
                {contourList.map( (contour) => (
                  <MenuItem key={`oc-${contour.id}`} value={contour.id}>{contour.name}</MenuItem>
                ) )}
              </Select>
            </FormControl>
          </Grid>
          <Grid size={{ xs: 12, sm: 4 }}>
            <FormControl fullWidth>
              <InputLabel id='woodenBaseInfo-insideId'>Inside Contour</InputLabel>
              <Select
                labelId='woodenBaseInfo-insideId'
                label='Inside Contour'
                name='woodenBaseInfo.insideId'
                defaultValue={info?.insideId || ''}
              >
                <MenuItem value=''>None</MenuItem>
                {contourList.map( (contour) => (
                  <MenuItem key={`ic-${contour.id}`} value={contour.id}>{contour.name}</MenuItem>
                ) )}
              </Select>
            </FormControl>
          </Grid>
          <Grid size={{ xs: 12, sm: 4 }}>
            <FormControl fullWidth>
              <InputLabel id='woodenBaseInfo-rabbetId'>Rabbet Contour</InputLabel>
              <Select
                labelId='woodenBaseInfo-rabbetId'
                label='Rabbet Contour'
                name='woodenBaseInfo.rabbetId'
                defaultValue={info?.rabbetId || ''}
              >
                <MenuItem value=''>None</MenuItem>
                {contourList.map( (contour) => (
                  <MenuItem key={`rc-${contour.id}`} value={contour.id}>{contour.name}</MenuItem>
                ) )}
              </Select>
            </FormControl>
          </Grid>
          <Grid size={{ xs: 12, sm: 3 }}>
            <TextField fullWidth label='Width' name='woodenBaseInfo.width' defaultValue={info?.width || ''} />
          </Grid>
          <Grid size={{ xs: 12, sm: 3 }}>
            <TextField fullWidth label='Height' name='woodenBaseInfo.height' defaultValue={info?.height || ''} />
          </Grid>
          <Grid size={{ xs: 12, sm: 3 }}>
            <TextField fullWidth label='Thickness' name='woodenBaseInfo.thickness' defaultValue={info?.thickness || '0.455'} />
          </Grid>
          <Grid size={{ xs: 12, sm: 3 }}>
            <TextField fullWidth label='Border' name='woodenBaseInfo.border' defaultValue={info?.border || '1'} />
          </Grid>
          <Grid size={{ xs: 12, sm: 3 }}>
            <TextField
              fullWidth
              label='Pieces Per Sheet (Wood)'
              name='woodenBaseInfo.piecesPerSheet'
              {...sheetProps( piecesPerSheet, onPiecesPerSheetChange, info?.piecesPerSheet )}
              helperText='Blank = compute automatically'
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 3 }}>
            <TextField
              fullWidth
              label='Pieces Per Sheet (Glass)'
              name='woodenBaseInfo.glassPiecesPerSheet'
              {...sheetProps( glassPiecesPerSheet, onGlassPiecesPerSheetChange, info?.glassPiecesPerSheet )}
              helperText='Blank = compute automatically'
            />
          </Grid>
        </>
      )}

      {type === 'birdhouse base' && (
        <>
          <Grid size={{ xs: 12, sm: 4 }}>
            <TextField fullWidth label='Width' name='birdhouseBaseInfo.width' defaultValue={info?.width || ''} />
          </Grid>
          <Grid size={{ xs: 12, sm: 4 }}>
            <TextField fullWidth label='Height' name='birdhouseBaseInfo.height' defaultValue={info?.height || ''} />
          </Grid>
          <Grid size={{ xs: 12, sm: 4 }}>
            <TextField fullWidth label='Depth' name='birdhouseBaseInfo.depth' defaultValue={info?.depth || ''} />
          </Grid>
        </>
      )}

      {type === 'tile' && (
        <>
          <Grid size={{ xs: 12, sm: 3 }}>
            <TextField fullWidth label='Color' name='tileInfo.color' defaultValue={info?.color || ''} required />
          </Grid>
          <Grid size={{ xs: 12, sm: 3 }}>
            <TextField fullWidth label='Width' name='tileInfo.width' defaultValue={info?.width || ''} />
          </Grid>
          <Grid size={{ xs: 12, sm: 3 }}>
            <TextField fullWidth label='Height' name='tileInfo.height' defaultValue={info?.height || ''} />
          </Grid>
          <Grid size={{ xs: 12, sm: 3 }}>
            <TextField fullWidth label='Thickness' name='tileInfo.thickness' defaultValue={info?.thickness || ''} />
          </Grid>
        </>
      )}
    </>
  )
}
