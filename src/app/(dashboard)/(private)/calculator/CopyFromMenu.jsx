'use client'

import { useState } from 'react'

import Button from '@mui/material/Button'
import ListItemText from '@mui/material/ListItemText'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'

function titleCase( str )
{
  return str.replace( /\w\S*/g, word => word.charAt( 0 ).toUpperCase() + word.slice( 1 ) )
}

// Groups substrate products by the shape of their outside contour - its
// shapeType if it's a basic parametric shape ('chapel arch' -> 'Chapel
// Arch'), or the contour's own name for a custom svgData-traced shape -
// so the picker stays manageable as the product list grows. No schema
// change: this reads the shapeType enum that already exists on Contour.
function groupProducts( substrateProducts )
{
  const groups = new Map()

  for( const product of substrateProducts )
  {
    const outside = product.substrateInfo?.outside
    const key = outside?.shapeType ? titleCase( outside.shapeType ) : (outside?.name ? `Custom: ${outside.name}` : 'Other')

    if( !groups.has( key ) )
      groups.set( key, [] )
    groups.get( key ).push( product )
  }

  for( const list of groups.values() )
    list.sort( (a, b) => a.name.localeCompare( b.name ) )

  return [...groups.entries()].sort( (a, b) => a[0].localeCompare( b[0] ) )
}

// "Copy From..." replaces both the old Prototype dropdown and the
// Revert-to-Prototype-Dimensions menu item: picking a product here always
// initializes the working panel's dimensions/contours/label fresh from
// that product, so re-picking the same product later is how you "revert"
// after drifting from it - there's no ongoing live link to maintain.
// A two-level click-through menu (group -> products) rather than a hover
// flyout, to match the app's other click-opened menus and work on touch.
export default function CopyFromMenu( {substrateProducts, onSelect} )
{
  const [anchorEl, setAnchorEl] = useState( null )
  const [groupAnchorEl, setGroupAnchorEl] = useState( null )
  const [openGroup, setOpenGroup] = useState( null )

  const groups = groupProducts( substrateProducts )

  function close()
  {
    setAnchorEl( null )
    setGroupAnchorEl( null )
    setOpenGroup( null )
  }

  function pick( product )
  {
    onSelect( product )
    close()
  }

  return (
    <>
      <Button
        variant='outlined'
        size='small'
        onClick={evt => setAnchorEl( evt.currentTarget )}
        disabled={0 === substrateProducts.length}
        startIcon={<i className='ri-file-copy-line' />}
      >
        Copy From...
      </Button>

      <Menu anchorEl={anchorEl} open={Boolean( anchorEl )} onClose={close}>
        {groups.map( ([groupName, products]) => (
          <MenuItem
            key={groupName}
            selected={groupName === openGroup}
            onClick={evt => { setGroupAnchorEl( evt.currentTarget ); setOpenGroup( groupName ) }}
          >
            <ListItemText>{groupName}</ListItemText>
            <i className='ri-arrow-right-s-line' />
          </MenuItem>
        ) )}
      </Menu>

      <Menu
        anchorEl={groupAnchorEl}
        open={Boolean( groupAnchorEl )}
        onClose={close}
        anchorOrigin={{vertical: 'top', horizontal: 'right'}}
        transformOrigin={{vertical: 'top', horizontal: 'left'}}
      >
        {groups.find( ([name]) => name === openGroup )?.[1].map( product => (
          <MenuItem key={product.id} onClick={() => pick( product )}>
            {product.name}
          </MenuItem>
        ) )}
      </Menu>
    </>
  )
}
