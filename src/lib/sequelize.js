import { Sequelize } from 'sequelize'
import { mysql2 } from 'mysql2'

const sequelize = new Sequelize(
  process.env.NEXT_PUBLIC_DB_NAME,
  process.env.NEXT_PUBLIC_DB_USER,
  process.env.NEXT_PUBLIC_DB_PASSWORD,
  {
    host: process.env.NEXT_PUBLIC_DB_HOST,
    dialect: 'mysql',
    dialectModule: mysql2,
    logging: false
  }
)

export default sequelize;
