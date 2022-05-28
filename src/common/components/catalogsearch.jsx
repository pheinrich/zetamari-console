import CatalogSearchOptions from './catalogsearchoptions'
import ExpandLessIcon from '@mui/icons-material/ExpandLess'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import IconButton from '@mui/material/IconButton'
import Stack from '@mui/material/Stack'
import TextField from '@mui/material/TextField'
import {useState} from 'react'

export default function CatalogSearch()
{
  const [expanded, setExpanded] = useState( false )
  const [anchorEl, setAnchorEl] = useState( null )
  const searchTermsId = 'searchterms'

  const expandOptions = () =>
  {
    setExpanded( true );
    setAnchorEl( document.getElementById( searchTermsId ) )
  }

  const collapseOptions = () =>
  {
    setExpanded( false )
    setAnchorEl( null )
  }

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
        <TextField id={searchTermsId} label='Search' size='small' variant='outlined' />
      </Stack>
      <CatalogSearchOptions
        expanded={expanded}
        anchorEl={anchorEl}
        handleClose={collapseOptions} />
    </>
  )
}