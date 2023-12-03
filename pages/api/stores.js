import Store from '../../database/models/store';
import logger from '../../services/logger';

export default async function handler( req, res )
{
  try
  {
    const stores = await Store.findAll( {
      attributes: ['name', 'url', 'email', 'phone'],
      limit: 100,
    } );
    res.status( 200 ).json( { stores } );
  }
  catch( e )
  {
    logger.error( e.stack );
    res.status( 400 ).json({
      error_code: 'get_stores',
      message: e.message,
    } );
  }
}
