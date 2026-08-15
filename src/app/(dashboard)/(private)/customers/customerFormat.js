// A Customer's almost every field is optional (see the
// 20260807000000-customers.js migration), including both name fields -
// falls back to company, then email, then phone, then a generic label,
// rather than ever rendering blank in a list/detail heading.
export function customerDisplayName( customer )
{
  const name = [customer?.firstName, customer?.lastName].filter( Boolean ).join( ' ' )

  if( name )
    return name

  return customer?.company || customer?.email || customer?.phone || `Customer #${customer?.id ?? ''}`
}

// acceptsEmailMarketing is tri-state (true/false/null="unknown" - see the
// Customer model's doc comment and the 20260815000000-customer-company-
// and-marketing.js migration).
export function emailMarketingLabel( acceptsEmailMarketing )
{
  if( true === acceptsEmailMarketing )
    return 'Opted In'

  if( false === acceptsEmailMarketing )
    return 'Opted Out'

  return 'Unknown'
}
