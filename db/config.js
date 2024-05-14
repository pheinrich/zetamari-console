const mysql2 = require('mysql2')

module.exports =
{
  development:
  {
    use_env_variable: 'DEV_DATABASE_URL',
    dialect: 'mysql',
    dialectModule: mysql2
  },
  test:
  {
    username: process.env.CI_DB_USERNAME,
    password: process.env.CI_DB_PASSWORD,
    database: process.env.CI_DB_NAME,
    host: process.env.CI_DB_HOSTNAME,
    port: process.env.CI_DB_PORT,
    dialect: 'mysql',
    dialectModule: mysql2
  },
  production:
  {
    use_env_variable: 'PROD_DATABASE_URL',
    dialect: 'mysql',
    dialectModule: mysql2
  }
}
