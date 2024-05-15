import models from 'db/models'

export default async function handler( req, res )
{
  try
  {
    switch( req.method )
    {
      case 'GET':
        const contourTypes = await models.ContourType.findAll()
        res.status( 200 ).json( contourTypes )
        break;

      case 'POST':
        const {name, prefix} = req.body
        const newContourType = await models.ContourType.create( {name, prefix} )
        res.status( 201 ).json( newContourType )
        break

      default:
        res.setHeader( 'Allow', ['GET', 'POST'] )
        res.status( 405 ).end( `Method ${req.method} Not Allowed` )
    }
  }
  catch( error )
  {
    console.error( 'Failed ContourType:', error )
    res.status( 500 ).json( { error: 'Internal Server Error' } )
  }
}
