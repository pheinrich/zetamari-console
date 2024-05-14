import Sequelize from 'sequelize'
import config from 'db/config'

const env = process.env.NODE_ENV || 'development'
const connect = config[env]

let db
if( connect.use_env_variable )
  db = new Sequelize( process.env[connect.use_env_variable], connect )
else
  db = new Sequelize( connect.database, connect.username, connect.password, connect )

export default db
