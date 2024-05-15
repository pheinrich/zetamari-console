const mysql2 = require('mysql2')

module.exports =
{
  development:
  {
    use_env_variable: 'DEV_DATABASE_URL',
    dialect: 'mysql',
    dialectModule: mysql2,
  },
  test:
  {
    use_env_variable: 'TEST_DATABASE_URL',
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
