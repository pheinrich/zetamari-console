// Artful Home item number -> our SKU, used by parseArtfulHomeOrder().
//
// Artful Home identifies products by its own item numbers
// ("P07859-P00152"), and one item number covers every size/colour of a
// listing - the order email gives that as its "Variation Title"
// ("Small", "Small, Sweet Fern"). So each entry is either a SKU string,
// when the item has only one product, or an object keyed by variation
// title (exactly as the email shows it; matched ignoring case and extra
// spaces). Older emails, and listings without variations, have no
// variation title - key those as ''.
//
// A null SKU (or a missing entry) leaves the line unmatched, keeping
// Artful Home's item number as its SKU for someone to resolve at review.
// The entries below are every item/variation seen in order emails
// through 2026-11, with SKUs still to fill in.
export const ARTFUL_HOME_SKUS = {
  'P07859-P00031': { // "Seafoam Drop", Mosaic Mirror (2023)
    'Medium': null,
  },
  'P07859-P00107': { // "Clouds", Art Glass Mirror (2025)
    '': null,
  },
  'P07859-P00113': { // "Ebony Mirror", Mosaic Mirror (2022)
    'Large': null,
  },
  'P07859-P00117': { // "Willow Leaf", Art Glass Mirror (2026)
    'Aquamarine': null,
  },
  'P07859-P00144': { // "Starlight Mandala, Sweet Fern", Art Glass Mirror (2026)
    'Small, Sweet Fern': null,
  },
  'P07859-P00152': { // "Golden Meadow", Mosaic Mirror (2026)
    'Small': null,
  },
}

// -> our SKU for an Artful Home item number + variation title, or null.
export function artfulHomeSku( item, variation )
{
  const entry = ARTFUL_HOME_SKUS[item]

  if( typeof entry === 'string' || entry == null )
    return entry ?? null

  const key = normalize( variation )
  const match = Object.keys( entry ).find( k => normalize( k ) === key )

  return match === undefined ? null : entry[match]
}

function normalize( text )
{
  return (text ?? '').replace( /\s+/g, ' ' ).trim().toLowerCase()
}
