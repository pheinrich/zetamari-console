export function formatCurrency( amount )
{
  return amount === null || amount === undefined
    ? '—'
    : new Intl.NumberFormat( 'en-US', {style: 'currency', currency: 'USD'} ).format( amount )
}
