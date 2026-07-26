// Pure derivation of the Wooden Base Material CostFactor's $/sq-in rate
// from the shop's standard sheet of plywood's cost and dimensions,
// rather than a manually-entered per-sq-in figure - see the
// 20260731000000-sheet-breakage-cost-factor.js migration. A sheet's
// usable area is sheetWidthIn x sheetHeightIn (defaulting to 48.5" x
// 96.5" - a nominal 4'x8' sheet minus unusable edge trim);
// sheetCostPerSheet is what a full sheet actually costs, delivered.
//
// Kept dependency-free (no DB, no libs/mirror's jsts), same convention
// as machineRates.js, so it's safe to import from a server action
// (db/actions/settings.js, to keep the Wooden Base CostFactor's rate in
// sync on every Settings save), the client-side Settings form
// (SettingsForm.jsx, to show what this figure currently works out to as
// the shop fills the fields in), and libs/costFactors.js - which needs
// this same rate as an ingredient in the Sheet Breakage CostFactor's
// formula (sheetCostPerSheet/piecesPerSheet minus a piece's own sq-in
// share, at this rate), not just as a multiplier applied afterward the
// way every other Material factor's rate is. Any missing/non-numeric
// input is treated as 0, same convention as machineRates.js - "not yet
// configured" quietly yields a 0 result rather than NaN/Infinity.
export function woodSheetAreaSqIn( settings )
{
  const width = Number( settings?.sheetWidthIn ) || 0
  const height = Number( settings?.sheetHeightIn ) || 0

  return width * height
}

export function woodenBaseRatePerSqIn( settings )
{
  const area = woodSheetAreaSqIn( settings )

  if( !(area > 0) )
    return 0

  const cost = Number( settings?.sheetCostPerSheet ) || 0

  return cost / area
}
