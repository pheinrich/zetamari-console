function parseKey( key )
{
  const parts = []

  key.replace( /\[(\w+)\]|(\w+)/g, (_, bracket, plain) => {
    parts.push( bracket || plain )
  })

  return parts
}

export function formDataToDeepJSON( formData )
{
  const result = {}

  for( const [key, value] of formData.entries() ) {
    const path = parseKey( key )
    let current = result

    path.forEach( (k, i) => {
      const isLast = (i === path.length - 1)
      const nextKey = path[i + 1]
      const isNextIndex = /^\d+$/.test( nextKey )

      if( isLast )
        current[k] = value
      else
      {
        if( !current[k] )
          current[k] = isNextIndex ? [] : {}
        current = current[k]
      }
    })
  }

  return result
}

export function nestedObjectToFormData( obj, parentKey = '', formData = new FormData() )
{
  if( obj === null || obj === undefined )
    return formData

  if( typeof obj !== 'object')
  {
    formData.append( parentKey, obj )
    return formData
  }

  for( const key in obj )
  {
    const fullKey = Array.isArray( obj ) ? `${parentKey}[${key}]` : (parentKey ? `${parentKey}.${key}` : key)
    nestedObjectToFormData( obj[key], fullKey, formData )
  }

  return formData
}
