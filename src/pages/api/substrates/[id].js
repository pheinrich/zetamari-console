import models from 'db/models'

export default async function handler( req, res )
{
  try
  {
    const {id} = req.query

    switch( req.method )
    {
      case 'GET':
        const substrates = await models.Substrate.findByPk( id, {include: ['outside', 'inside', 'rabbet']} )
        res.status( 200 ).json( substrates )
        break;

      case 'PUT':
        const {outsideId, insideId, rabbetId, name, sku, width, height, border, isStock, isPreset } = req.body
        const updatedSubstrate = await models.Substrate.update(
          {outsideId, insideId, rabbetId, name, sku, width, height, border, isStock, isPreset },
          {where: {id}}
        )
        res.status( 200 ).json( updatedSubstrate )
        break

      case 'DELETE':
        await models.Substrate.destroy( {where: {id}} )
        res.status( 204 ).end()
        break

      default:
        res.setHeader( 'Allow', ['GET', 'PUT', 'DELETE'] )
        res.status( 405 ).end( `Method ${req.method} Not Allowed` )
    }
  }
  catch( error )
  {
    console.error( 'Failed Substrate:', error )
    res.status( 500 ).json( { error: 'Internal Server Error' } )
  }
}
