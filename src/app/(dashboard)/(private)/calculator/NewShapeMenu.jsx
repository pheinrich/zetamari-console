'use client'

import { useState } from 'react'

import Button from '@mui/material/Button'
import Divider from '@mui/material/Divider'
import ListItemText from '@mui/material/ListItemText'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import Tooltip from '@mui/material/Tooltip'

// Replaces the plain "New" button (a single blank-shape reset) with a
// dropdown offering each basic/parametric shape family (Chapel Arch,
// Circle, Gothic Arch, Oval, Rectangle, Square, Vesica Piscis - see the
// 20260715000000-shape-types.js migration's key-bearing ShapeType rows)
// alongside the original "Blank Shape" reset. Picking a shape family
// seeds typical dimensions/border for it - see MirrorCalculator.jsx's
// handleNewShape(), which resolves the actual outsideId/width/height/
// border from the first Wooden Base product using that shape family
// (falling back to that family's first Contour + generic 6x6/1 defaults
// if no product uses it yet). `onSelect(shapeType)` receives the raw
// ShapeType row, or `null` for "Blank Shape" - resolution happens in the
// caller, same division of labor as CopyFromMenu's onSelect(product).
export default function NewShapeMenu( {shapeTypes, contours, onSelect} )
{
  const [anchorEl, setAnchorEl] = useState( null )

  const basicShapeTypes = shapeTypes.filter( s => s.key )

  function close()
  {
    setAnchorEl( null )
  }

  function pick( shapeType )
  {
    onSelect( shapeType )
    close()
  }

  return (
    <>
      <Button
        variant='outlined'
        size='small'
        onClick={evt => setAnchorEl( evt.currentTarget )}
        startIcon={<i className='ri-add-line' />}
      >
        New
      </Button>

      <Menu anchorEl={anchorEl} open={Boolean( anchorEl )} onClose={close}>
        <MenuItem onClick={() => pick( null )}>
          <ListItemText>Blank Shape</ListItemText>
        </MenuItem>
        <Divider />
        {basicShapeTypes.map( shapeType => {
          const hasContour = contours.some( c => c.shape?.key === shapeType.key )

          return (
            <Tooltip
              key={shapeType.id}
              title={hasContour ? '' : 'No contour exists for this shape yet'}
            >
              {/* span wrapper so the Tooltip still works on a disabled
                  (pointer-events:none) MenuItem */}
              <span>
                <MenuItem onClick={() => pick( shapeType )} disabled={!hasContour}>
                  <ListItemText>{shapeType.name}</ListItemText>
                </MenuItem>
              </span>
            </Tooltip>
          )
        } )}
      </Menu>
    </>
  )
}
