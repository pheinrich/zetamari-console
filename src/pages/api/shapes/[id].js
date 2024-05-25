import models from 'db/models'

export default async function handler( req, res )
{
  try
  {
    const {id} = req.query

    switch( req.method )
    {
      case 'GET':
        const shapes = await models.Shape.findByPk( id )
        res.status( 200 ).json( shapes )
        break;

      case 'PUT':
        const {name, prefix, isPrimitive} = req.body
        const updatedShape = await models.Shape.update(
          {name, prefix, isPrimitive},
          {where: {id}}
        )
        res.status( 200 ).json( updatedShape )
        break

      case 'DELETE':
        await models.Shape.destroy( {where: {id}} )
        res.status( 204 ).end()
        break

      default:
        res.setHeader( 'Allow', ['GET', 'PUT', 'DELETE'] )
        res.status( 405 ).end( `Method ${req.method} Not Allowed` )
    }
  }
  catch( error )
  {
    console.error( 'Failed Shape:', error )
    res.status( 500 ).json( { error: 'Internal Server Error' } )
  }
}
