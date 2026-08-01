// Mirrors libs/woodenBaseRates.js's derivation, but for the shop's
// standard sheet of mirror glass - see the 20260804000000-glass-sheet-
// breakage.js migration. Unlike woodenBaseRates.js's result, this is NOT
// wired into the 'mirrorGlass' CostFactor's own $/sq-in rate (which stays
// a manually-entered figure) - it's only an ingredient in the Sheet
// Breakage (Glass) CostFactor's formula (libs/costFactors.js), the same
// role woodenBaseRatePerSqIn() plays in Sheet Breakage (Wood)'s.
//
// Kept dependency-free (no DB, no libs/mirror's jsts), same convention as
// woodenBaseRates.js/machineRates.js - safe to import from a server
// action, a client-side form, or libs/costFactors.js alike. Any missing/
// non-numeric input is treated as 0 rather than NaN/Infinity.
export function glassSheetAreaSqIn( settings )
{
  const width = Number( settings?.glassSheetWidthIn ) || 0
  const height = Number( settings?.glassSheetHeightIn ) || 0

  return width * height
}

export function glassSheetRatePerSqIn( settings )
{
  const area = glassSheetAreaSqIn( settings )

  if( !(area > 0) )
    return 0

  const cost = Number( settings?.glassSheetCostPerSheet ) || 0

  return cost / area
}
