import models from 'db/models'

export default async function handler( req, res )
{
  try
  {
    const {id} = req.query

    switch( req.method )
    {
      case 'GET':
        const contours = await models.Contour.findByPk( id )
        res.status( 200 ).json( contours )
        break;

      case 'PUT':
        const {name, prefix, svgData } = req.body
        const updatedContour = await models.Contour.update(
          {name, prefix, svgData},
          {where: {id}}
        )
        res.status( 200 ).json( updatedContour )
        break

      case 'DELETE':
        await models.Contour.destroy( {where: {id}} )
        res.status( 204 ).end()
        break

      default:
        res.setHeader( 'Allow', ['GET', 'PUT', 'DELETE'] )
        res.status( 405 ).end( `Method ${req.method} Not Allowed` )
    }
  }
  catch( error )
  {
    console.error( 'Failed Contour:', error )
    res.status( 500 ).json( { error: 'Internal Server Error' } )
  }
}
