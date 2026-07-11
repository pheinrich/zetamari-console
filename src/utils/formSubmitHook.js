import { useState } from 'react'
import { z } from 'zod'
import { formDataToDeepJSON } from '@/utils/formData'

export function useFormSubmit( {schema, onSubmit} )
{
  const [errors, setErrors] = useState( null )
  const [loading, setLoading] = useState( false )
  const [success, setSuccess] = useState( false )

  async function handleSubmit( e )
  {
    e.preventDefault()
    setLoading( true )
    setErrors( null )
    setSuccess( false )

    const formData = new FormData( e.target )
    const data = formDataToDeepJSON( formData )

    const parse = schema.safeParse( data )
    if( !parse.success )
    {
      setErrors( parse.error.format() )
      setLoading( false )
      return
    }

    try
    {
      await onSubmit( parse.data )
      setSuccess( true )
    }
    catch( err )
    {
      setErrors( {server: err.message || 'Unknown server error'} )
    }

    setLoading( false )
  }

  return {handleSubmit, loading, errors, success}
}
