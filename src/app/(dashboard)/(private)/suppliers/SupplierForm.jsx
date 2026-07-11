'use client'

import { redirect } from 'next/navigation'
import { z } from 'zod'
import { useFormSubmit } from '@/utils/formSubmitHook'
import { createSupplier, updateSupplier } from '@/db/actions/supplier'

const optionalString = z.preprocess( (val) => (val === '' ? undefined : val), z.string().optional() )

const schema = z.object({
  id: z.preprocess( (val) => (val === '' || val == null ? undefined : val), z.coerce.number().optional() ),
  name: z.string().min( 1 ),
  email: optionalString,
  address: optionalString,
  phone: optionalString,
  url: optionalString,
  notes: optionalString,
})

export default function SupplierForm( {initialData={}} )
{
  const isEdit = Boolean( initialData?.id )
  const { handleSubmit, loading, errors, success } = useFormSubmit({
    schema,
    onSubmit: isEdit ? updateSupplier : createSupplier
  })

  if( success )
    redirect( '/suppliers' )

  return (
    <form onSubmit={handleSubmit}>
      <h1>{isEdit ? 'Update' : 'Create'} Supplier</h1>

      {success && <p>Supplier {isEdit ? 'updated' : 'created'} successfully</p>}
      {errors && <pre>{JSON.stringify( errors, null, 2 )}</pre>}

      {isEdit && <input type='hidden' name='id' value={initialData?.id} />}

      <div>
        <label>Name</label>
        <input name='name' defaultValue={initialData?.name || ''} required />
      </div>

      <div>
        <label>Email</label>
        <input name='email' defaultValue={initialData?.email || ''} />
      </div>

      <div>
        <label>Address</label>
        <input name='address' defaultValue={initialData?.address || ''} />
      </div>

      <div>
        <label>Phone</label>
        <input name='phone' defaultValue={initialData?.phone || ''} />
      </div>

      <div>
        <label>URL</label>
        <input name='url' defaultValue={initialData?.url || ''} />
      </div>

      <div>
        <label>Notes</label>
        <textarea name='notes' defaultValue={initialData?.notes || ''} />
      </div>

      <button type='submit' disabled={loading}>
        {isEdit ? 'Update' : 'Create'}
      </button>
    </form>
  )
}
