import db from 'src/models'

export default async function handler( req, res )
{
  try
  {
    const {id} = req.query

    switch( req.method )
    {
      case 'GET':
        const contours = await db.Contour.findByPk( id )
        res.status( 200 ).json( contours )
        break;

      case 'PUT':
        const {name, svgData} = req.body
        const updatedContour = await db.Contour.update(
          {name, svgData},
          {where: {id}}
        )
        res.status( 200 ).json( updatedContour )
        break

      case 'DELETE':
        await db.Contour.destroy( {where: {id}} )
        res.status( 204 ).end()
        break

      default:
        res.setHeader( 'Allow', ['GET', 'PUT', 'DELETE'] )
        res.status( 405 ).end( `Method ${req.method} Not Allowed` )
    }
  }
  catch( error )
  {
    console.error( 'Failed contour:', error )
    res.status( 500 ).json( { error: 'Internal Server Error' } )
  }
}
