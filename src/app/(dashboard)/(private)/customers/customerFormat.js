// A Customer's almost every field is optional (see the
// 20260807000000-customers.js migration), including both name fields -
// falls back to email, then phone, then a generic label, rather than ever
// rendering blank in a list/detail heading.
export function customerDisplayName( customer )
{
  const name = [customer?.firstName, customer?.lastName].filter( Boolean ).join( ' ' )

  if( name )
    return name

  return customer?.email || customer?.phone || `Customer #${customer?.id ?? ''}`
}
