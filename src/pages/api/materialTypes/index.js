import models from 'db/models'

export default async function handler( req, res )
{
  try
  {
    switch( req.method )
    {
      case 'GET':
        const materialTypes = await models.MaterialType.findAll()
        res.status( 200 ).json( materialTypes )
        break;

      case 'POST':
        const {name} = req.body
        const newMaterialType = await models.MaterialType.create( {name} )
        res.status( 201 ).json( newMaterialType )
        break

      default:
        res.setHeader( 'Allow', ['GET', 'POST'] )
        res.status( 405 ).end( `Method ${req.method} Not Allowed` )
    }
  }
  catch( error )
  {
    console.error( 'Failed MaterialType:', error )
    res.status( 500 ).json( { error: 'Internal Server Error' } )
  }
}
