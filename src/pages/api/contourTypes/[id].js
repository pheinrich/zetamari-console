import models from 'db/models'

export default async function handler( req, res )
{
  try
  {
    const {id} = req.query

    switch( req.method )
    {
      case 'GET':
        const contourTypes = await models.ContourType.findByPk( id )
        res.status( 200 ).json( contourTypes )
        break;

      case 'PUT':
        const {name, prefix} = req.body
        const updatedContourType = await models.ContourType.update(
          {name, prefix},
          {where: {id}}
        )
        res.status( 200 ).json( updatedContourType )
        break

      case 'DELETE':
        await models.ContourType.destroy( {where: {id}} )
        res.status( 204 ).end()
        break

      default:
        res.setHeader( 'Allow', ['GET', 'PUT', 'DELETE'] )
        res.status( 405 ).end( `Method ${req.method} Not Allowed` )
    }
  }
  catch( error )
  {
    console.error( 'Failed ContourType:', error )
    res.status( 500 ).json( { error: 'Internal Server Error' } )
  }
}
