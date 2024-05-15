import db from 'db'
import {DataTypes} from 'sequelize'

import ContourType from 'db/models/contourType'

const models =
{
  ContourType: ContourType( db, DataTypes )
}

Object.keys( models ).forEach( modelName =>
  {
    if( models[modelName].associate )
      models[modelName].associate( db )
  })


// Set `force: true` to drop and re-create tables
db.sync( {force: false} )
  .then( () => console.log( 'Models synchronized' ) )
  .catch( err => console.error( 'Error syncing models', err ) )

export default models
