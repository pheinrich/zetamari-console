import models from 'db/models'

export default async function handler( req, res )
{
  try
  {
    switch( req.method )
    {
      case 'GET':
        const shapes = await models.Shape.findAll()
        res.status( 200 ).json( shapes )
        break;

      case 'POST':
        const {name, prefix, isPrimitive} = req.body
        const newShape = await models.Shape.create( {name, prefix, isPrimitive} )
        res.status( 201 ).json( newShape )
        break

      default:
        res.setHeader( 'Allow', ['GET', 'POST'] )
        res.status( 405 ).end( `Method ${req.method} Not Allowed` )
    }
  }
  catch( error )
  {
    console.error( 'Failed Shape:', error )
    res.status( 500 ).json( { error: 'Internal Server Error' } )
  }
}
