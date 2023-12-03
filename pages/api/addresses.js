import Address from '../../database/models/address';
import logger from '../../services/logger';

export default async function handler( req, res )
{
  try
  {
    const addresses = await Address.findAll( {
      attributes: ['name', 'company', 'line1', 'line2', 'line3', 'city', 'state', 'postal_code', 'country'],
      limit: 100,
    } );
    res.status( 200 ).json( { addresses } );
  }
  catch( e )
  {
    logger.error( e.stack );
    res.status( 400 ).json({
      error_code: 'get_addresses',
      message: e.message,
    } );
  }
}
