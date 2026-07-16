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
      const result = await onSubmit( parse.data )

      // Server actions in this app report failure by resolving with
      // {error} rather than throwing (see e.g. product.js's
      // createProduct/updateProduct) - checking only for a thrown
      // exception let a failed save (a rolled-back transaction, a
      // caught Sequelize validation error, etc.) silently report
      // success: no error was ever shown, and the caller still
      // redirected as though the write had gone through.
      if( result?.error )
        setErrors( {server: result.error} )
      else
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
