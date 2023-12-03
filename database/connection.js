import Sequelize from 'sequelize';
import config from './config/config.mjs';

let sequelize;
if( 'production' === process.env.NODE_ENV )
{
  sequelize = new Sequelize( config.production );
}
else if( 'staging' === process.env.NODE_ENV )
{
  sequelize = new Sequelize( config.staging );
}
else if( 'test' === process.env.NODE_ENV )
{
  sequelize = new Sequelize( config.test );
}
else
{
  sequelize = new Sequelize( config.development );
}

const connection = sequelize;
export default connection;
