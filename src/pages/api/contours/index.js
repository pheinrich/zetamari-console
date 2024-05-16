import models from 'db/models'

export default async function handler( req, res )
{
  try
  {
    switch( req.method )
    {
      case 'GET':
        const contours = await models.Contour.findAll()
        res.status( 200 ).json( contours )
        break;

      case 'POST':
        const {name, prefix, svgData} = req.body
        const newContour = await models.Contour.create( {name, prefix, svgData} )
        res.status( 201 ).json( newContour )
        break

      default:
        res.setHeader( 'Allow', ['GET', 'POST'] )
        res.status( 405 ).end( `Method ${req.method} Not Allowed` )
    }
  }
  catch( error )
  {
    console.error( 'Failed Contour:', error )
    res.status( 500 ).json( { error: 'Internal Server Error' } )
  }
}
