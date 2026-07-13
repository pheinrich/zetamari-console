// Shared icon/color/label metadata for a product's `type`, used by both the
// list table and the filters card. `null` (no type set) means a
// finished/assembled product with no type-specific Info row.
export const PRODUCT_TYPE_META = {
  bead: { label: 'Bead', icon: 'ri-drop-line', color: 'info' },
  birdhouse: { label: 'Birdhouse', icon: 'ri-home-4-line', color: 'success' },
  frame: { label: 'Frame', icon: 'ri-gallery-line', color: 'warning' },
  grout: { label: 'Grout', icon: 'ri-grid-line', color: 'secondary' },
  millefiori: { label: 'Millefiori', icon: 'ri-sparkling-2-line', color: 'error' },
  mirror: { label: 'Mirror', icon: 'ri-contrast-2-line', color: 'primary' },
  substrate: { label: 'Substrate', icon: 'ri-layout-grid-line', color: 'primary' },
  tile: { label: 'Tile', icon: 'ri-layout-4-line', color: 'secondary' },
  other: { label: 'Other', icon: 'ri-question-line', color: 'secondary' },
}

// No `color` here (rather than an invalid MUI palette key) - CustomAvatar
// just renders a plain, uncolored avatar when color is undefined.
export const ASSEMBLED_TYPE_META = { label: 'Assembled', icon: 'ri-stack-line' }

export function productTypeMeta( type )
{
  return type ? (PRODUCT_TYPE_META[type] ?? ASSEMBLED_TYPE_META) : ASSEMBLED_TYPE_META
}
