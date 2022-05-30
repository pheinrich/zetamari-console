import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import ButtonGroup from '@mui/material/ButtonGroup'
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
  const allSizeChips = new Set();

  mirror_shapes.forEach( (shape) => {
    allShapeNames.add( shape.name )
    shape.sizes.forEach( (size) => {
      allSizeChips.add( size.chip )
    })
  })

  const id = useId()
  const [expanded, setExpanded] = useState( false )
  const [anchorEl, setAnchorEl] = useState( null )
  const [matchShapes, setMatchShapes] = useState( new Set( allShapeNames ) )
  const [matchSizes, setMatchSizes] = useState( new Set( allSizeChips ) )

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

  const matchAllOrNoneShapes = (allOrNone) => {
    setMatchShapes( new Set( allOrNone ? allShapeNames : [] ) )
  }

  const toggleMatchShape = (shape, shouldMatch) => {
    if( shouldMatch )
      setMatchShapes( prev => new Set( [...prev, shape] ) )
    else
      setMatchShapes( prev => new Set( [...prev].filter( match => match !== shape ) ) )
  }

  const matchAllOrNoneSizes = (allOrNone) => {
    setMatchSizes( new Set( allOrNone ? allSizeChips : [] ) )
  }

  const toggleMatchSize = (size, shouldMatch) => {
    if( shouldMatch )
      setMatchSizes( prev => new Set( [...prev, size] ) )
    else
      setMatchSizes( prev => new Set( [...prev].filter( match => match !== size ) ) )
  }

  const shapeChoices = Array.from( allShapeNames ).sort().map( (name, idx) => {
    return (
      <FormControlLabel
        key={`${id}-shape-${idx}`}
        label={name}
        control={
          <Checkbox
            checked={matchShapes.has( name )}
            onChange={(e) => toggleMatchShape( name, !matchShapes.has( name ) )}
            size='small'
          />
        }
      />
    )
  })

  const sizeChoices = Array.from( allSizeChips ).sort( (a, b) => {
    let rx = /([0-9]+)"/
    let i = parseFloat( rx.exec( a )[1] )
    let j = parseFloat( rx.exec( b )[1] )
    return i - j
  }).map( (chip, idx) => {
    return (
      <FormControlLabel
        key={`${id}-size-${idx}`}
        label={chip}
        control={
          <Checkbox
            checked={matchSizes.has( chip )}
            onChange={(e) => toggleMatchSize( chip, !matchSizes.has( chip ) )}
            size='small'
          />
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
            <Stack direction='row' justifyContent='space-between'>
              Shapes
              <ButtonGroup color='secondary' size='small' variant='contained'>
                <Button
                  disabled={matchShapes.size === allShapeNames.size}
                  onClick={(e) => matchAllOrNoneShapes( true )}
                >All</Button>
                <Button
                  disabled={0 === matchShapes.size}
                  onClick={(e) => matchAllOrNoneShapes( false )}
                >None</Button>
              </ButtonGroup>
            </Stack>
            {shapeChoices}
            <hr/>
            <Stack direction='row' justifyContent='space-between'>
              Sizes
              <ButtonGroup color='secondary' size='small' variant='contained'>
                <Button
                  disabled={matchSizes.size === allSizeChips.size}
                  onClick={(e) => matchAllOrNoneSizes( true )}
                >All</Button>
                <Button
                  disabled={0 === matchSizes.size}
                  onClick={(e) => matchAllOrNoneSizes( false )}
                >None</Button>
              </ButtonGroup>
            </Stack>
            {sizeChoices}
          </Box>
        </Popover>
      }
    </>
  )
}