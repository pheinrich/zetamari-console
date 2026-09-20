'use strict'

/*
 * Merges Users and Customers into one People table - see CONTEXT.md's
 * Person entry and docs/adr/0008. Both were really the same concept (a
 * person playing a role) with different columns for it (User.role
 * enum/Customer.type enum); Role/PersonRole (Roles/Permissions seeded by
 * 20260917000000-roles-and-permissions.js) replace both.
 *
 * Users copy into People with their id preserved (People is empty at
 * this point, so no collision) - `name` is best-effort split into
 * firstName/lastName in JS, not a dialect-specific SQL string split.
 * Customers copy in with id = customerId + PERSON_CUSTOMER_ID_OFFSET, a
 * fixed constant safely above any realistic row count (checked against
 * both dev/prod row counts before writing this), which also gives every
 * dependent FK value a simple `+= OFFSET` rewrite instead of needing a
 * row-by-row id-mapping table.
 *
 * Order matters: run after 20260917005000-drop-capacity-events.js
 * (which removes the only other FK into Users) and before any migration
 * that expects Person's FKs to already point at People.
 */
const PERSON_CUSTOMER_ID_OFFSET = 100000

async function dropForeignKeys( queryInterface, table, column )
{
  const [rows] = await queryInterface.sequelize.query(
    'SELECT CONSTRAINT_NAME FROM information_schema.KEY_COLUMN_USAGE ' +
    'WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = :table AND COLUMN_NAME = :column ' +
    'AND REFERENCED_TABLE_NAME IS NOT NULL',
    {replacements: {table, column}}
  )

  for( const row of rows )
    await queryInterface.sequelize.query( `ALTER TABLE \`${table}\` DROP FOREIGN KEY \`${row.CONSTRAINT_NAME}\`` )
}

function splitName( name )
{
  const trimmed = (name || '').trim()

  if( !trimmed )
    return {firstName: null, lastName: null}

  const spaceIndex = trimmed.indexOf( ' ' )

  if( -1 === spaceIndex )
    return {firstName: trimmed, lastName: null}

  return {firstName: trimmed.slice( 0, spaceIndex ), lastName: trimmed.slice( spaceIndex + 1 )}
}

