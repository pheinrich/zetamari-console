import models from 'db/models'

export default async function handler( req, res )
{
  try
  {
    const {id} = req.query

    switch( req.method )
    {
      case 'GET':
        const materialTypes = await models.MaterialType.findByPk( id )
        res.status( 200 ).json( materialTypes )
        break;

      case 'PUT':
        const {name} = req.body
        const updatedMaterialType = await models.MaterialType.update(
          {name},
          {where: {id}}
        )
        res.status( 200 ).json( updatedMaterialType )
        break

      case 'DELETE':
        await models.MaterialType.destroy( {where: {id}} )
        res.status( 204 ).end()
        break

      default:
        res.setHeader( 'Allow', ['GET', 'PUT', 'DELETE'] )
        res.status( 405 ).end( `Method ${req.method} Not Allowed` )
    }
  }
  catch( error )
  {
    console.error( 'Failed MaterialType:', error )
    res.status( 500 ).json( { error: 'Internal Server Error' } )
  }
}
