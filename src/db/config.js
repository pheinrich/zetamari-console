require( 'dotenv' ).config()
const mysql2 = require( 'mysql2' )

// Sequelize defaults to `logging: console.log` when the option is left
// unset, which prints the full SQL text (often several KB once eager
// includes join half a dozen tables) of *every* query. That's most of
// what shows up as "massive SQL statements" in the console, and printing
// it all is itself slow enough to noticeably drag down interactions in
// Next's dev server. Off by default; set SQL_LOGGING=true to bring it
// back for debugging. This only affects the informational per-query
// console output - thrown query errors are unaffected either way.
const logging = 'true' === process.env.SQL_LOGGING ? console.log : false

module.exports =
{
  development:
  {
    use_env_variable: 'DEV_DATABASE_URL',
    dialect: 'mysql',
    dialectModule: mysql2,
    logging,
  },
  test:
  {
    use_env_variable: 'TEST_DATABASE_URL',
    dialect: 'mysql',
    dialectModule: mysql2,
    logging,
  },
  production:
  {
    use_env_variable: 'PROD_DATABASE_URL',
    dialect: 'mysql',
    dialectModule: mysql2,
    logging,
  }
}
