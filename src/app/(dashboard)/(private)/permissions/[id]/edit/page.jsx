import { notFound } from 'next/navigation'
import PermissionForm from '../../PermissionForm'
import { readPermission } from '@/db/actions/permission'

export default async function EditPermissionPage( {params} )
{
  const {id} = await params
  const permission = await readPermission( id )

  if( !permission )
    return notFound()

  return <PermissionForm initialData={permission} />
}
