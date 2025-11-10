import { Sequelize } from 'sequelize'
import config from '@/db/config.js'

const env = process.env.NODE_ENV || 'development'
const connect = config[env]

let sequelize
if( connect.use_env_variable )
  sequelize = new Sequelize( process.env[connect.use_env_variable], connect )
else
  sequelize = new Sequelize( connect.database, connect.username, connect.password, connect )

export default sequelize
