import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import ButtonGroup from '@mui/material/ButtonGroup'
import Checkbox from '@mui/material/Checkbox'
import ExpandLessIcon from '@mui/icons-material/ExpandLess'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import FormControlLabel from '@mui/material/FormControlLabel'
import IconButton from '@mui/material/IconButton'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemText from '@mui/material/ListItemText'
import Popover from '@mui/material/Popover'
import Stack from '@mui/material/Stack'
import TextField from '@mui/material/TextField'
import {useId, useState} from 'react'
import {useDispatch, useSelector} from 'react-redux'
import {mirror_shapes} from '../mirror_shapes'
import {
  matchAllShapes, unmatchAllShapes,
  matchShape, unmatchShape,
  matchAllSizes, unmatchAllSizes,
  matchSize, unmatchSize,
  selectMatchShapes, selectMatchSizes
} from '../../features/search/searchSlice'

export default function CatalogSearch()
{
  const id = useId()
  const [expanded, setExpanded] = useState( false )
  const [anchorEl, setAnchorEl] = useState( null )
  const [matchText, setMatchText] = useState( null )
  const matchShapes = useSelector( selectMatchShapes )
  const matchSizes = useSelector( selectMatchSizes )
  const dispatch = useDispatch()

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

  const searchTerms = (e) =>
  {
    setMatchText( e.target.value )
  }

  const shapeChoices = Array.from( mirror_shapes.allShapeNames ).sort().map( (name, idx) => {
    const checked = matchShapes.includes( name )
    return (
      <FormControlLabel
        key={`${id}-shape-${idx}`}
        label={name}
        control={
          <Checkbox
            checked={checked}
            onChange={(e) => dispatch( checked ? unmatchShape( name ) : matchShape( name ) )}
            size='small'
          />
        }
      />
    )
  })

  const sizeChoices = Array.from( mirror_shapes.allSizeChips ).sort( (a, b) => {
    let rx = /([0-9]+)"/
    let i = parseFloat( rx.exec( a )[1] )
    let j = parseFloat( rx.exec( b )[1] )
    return i - j
  }).map( (chip, idx) => {
    const checked = matchSizes.includes( chip )
    return (
      <FormControlLabel
        key={`${id}-size-${idx}`}
        label={chip}
        control={
          <Checkbox
            checked={checked}
            onChange={(e) => dispatch( checked ? unmatchSize( chip ) : matchSize( chip ) )}
            size='small'
          />
        }
      />
    )
  })

  const matchedShapes = mirror_shapes.presets.filter( (item) => {
    let matched = matchShapes.includes( item.shape ) && matchSizes.includes( item.chip )

    if( matched && matchText )
    {
      matched = matchText.split( ' ' ).reduce( (acc, term) => {
        let regex = new RegExp( term, 'i' )
        return acc &= regex.test( item.shape + item.sku + item.name )
      }, true )
    }
    return matched
  }).map( (item, idx) => {
    return (
      <ListItem key={idx} component='div' disablePadding>
        <ListItemButton>
          <ListItemText primary={item.name} secondary={item.sku}/>
        </ListItemButton>
      </ListItem>
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
        <TextField
          id={`${id}-searchterms`}
          label='Search'
          onChange={(e) => setMatchText( e.target.value )}
          size='small'
          variant='outlined'
        />
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
                  disabled={matchShapes.length === mirror_shapes.allShapeNames.length}
                  onClick={(e) => dispatch( matchAllShapes() )}
                >All</Button>
                <Button
                  disabled={0 === matchShapes.length}
                  onClick={(e) => dispatch( unmatchAllShapes() )}
                >None</Button>
              </ButtonGroup>
            </Stack>
            {shapeChoices}

            <hr/>

            <Stack direction='row' justifyContent='space-between'>
              Sizes
              <ButtonGroup color='secondary' size='small' variant='contained'>
                <Button
                  disabled={matchSizes.length === mirror_shapes.allSizeChips.length}
                  onClick={(e) => dispatch( matchAllSizes() )}
                >All</Button>
                <Button
                  disabled={0 === matchSizes.length}
                  onClick={(e) => dispatch( unmatchAllSizes() )}
                >None</Button>
              </ButtonGroup>
            </Stack>
            {sizeChoices}
          </Box>
        </Popover>
      }
      <List
        dense
        sx={{ mt: 1, p: 0.25, border: '1px solid lightgray', width: '20em', maxHeight: '35em', minHeight: '35em', overflow: 'auto' }}
      >
        {matchedShapes}
      </List>
    </>
  )
}