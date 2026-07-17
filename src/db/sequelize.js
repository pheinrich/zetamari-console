import { Sequelize } from 'sequelize'
import config from '@/db/config.js'

const env = process.env.NODE_ENV || 'development'
const connect = config[env]

let sequelize
if( connect.use_env_variable )
  sequelize = new Sequelize( process.env[connect.use_env_variable], connect )
else
  sequelize = new Sequelize( connect.database, connect.username, connect.password, connect )

// Every server action calls `await sequelize.sync()` before touching the
// DB (a "make sure the schema's ready" habit from before migrations were
// fully wired up - see db/actions/*.js). sync() isn't a no-op even when
// there's nothing to do: it runs a DESCRIBE/SHOW COLUMNS/SHOW INDEX round
// trip against *every* model's table to check whether it matches, on
// every single call. With ~20 models and every action calling it, that's
// 20+ extra metadata queries per page load/interaction. Schema changes in
// this app are made exclusively through migrations (`npx sequelize-cli
// db:migrate`), so sync() has nothing real left to do after the first
// call in a given process - memoize it so only the first caller pays for
// the real sync() and everyone after gets the cached, already-resolved
// promise back immediately. Reset on rejection so a transient failure
// (e.g. DB not reachable yet at cold start) doesn't permanently wedge
// every action into throwing.
const nativeSync = sequelize.sync.bind( sequelize )
let syncPromise = null
sequelize.sync = ( ...args ) => {
  if( !syncPromise )
    syncPromise = nativeSync( ...args ).catch( err => { syncPromise = null; throw err } )

  return syncPromise
}

export default sequelize
