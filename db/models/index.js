import db from 'db'
import {DataTypes} from 'sequelize'

import Contour from 'db/models/contour'
import Shape from 'db/models/shape'
import Substrate from 'db/models/substrate'

const models =
{
  Contour: Contour( db, DataTypes ),
  Shape: Shape( db, DataTypes ),
  Substrate: Substrate( db, DataTypes )
}

Object.keys( models ).forEach( name =>
  {
    if( models[name].associate )
      models[name].associate( models )
  })


// Set `force: true` to drop and re-create tables
db.sync( {force: false} )
  .then( () => console.log( 'Models synchronized' ) )
  .catch( err => console.error( 'Error syncing models', err ) )

export default models
