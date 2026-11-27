'use strict'

/*
 * One Addresses table for every postal address the console keeps, and
 * Locations - the named places classes are taught at - on top of it.
 *
 * Before, addresses lived on their owners in two shapes: People had
 * street1/street2/city/state/postalCode/country columns, while Events,
 * Suppliers and Live Classes each had one free-text line (classes also a
 * locationName beside it, a "location" existing only as the distinct
 * name/address pairs classes happened to carry). Now:
 *
 *   Addresses   street1, street2, city, state, postalCode, country
 *   Locations   name (unique), addressId
 *   People.addressId, Events.addressId, Suppliers.addressId -> Addresses
 *   LiveClasses.locationId -> Locations
 *
 * Each owner has its own Address row (not shared, so editing one
 * contact's address never moves another's); a Location's address is
 * shared by every class held there. Free-text addresses are split into
 * fields best-effort (see split() below); whatever can't be placed stays
 * in street1/street2. Channel Orders' ship-to stays a JSON snapshot.
 */

const PERSON_FIELDS = ['street1', 'street2', 'city', 'state', 'postalCode', 'country']

// Country names that appear in free-text addresses -> the two-letter
// codes People's country column already uses
const COUNTRIES = {
  'usa': 'US', 'us': 'US', 'united states': 'US', 'united states of america': 'US',
  'canada': 'CA', 'china': 'CN', 'hong kong': 'HK', 'the netherlands': 'NL', 'netherlands': 'NL',
  'uk': 'UK', 'united kingdom': 'UK', 'australia': 'AU', 'germany': 'DE', 'ireland': 'IE',
}

const US_STATE_ZIP = /^([A-Z]{2})(?:\s+(\d{5}(?:-\d{4})?))?$/

// "503 N 62nd St, Seattle, WA 98103, USA" -> {street1, city, state,
// postalCode, country}. Comma-separated, read from the end: a postal code
// after a country (Dutch and Chinese style), the country, a US "ST 12345",
// then the city (and, abroad, a province before it); the rest is street.
function split( text )
{
  const parts = (text ?? '').split( ',' ).map( p => p.trim() ).filter( Boolean )
  const out = {street1: null, street2: null, city: null, state: null, postalCode: null, country: null}

  if( !parts.length )
    return null

  const countryOf = p => COUNTRIES[p?.toLowerCase()]

  if( parts.length > 2 && /\d/.test( parts.at( -1 ) ) && /^[A-Z0-9 -]{3,10}$/i.test( parts.at( -1 ) ) && countryOf( parts.at( -2 ) ) )
    out.postalCode = parts.pop()

  if( parts.length > 1 && countryOf( parts.at( -1 ) ) )
    out.country = countryOf( parts.pop() )

  const us = parts.length > 1 && parts.at( -1 ).match( US_STATE_ZIP )

  if( us )
  {
    parts.pop()
    out.state = us[1]
    out.postalCode ??= us[2] ?? null
    out.country ??= 'US'
    out.city = parts.length > 1 ? parts.pop() : null
  }
  else if( out.country && parts.length >= 3 )
  {
    out.state = parts.pop()
    out.city = parts.pop()
  }
  else if( out.country && parts.length === 2 )
    out.city = parts.pop()

  out.street1 = parts[0] ?? null
  out.street2 = parts.slice( 1 ).join( ', ' ) || null

  return out
}

// The reverse, for down(): one line, as the free-text columns held it
function join( a )
{
  if( !a )
    return null

  const stateZip = [a.state, a.postalCode].filter( Boolean ).join( ' ' )

  return [a.street1, a.street2, a.city, stateZip, a.country].filter( Boolean ).join( ', ' ) || null
}