module.exports = {
  async up( queryInterface, Sequelize )
  {
    await queryInterface.createTable( 'People', {
      id: { type: Sequelize.DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
      firstName: { type: Sequelize.DataTypes.STRING },
      lastName: { type: Sequelize.DataTypes.STRING },
      company: { type: Sequelize.DataTypes.STRING },
      email: { type: Sequelize.DataTypes.STRING },
      password: { type: Sequelize.DataTypes.STRING, allowNull: true },
      phone: { type: Sequelize.DataTypes.STRING },
      street1: { type: Sequelize.DataTypes.STRING },
      street2: { type: Sequelize.DataTypes.STRING },
      city: { type: Sequelize.DataTypes.STRING },
      state: { type: Sequelize.DataTypes.STRING },
      postalCode: { type: Sequelize.DataTypes.STRING },
      country: { type: Sequelize.DataTypes.STRING },
      website: { type: Sequelize.DataTypes.STRING },
      notes: { type: Sequelize.DataTypes.TEXT },
      createdOn: { type: Sequelize.DataTypes.DATEONLY, allowNull: false, defaultValue: Sequelize.NOW },
      acceptsEmailMarketing: { type: Sequelize.DataTypes.BOOLEAN, allowNull: true },
      discountPercent: { type: Sequelize.DataTypes.FLOAT, allowNull: true },
    } )

    await queryInterface.addIndex( 'People', ['email'] )

    await queryInterface.createTable( 'PersonRoles', {
      id: { type: Sequelize.DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
      personId: {
        type: Sequelize.DataTypes.INTEGER,
        allowNull: false,
        references: { model: 'People', key: 'id' },
        onDelete: 'CASCADE',
      },
      roleId: {
        type: Sequelize.DataTypes.INTEGER,
        allowNull: false,
        references: { model: 'Roles', key: 'id' },
        onDelete: 'CASCADE',
      },
    } )

    await queryInterface.addIndex( 'PersonRoles', ['personId', 'roleId'], {unique: true} )

    const today = new Date().toISOString().slice( 0, 10 )

    // --- Users -> People (identity id mapping) -----------------------
    const [users] = await queryInterface.sequelize.query( 'SELECT * FROM Users' )

    if( users.length )
    {
      await queryInterface.bulkInsert( 'People', users.map( u => {
        const {firstName, lastName} = splitName( u.name )

        return {
          id: u.id,
          firstName,
          lastName,
          email: u.email,
          password: u.password,
          createdOn: today,
        }
      } ) )
    }

    // --- Customers -> People (id + OFFSET) ----------------------------
    const [customers] = await queryInterface.sequelize.query( 'SELECT * FROM Customers' )

    if( customers.length )
    {
      await queryInterface.bulkInsert( 'People', customers.map( c => ({
        id: c.id + PERSON_CUSTOMER_ID_OFFSET,
        firstName: c.firstName,
        lastName: c.lastName,
        company: c.company,
        email: c.email,
        phone: c.phone,
        street1: c.street1,
        street2: c.street2,
        city: c.city,
        state: c.state,
        postalCode: c.postalCode,
        country: c.country,
        website: c.website,
        notes: c.notes,
        createdOn: c.createdOn,
        acceptsEmailMarketing: c.acceptsEmailMarketing,
        discountPercent: c.discountPercent,
      }) ) )
    }

    // --- Role assignments, migrated from the old enum columns ---------
    const [roleRows] = await queryInterface.sequelize.query( 'SELECT id, name FROM Roles' )
    const roleIdByName = Object.fromEntries( roleRows.map( r => [r.name, r.id] ) )

    const personRoles = []

    for( const u of users )
    {
      // Every migrated staff login also gets the baseline 'User' role,
      // on top of Owner/Assistant if they had one.
      personRoles.push( {personId: u.id, roleId: roleIdByName['User']} )

      if( u.role && roleIdByName[u.role[0].toUpperCase() + u.role.slice( 1 )] )
        personRoles.push( {personId: u.id, roleId: roleIdByName[u.role[0].toUpperCase() + u.role.slice( 1 )]} )
    }

    for( const c of customers )
    {
      const roleName = 'wholesale' === c.type ? 'Wholesale Customer' : 'retail' === c.type ? 'Retail Customer' : null

      if( roleName )
        personRoles.push( {personId: c.id + PERSON_CUSTOMER_ID_OFFSET, roleId: roleIdByName[roleName]} )
    }

    if( personRoles.length )
      await queryInterface.bulkInsert( 'PersonRoles', personRoles )

    // --- Drop the old FK constraints first - MySQL checks them on every
    // UPDATE, and the +OFFSET rewrite below produces values that don't
    // exist in Customers/Users (on purpose, they're about to point at
    // People instead). ---------------------------------------------------
    await dropForeignKeys( queryInterface, 'Orders', 'customerId' )
    await dropForeignKeys( queryInterface, 'Orders', 'userId' )
    await dropForeignKeys( queryInterface, 'LiveClassAttendees', 'customerId' )
    await dropForeignKeys( queryInterface, 'CustomerSources', 'customerId' )

    // --- Rewrite dependent FK values -----------------------------------
    await queryInterface.sequelize.query(
      `UPDATE Orders SET customerId = customerId + ${PERSON_CUSTOMER_ID_OFFSET} WHERE customerId IS NOT NULL`
    )
    await queryInterface.sequelize.query(
      `UPDATE LiveClassAttendees SET customerId = customerId + ${PERSON_CUSTOMER_ID_OFFSET} WHERE customerId IS NOT NULL`
    )
    await queryInterface.sequelize.query(
      `UPDATE CustomerSources SET customerId = customerId + ${PERSON_CUSTOMER_ID_OFFSET} WHERE customerId IS NOT NULL`
    )
    // Orders.userId needed no value rewrite - Users -> People was an
    // identity id mapping.

    // --- Repoint FK constraints at People -------------------------------
    await queryInterface.addConstraint( 'Orders', {
      fields: ['customerId'],
      type: 'foreign key',
      name: 'orders_customer_id_people_fk',
      references: {table: 'People', field: 'id'},
    } )
    await queryInterface.addConstraint( 'Orders', {
      fields: ['userId'],
      type: 'foreign key',
      name: 'orders_user_id_people_fk',
      references: {table: 'People', field: 'id'},
    } )
    await queryInterface.addConstraint( 'LiveClassAttendees', {
      fields: ['customerId'],
      type: 'foreign key',
      name: 'live_class_attendees_customer_id_people_fk',
      references: {table: 'People', field: 'id'},
    } )
    await queryInterface.addConstraint( 'CustomerSources', {
      fields: ['customerId'],
      type: 'foreign key',
      name: 'customer_sources_customer_id_people_fk',
      references: {table: 'People', field: 'id'},
      onDelete: 'CASCADE',
    } )

    await queryInterface.dropTable( 'Customers' )
    await queryInterface.dropTable( 'Users' )
  },

  // Best-effort - a lossless reverse of the id-remapping merge (undoing
  // the +OFFSET rewrite, re-splitting People back into two tables with
  // their original ids) isn't realistically worth building. This just
  // restores empty Users/Customers tables so the schema is at least
  // structurally back to normal.
  async down( queryInterface, Sequelize )
  {
    await queryInterface.createTable( 'Users', {
      id: { type: Sequelize.DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
      name: { type: Sequelize.DataTypes.STRING, allowNull: false },
      email: { type: Sequelize.DataTypes.STRING, unique: true, allowNull: false },
      password: { type: Sequelize.DataTypes.STRING, allowNull: false },
      role: { type: Sequelize.DataTypes.ENUM( 'owner', 'assistant' ) },
    } )

    await queryInterface.createTable( 'Customers', {
      id: { type: Sequelize.DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
      firstName: { type: Sequelize.DataTypes.STRING },
      lastName: { type: Sequelize.DataTypes.STRING },
      company: { type: Sequelize.DataTypes.STRING },
      email: { type: Sequelize.DataTypes.STRING },
      phone: { type: Sequelize.DataTypes.STRING },
      street1: { type: Sequelize.DataTypes.STRING },
      street2: { type: Sequelize.DataTypes.STRING },
      city: { type: Sequelize.DataTypes.STRING },
      state: { type: Sequelize.DataTypes.STRING },
      postalCode: { type: Sequelize.DataTypes.STRING },
      country: { type: Sequelize.DataTypes.STRING },
      createdOn: { type: Sequelize.DataTypes.DATEONLY, allowNull: false, defaultValue: Sequelize.NOW },
      notes: { type: Sequelize.DataTypes.TEXT },
      type: { type: Sequelize.DataTypes.ENUM( 'wholesale', 'retail' ), allowNull: true },
      website: { type: Sequelize.DataTypes.STRING },
      acceptsEmailMarketing: { type: Sequelize.DataTypes.BOOLEAN, allowNull: true },
      discountPercent: { type: Sequelize.DataTypes.FLOAT, allowNull: true },
    } )

    await dropForeignKeys( queryInterface, 'Orders', 'customerId' )
    await dropForeignKeys( queryInterface, 'Orders', 'userId' )
    await dropForeignKeys( queryInterface, 'LiveClassAttendees', 'customerId' )
    await dropForeignKeys( queryInterface, 'CustomerSources', 'customerId' )

    await queryInterface.dropTable( 'PersonRoles' )
    await queryInterface.dropTable( 'People' )
  },
}
