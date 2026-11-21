import InputAdornment from '@mui/material/InputAdornment'

// Shared unit/money presentation, so every input box and read-out in the
// app shows its units the same way:
//
//   - every numeric input carries its unit as an InputAdornment
//     (unitInputProps( 'in' ), unitInputProps( 'sq-in / hr' ))
//   - a dollar input reads "$ [amount] / unit" - a '$' start adornment
//     plus a "/ unit" end adornment (dollarInputProps( 'sheet' )), or just
//     the '$' when it isn't a per-unit figure (dollarInputProps())
//   - a dollar read-out is formatDollars( amount ), and a per-unit one is
//     formatDollarsPer( amount, 'sheet' ) -> "$12.5000 / sheet"
//   - any "per" unit has spaces around its slash: "in / min", never "in/min"

// More decimal places than formatCurrency() (products/productFormat.js)
// bothers with - that's built for whole-dollar retail/wholesale prices,
// while a per-inch or per-minute bit cost is typically a small fraction
// of a cent and would just round away to "$0.00" at 2 decimals.
export function formatDollars( amount )
{
  return `$${(amount || 0).toFixed( 4 )}`
}

// "sq-in/hr" -> "sq-in / hr"
export function formatUnit( unit )
{
  return String( unit ?? '' ).replace( /\s*\/\s*/g, ' / ' ).trim()
}

export function formatDollarsPer( amount, unit )
{
  return `${formatDollars( amount )} / ${formatUnit( unit )}`
}

function endAdornment( text )
{
  return <InputAdornment position='end' className='whitespace-nowrap'>{text}</InputAdornment>
}

// For a TextField's InputProps (or slotProps.input). A falsy unit gives
// no adornment, so callers can pass a unit that may not be known yet.
export function unitInputProps( unit )
{
  return unit ? {endAdornment: endAdornment( formatUnit( unit ) )} : {}
}

export function dollarInputProps( perUnit )
{
  return {
    startAdornment: <InputAdornment position='start'>$</InputAdornment>,
    ...(perUnit && {endAdornment: endAdornment( `/ ${formatUnit( perUnit )}` )}),
  }
}
