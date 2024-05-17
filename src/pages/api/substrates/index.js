import models from 'db/models'

export default async function handler( req, res )
{
  try
  {
    switch( req.method )
    {
      case 'GET':
        const substrates = await models.Substrate.findAll( {include: ['outside', 'inside', 'rabbet']} )
        res.status( 200 ).json( substrates )
        break;

      case 'POST':
        const {outsideId, insideId, rabbetId, name, sku, width, height, border, isStock, isPreset} = req.body
        const newSubstrate = await models.Substrate.create( {outsideId, insideId, rabbetId, name, sku, width, height, border, isStock, isPreset} )
        res.status( 201 ).json( newSubstrate )
        break

      default:
        res.setHeader( 'Allow', ['GET', 'POST'] )
        res.status( 405 ).end( `Method ${req.method} Not Allowed` )
    }
  }
  catch( error )
  {
    console.error( 'Failed Substrate:', error )
    res.status( 500 ).json( { error: 'Internal Server Error' } )
  }
}
