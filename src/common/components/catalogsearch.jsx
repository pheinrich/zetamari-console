import Box from '@mui/material/Box'
import Checkbox from '@mui/material/Checkbox'
import ExpandLessIcon from '@mui/icons-material/ExpandLess'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import FormControlLabel from '@mui/material/FormControlLabel'
import IconButton from '@mui/material/IconButton'
import Popover from '@mui/material/Popover'
import Stack from '@mui/material/Stack'
import TextField from '@mui/material/TextField'
import {useId, useState} from 'react'
import {mirror_shapes} from '../mirror_shapes'

export default function CatalogSearch()
{
  const allShapeNames = new Set();
  const allChips = new Set();

  mirror_shapes.forEach( (shape) => {
    allShapeNames.add( shape.name )
    shape.sizes.forEach( (size) => {
      allChips.add( size )
    })
  })

  const id = useId()
  const [expanded, setExpanded] = useState( false )
  const [anchorEl, setAnchorEl] = useState( null )
  const [options, setOptions] = useState({
    matchShapeNames: new Set( allShapeNames ),
    matchChips: new Set( allChips ),
  })

  const expandOptions = () =>
  {
    setExpanded( true );
    setAnchorEl( document.getElementById( `${id}-searchterms` ) )
  }

  const collapseOptions = () =>
  {
    setExpanded( false )
    setAnchorEl( null )
  }

  const toggleShape = (name, add) => {
    add ? options.matchShapeNames.add( name ) : options.matchShapeNames.delete( name )
    setOptions( options )
  }

  let shapeChoices = Array.from( allShapeNames ).sort().map( (name, idx) => {
    return (
      <FormControlLabel
        key={`${id}-shape-${idx}`}
        label={name}
        control={ options.matchShapeNames.has( name )
          ? <Checkbox defaultChecked onChange={(e) => toggleShape( name, false )} />
          : <Checkbox onChange={(e) => toggleShape( name, true )} />
        }
      />
    )
  })

  return (
    <>
      <Stack direction='row'>
        { expanded ?
          <IconButton aria-label='collapse options' onClick={collapseOptions}>
            <ExpandLessIcon />
          </IconButton>
          :
          <IconButton aria-label='expand options' onClick={expandOptions}>
            <ExpandMoreIcon />
          </IconButton>
        }
        <TextField id={`${id}-searchterms`} label='Search' size='small' variant='outlined' />
      </Stack>
      { !expanded ||
        <Popover
          id='search-options'
          open={expanded}
          anchorEl={anchorEl}
          onClose={collapseOptions}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'left',
          }}
        >
          <Box sx={{ p: 2, width: 500 }}>
            Shapes<br/>
            {shapeChoices}
          </Box>
        </Popover>
      }
    </>
  )
}