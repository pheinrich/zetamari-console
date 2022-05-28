import Popover from '@mui/material/Popover'

export default function CatalogSearchOptions( { expanded, anchorEl, handleClose, options } )
{
  return (
    <>
      { !expanded ||
        <Popover
          id='search-options'
          open={expanded}
          anchorEl={anchorEl}
          onClose={handleClose}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'left',
          }}
        >
          This is the content.
        </Popover>
      }
    </>
  )
}
