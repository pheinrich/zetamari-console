// Pure derivations of the Machine-category CostFactors' $/hr rates from
// the shop's Machine Settings (see db/models/Settings.js). Kept
// dependency-free (no DB, no libs/mirror's jsts) so it's safe to import
// from both a server action (db/actions/settings.js, to keep Machine
// Wear/Utilities' CostFactor.rate in sync on every Settings save) and the
// client-side Settings form (SettingsForm.jsx, to show what these
// figures currently work out to as the shop fills them in). Formerly
// bitWear.js, before it grew Utilities' rate alongside Machine Wear's -
// renamed by 20260729000000-power-draw-kw.js.
//
// --- Machine Wear ----------------------------------------------------
//
// (bitLifeSheetsPerBit/cuttingTimeMinPerSheet/bitCostPerBit, added by
// 20260728000000-bit-wear-cost-factor.js) A bit's working life is
// anchored in sheets - how the shop actually tracks bit changes ("swap
// the bit every N sheets") - and everything else is derived from that:
//   life (sheets) x cuttingTimeMinPerSheet -> life (minutes)
//   life (minutes) x feedRateInPerMin      -> life (inches, cut distance)
//   bitCostPerBit / life (in whichever unit) -> $ per that unit
//
// Any missing/non-numeric input (Settings not fully configured yet) is
// treated as 0, same convention as libs/costFactors.js - "not yet
// configured" quietly yields a 0 result rather than NaN/Infinity.
export function bitLifeMinutes( settings )
{
  const sheets = Number( settings?.bitLifeSheetsPerBit ) || 0
  const minPerSheet = Number( settings?.cuttingTimeMinPerSheet ) || 0

  return sheets * minPerSheet
}

export function bitLifeInches( settings )
{
  const feedRate = Number( settings?.feedRateInPerMin ) || 0

  return bitLifeMinutes( settings ) * feedRate
}

export function bitCostPerSheet( settings )
{
  const sheets = Number( settings?.bitLifeSheetsPerBit ) || 0
  const cost = Number( settings?.bitCostPerBit ) || 0

  return sheets > 0 ? cost / sheets : 0
}

export function bitCostPerMinute( settings )
{
  const life = bitLifeMinutes( settings )
  const cost = Number( settings?.bitCostPerBit ) || 0

  return life > 0 ? cost / life : 0
}

export function bitCostPerInch( settings )
{
  const life = bitLifeInches( settings )
  const cost = Number( settings?.bitCostPerBit ) || 0

  return life > 0 ? cost / life : 0
}

// The Machine Wear CostFactor's rate, $/hr - see db/actions/settings.js's
// updateSettings(). Minutes is the "natural" derived unit above (matching
// cuttingTimeMinPerSheet and every other machine-run-time figure in the
// app), so this is just bitCostPerMinute() scaled up x60 rather than a
// separately-tracked bitLifeHours. (Equivalent to bitCostPerInch(settings)
// x cutDistance for any one product, since cutDistance/feedRateInPerMin
// is exactly that product's cutting minutes - Machine Wear's cost comes
// out the same $ whether you think of it as "$/inch over inches cut" or
// "$/hour over hours cut".)
export function bitCostPerHour( settings )
{
  return bitCostPerMinute( settings ) * 60
}

// --- Utilities ---------------------------------------------------------
//
// (powerDrawKw/electricityRatePerKwh) The Utilities CostFactor's rate,
// $/hr - the electricity cost of running the machine for one hour.
// powerDrawKw is a rate (kilowatts - how fast the machine draws energy
// while running), not an energy quantity, so kW x $/kWh already comes
// out in $/hr directly, no further unit juggling needed (unlike Machine
// Wear above, there's no "life" to divide by - electricity cost doesn't
// wear out).
export function utilitiesCostPerHour( settings )
{
  const powerDraw = Number( settings?.powerDrawKw ) || 0
  const electricityRate = Number( settings?.electricityRatePerKwh ) || 0

  return powerDraw * electricityRate
}
