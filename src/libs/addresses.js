import Address, { ADDRESS_FIELDS } from '@/db/models/Address'

// Saving the Address a Person, Event, Supplier or Location points at
// (see Address.js). Forms submit it as `address[street1]` ... nested
// under `address`; every field blank means "no address".

// A form's address -> trimmed fields, or null when it's all blank
export function addressFields( input )
{
  const fields = Object.fromEntries( ADDRESS_FIELDS.map( f => [f, input?.[f]?.toString().trim() || null] ) )

  return Object.values( fields ).some( Boolean ) ? fields : null
}

// Sets `owner`'s address to `input`: updates the Address it has, creates
// one if it has none, or removes it when `input` is blank. `owner` is a
// Sequelize instance with an addressId.
export async function saveOwnedAddress( owner, input, transaction )
{
  const fields = addressFields( input )
  const current = owner.addressId ? await Address.findByPk( owner.addressId, {transaction} ) : null

  if( !fields )
  {
    if( current )
    {
      await owner.update( {addressId: null}, {transaction} )
      await current.destroy( {transaction} )
    }

    return null
  }

  if( current )
    return current.update( fields, {transaction} )

  const created = await Address.create( fields, {transaction} )

  await owner.update( {addressId: created.id}, {transaction} )

  return created
}

// Removes `owner`'s Address - for when the owner itself is deleted, as
// nothing else shares it (a Location's is shared only by its classes,
// which point at the Location, not the Address).
export async function deleteOwnedAddress( owner, transaction )
{
  if( owner.addressId )
    await Address.destroy( {where: {id: owner.addressId}, transaction} )
}
