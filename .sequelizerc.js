import path from 'path'

export default
{
	config: path.resolve( 'db', 'config.js' ),
	'models-path': path.resolve( 'db', 'models' ),
	'seeders-path': path.resolve( 'db', 'seeders' ),
	'migrations-path': path.resolve( 'db', 'migrations' )
}
