import { Sequelize } from 'sequelize'

const sequelize = new Sequelize(
  process.env.NEXT_PUBLIC_DB_NAME,
  process.env.NEXT_PUBLIC_DB_USER,
  process.env.NEXT_PUBLIC_DB_PASSWORD,
  {
    host: process.env.NEXT_PUBLIC_DB_HOST,
    dialect: 'mysql',
    logging: false
  }
)

export default sequelize;
