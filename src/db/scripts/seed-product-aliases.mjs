/*
 * One-off: seeds Product Aliases (see ProductAlias.js) from the reviewed
 * catalog sheet's `aliases` column - the misspelled SKUs the channels'
 * listings use for each row's SKU - then matches open channel order lines
 * (on orders still 'new') that those aliases now cover.
 *
 * `aliases` is space-separated, but a few channel SKUs contain a space
 * ("ZMCi10-Molten Sea"): a word with no digit is a SKU's tail, so it's
 * joined back onto the alias before it.
 *
 * Skipped: an alias that is some Product's own SKU (that always matches
 * the Product), one whose row isn't in Products, and one already
 * recorded (aliases learned in the console are kept as they are).
 *
 * Usage: node src/db/scripts/seed-product-aliases.mjs <sheet.csv> --db=dev|prod [--apply]
 * Without --apply it's a dry run, rolled back.
 */
import { readFileSync } from 'fs'
import { createRequire } from 'module'

const require = createRequire( import.meta.url )

require( 'dotenv' ).config()

const mysql = require( 'mysql2/promise' )

const args = process.argv.slice( 2 )
const sheet = args.find( a => !a.startsWith( '--' ) )
const db = args.find( a => a.startsWith( '--db=' ) )?.slice( 5 )
const apply = args.includes( '--apply' )
const url = {dev: process.env.DEV_DATABASE_URL, prod: process.env.PROD_DATABASE_URL}[db]

if( !sheet || !url )
{
  console.error( 'Usage: node src/db/scripts/seed-product-aliases.mjs <sheet.csv> --db=dev|prod [--apply]' )
  process.exit( 1 )
}

// RFC 4180: quoted fields may hold commas, newlines and "" escapes.
function parseCsv( text )
{
  const rows = []
  let row = [], field = '', quoted = false

  for( let i = 0; i < text.length; i++ )
  {
    const c = text[i]

    if( quoted )
    {
      if( c === '"' && text[i + 1] === '"' )
        field += text[i++]
      else if( c === '"' )
        quoted = false
      else
        field += c
    }
    else if( c === '"' )
      quoted = true
    else if( c === ',' )
    {
      row.push( field )
      field = ''
    }
    else if( c === '\n' || c === '\r' )
    {
      if( c === '\r' && text[i + 1] === '\n' )
        i++

      row.push( field )
      rows.push( row )
      row = []
      field = ''
    }
    else
      field += c
  }

  if( field || row.length )
    rows.push( [...row, field] )

  const [header, ...body] = rows.filter( r => r.some( f => f.trim() ) )

  return body.map( r => Object.fromEntries( header.map( (h, i) => [h.trim(), (r[i] ?? '').trim()] ) ) )
}

// "ZMCi10-Molten Sea ZMCi10-MoltenSea2" -> ['ZMCi10-Molten Sea', 'ZMCi10-MoltenSea2']
function aliasList( text )
{
  const aliases = []

  for( const word of text.split( /\s+/ ).filter( Boolean ) )
    if( aliases.length && !/\d/.test( word ) )
      aliases[aliases.length - 1] += ` ${word}`
    else
      aliases.push( word )

  return aliases
}

const rows = parseCsv( readFileSync( sheet, 'utf8' ).replace( /^﻿/, '' ) )
const wanted = rows.flatMap( r => aliasList( r.aliases ?? '' ).map( alias => ({alias, sku: r.sku}) ) )
const conn = await mysql.createConnection( url )
const skipped = {'is a Product SKU': [], 'row not in Products': [], 'already recorded or listed twice': []}
let inserted = 0, matched = 0

await conn.beginTransaction()

try
{
  const [products] = await conn.query( 'SELECT id, sku FROM Products' )
  const [existing] = await conn.query( 'SELECT sku FROM ProductAliases' )
  const productId = new Map( products.map( p => [p.sku.trim().toLowerCase(), p.id] ) )
  const known = new Set( existing.map( e => e.sku.trim().toLowerCase() ) )

  for( const {alias, sku} of wanted )
  {
    const a = alias.toLowerCase()

    if( productId.has( a ) )
      skipped['is a Product SKU'].push( alias )
    else if( !productId.has( sku.toLowerCase() ) )
      skipped['row not in Products'].push( `${alias} (${sku})` )
    else if( known.has( a ) )
      skipped['already recorded or listed twice'].push( alias )
    else
    {
      await conn.query( 'INSERT INTO ProductAliases SET ?', [{sku: alias, productId: productId.get( sku.toLowerCase() )}] )
      known.add( a )
      inserted++
    }
  }

  matched = (await conn.query(
    `UPDATE ChannelOrderLines l
     JOIN ChannelOrders o ON o.id = l.channelOrderId AND o.status = 'new'
     JOIN ProductAliases a ON a.sku = TRIM( l.sku )
     SET l.productId = a.productId
     WHERE l.productId IS NULL` ))[0].affectedRows

  if( apply )
    await conn.commit()
  else
    await conn.rollback()
}
catch( error )
{
  await conn.rollback()
  console.error( `Not seeded (rolled back): ${error.message}` )
  process.exitCode = 1
}
finally
{
  await conn.end()
}

if( !process.exitCode )
{
  console.log( `${apply ? 'Seeded' : 'Dry run against'} ${db}: ${inserted} aliases added, ${matched} open channel order lines matched` )

  for( const [why, list] of Object.entries( skipped ) )
    if( list.length )
      console.log( `  skipped (${why}): ${list.join( ', ' )}` )

  if( !apply )
    console.log( 'Nothing was written - add --apply to seed.' )
}
