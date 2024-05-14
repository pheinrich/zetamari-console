import db from 'db'
import ContourType from 'db/models/contourType'

const models =
{
  ContourType
}

// Object.keys( db ).forEach( modelName =>
//   {
//     console.log( 'modelName: ', modelName )
//     if( db[modelName].associate )
//       db[modelName].associate( db )
//   })


// Set `force: true` to drop and re-create tables
db.sync( {alter: true} )
  .then( () => console.log( 'Models synchronized' ) )
  .catch( err => console.error( 'Error syncing models', err ) )

export default models
