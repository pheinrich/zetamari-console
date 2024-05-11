import sequelize from 'src/lib/sequelize'
import Contour from 'src/models/Contour'

const db =
{
  sequelize,
  Contour
}

sequelize.sync( { force: false } )  // Set `force: true` to drop and re-create tables
  .then( () => console.log( 'Models synchronized' ) )
  .catch( err => console.error( 'Error syncing models', err ) )

export default db