module.exports = {
  split,

  async up( queryInterface, Sequelize )
  {
    const {DataTypes} = Sequelize
    const q = queryInterface.sequelize
    const select = (sql, replacements) => q.query( sql, {type: Sequelize.QueryTypes.SELECT, replacements} )

    await queryInterface.createTable( 'Addresses', {
      id: {type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true},
      street1: {type: DataTypes.STRING},
      street2: {type: DataTypes.STRING},
      city: {type: DataTypes.STRING},
      state: {type: DataTypes.STRING},
      postalCode: {type: DataTypes.STRING},
      country: {type: DataTypes.STRING},
      legacyPersonId: {type: DataTypes.INTEGER},   // backfill bookkeeping, dropped below
    } )

    await queryInterface.createTable( 'Locations', {
      id: {type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true},
      name: {type: DataTypes.STRING, allowNull: false, unique: true},
      addressId: {type: DataTypes.INTEGER, allowNull: true, references: {model: 'Addresses', key: 'id'}, onUpdate: 'CASCADE', onDelete: 'SET NULL'},
    } )

    const addressRef = {type: DataTypes.INTEGER, allowNull: true, references: {model: 'Addresses', key: 'id'}, onUpdate: 'CASCADE', onDelete: 'SET NULL'}

    await queryInterface.addColumn( 'People', 'addressId', addressRef )
    await queryInterface.addColumn( 'Events', 'addressId', addressRef )
    await queryInterface.addColumn( 'Suppliers', 'addressId', addressRef )
    await queryInterface.addColumn( 'LiveClasses', 'locationId', {type: DataTypes.INTEGER, allowNull: true, references: {model: 'Locations', key: 'id'}, onUpdate: 'CASCADE', onDelete: 'SET NULL'} )

    // People: already in fields - copied over in bulk, then linked
    const anyField = PERSON_FIELDS.map( f => `NULLIF( TRIM( ${f} ), '' ) IS NOT NULL` ).join( ' OR ' )

    await q.query( `INSERT INTO Addresses (${PERSON_FIELDS.join( ', ' )}, legacyPersonId)
      SELECT ${PERSON_FIELDS.map( f => `NULLIF( TRIM( ${f} ), '' )` ).join( ', ' )}, id FROM People WHERE ${anyField}` )
    await q.query( 'UPDATE People p JOIN Addresses a ON a.legacyPersonId = p.id SET p.addressId = a.id' )
    await queryInterface.removeColumn( 'Addresses', 'legacyPersonId' )

    const insertAddress = async text => {
      const a = split( text )

      if( !a )
        return null

      const [id] = await q.query( `INSERT INTO Addresses (${PERSON_FIELDS.join( ', ' )}) VALUES (?, ?, ?, ?, ?, ?)`, {replacements: PERSON_FIELDS.map( f => a[f] )} )

      return id
    }

    // Events and Suppliers: one free-text line each
    for( const table of ['Events', 'Suppliers'] )
      for( const row of await select( `SELECT id, address FROM ${table} WHERE NULLIF( TRIM( address ), '' ) IS NOT NULL` ) )
        await q.query( `UPDATE ${table} SET addressId = ? WHERE id = ?`, {replacements: [await insertAddress( row.address ), row.id]} )

    // Live Classes: a Location per distinct name, its address the first
    // one seen with that name
    const named = await select( `SELECT locationName AS name, MIN( locationAddress ) AS address FROM LiveClasses
      WHERE NULLIF( TRIM( locationName ), '' ) IS NOT NULL GROUP BY locationName` )

    for( const {name, address} of named )
    {
      const [locationId] = await q.query( 'INSERT INTO Locations (name, addressId) VALUES (?, ?)', {replacements: [name.trim(), await insertAddress( address )]} )

      await q.query( 'UPDATE LiveClasses SET locationId = ? WHERE locationName = ?', {replacements: [locationId, name]} )
    }

    for( const f of PERSON_FIELDS )
      await queryInterface.removeColumn( 'People', f )

    await queryInterface.removeColumn( 'Events', 'address' )
    await queryInterface.removeColumn( 'Suppliers', 'address' )
    await queryInterface.removeColumn( 'LiveClasses', 'locationName' )
    await queryInterface.removeColumn( 'LiveClasses', 'locationAddress' )
  },

  async down( queryInterface, Sequelize )
  {
    const {DataTypes} = Sequelize
    const q = queryInterface.sequelize
    const select = sql => q.query( sql, {type: Sequelize.QueryTypes.SELECT} )

    for( const f of PERSON_FIELDS )
      await queryInterface.addColumn( 'People', f, {type: DataTypes.STRING} )

    await queryInterface.addColumn( 'Events', 'address', {type: DataTypes.STRING} )
    await queryInterface.addColumn( 'Suppliers', 'address', {type: DataTypes.STRING} )
    await queryInterface.addColumn( 'LiveClasses', 'locationName', {type: DataTypes.STRING} )
    await queryInterface.addColumn( 'LiveClasses', 'locationAddress', {type: DataTypes.STRING} )

    await q.query( `UPDATE People p JOIN Addresses a ON a.id = p.addressId SET ${PERSON_FIELDS.map( f => `p.${f} = a.${f}` ).join( ', ' )}` )

    for( const table of ['Events', 'Suppliers'] )
      for( const row of await select( `SELECT o.id, a.* FROM ${table} o JOIN Addresses a ON a.id = o.addressId` ) )
        await q.query( `UPDATE ${table} SET address = ? WHERE id = ?`, {replacements: [join( row ), row.id]} )

    for( const row of await select( 'SELECT l.id, l.name, a.street1, a.street2, a.city, a.state, a.postalCode, a.country FROM Locations l LEFT JOIN Addresses a ON a.id = l.addressId' ) )
      await q.query( 'UPDATE LiveClasses SET locationName = ?, locationAddress = ? WHERE locationId = ?', {replacements: [row.name, join( row.street1 || row.city ? row : null ), row.id]} )

    await queryInterface.removeColumn( 'LiveClasses', 'locationId' )
    await queryInterface.removeColumn( 'Suppliers', 'addressId' )
    await queryInterface.removeColumn( 'Events', 'addressId' )
    await queryInterface.removeColumn( 'People', 'addressId' )
    await queryInterface.dropTable( 'Locations' )
    await queryInterface.dropTable( 'Addresses' )
  },
}
