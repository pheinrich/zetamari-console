// Showing an Address (see db/models/Address.js) - client-safe.

// -> ["503 N 62nd St", "Seattle, WA 98103", "US"], blanks dropped
export function addressLines( a )
{
  if( !a )
    return []

  return [
    a.street1,
    a.street2,
    [[a.city, a.state].filter( Boolean ).join( ', ' ), a.postalCode].filter( Boolean ).join( ' ' ),
    a.country,
  ].filter( Boolean )
}

// -> "503 N 62nd St, Seattle, WA 98103, US", or '' for none
export function formatAddress( a )
{
  return addressLines( a ).join( ', ' )
}
