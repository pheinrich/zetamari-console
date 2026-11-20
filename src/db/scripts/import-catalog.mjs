/*
 * One-off rebuild of the product catalog - finished goods, kits, and the
 * materials/supplies they're made from - from a reviewed CSV built from
 * QuickBooks, the sales channels' listings and the curated product
 * images (kept out of this public repo).
 *
 * The sheet *is* the catalog: the result is as if Products had been
 * emptied and refilled from it - everything hung off a Product (type
 * details, supplier prices, cost overrides, BOM lines, image links) is
 * dropped and rebuilt from the sheet, apart from the wooden-base geometry
 * it moves (below). To keep orders intact it doesn't literally empty the
 * table: a Product whose SKU is in the sheet keeps its id (so order
 * lines, pieces and channel order lines still point at it) and is
 * overwritten from its row; one whose SKU isn't is deleted. Refused if
 * an order or piece still uses a Product it would delete.
 *
 * Bills of materials and image links are rebuilt from the sheet:
 *   - `bom`: space-separated component SKUs, each consumed once
 *     ("SKU*2" for two);
 *   - images: every s3://zetamari-console/images/products/
 *     <SKU>-<n>[suffix].<ext>, in order, as Image rows (CloudFront URLs) -
 *     then any filed under one of the row's `aliases` (the misspelled
 *     SKUs the channels use).
 *
 * Wooden-base geometry is carried over: `geometryFrom` names the old
 * SKU(s) whose WoodenBaseInfo becomes this row's - QuickBooks' MSM...
 * "substrates" are now wooden base + glass + hardware, and the geometry
 * the console kept on MSM<code> belongs to MW<code>. A shape type's
 * prototype wooden base follows its geometry.
 *
 * Finally, channel order lines without a Product are matched again by
 * exact SKU.
 *
 * Columns read: sku, name, description, type, status, retail, wholesale,
 * bom, geometryFrom, aliases, shippingWeightLb (Faire's, in pounds). The rest are
 * for the person reviewing the sheet.
 *
 * Usage: node src/db/scripts/import-catalog.mjs <sheet.csv> --db=dev|prod [--apply]
 * Without --apply it's a dry run: everything happens in a transaction
 * that's then rolled back, and what it would have done is reported.
 */
import { readFileSync } from 'fs'
import { createRequire } from 'module'

const require = createRequire( import.meta.url )

require( 'dotenv' ).config()

const mysql = require( 'mysql2/promise' )
const { S3Client, ListObjectsV2Command } = require( '@aws-sdk/client-s3' )

const BUCKET = 'zetamari-console'
const PREFIX = 'images/products/'
const IMAGE_HOST = 'https://d1l5nuc3go57nu.cloudfront.net/'
const CHUNK = 200

// Each type's detail table
const INFO_TABLES = {
  'wooden base': 'WoodenBaseInfos', 'mirror glass': 'MirrorGlassInfos', bead: 'BeadInfos', 'picture frame': 'PictureFrameInfos',
  'birdhouse base': 'BirdhouseBaseInfos', tile: 'TileInfos', millefiori: 'MillefioriInfos',
}

const TYPES = [...Object.keys( INFO_TABLES ), 'grout', 'kit', 'other']

const args = process.argv.slice( 2 )
const sheet = args.find( a => !a.startsWith( '--' ) )
const db = args.find( a => a.startsWith( '--db=' ) )?.slice( 5 )
const apply = args.includes( '--apply' )
const url = {dev: process.env.DEV_DATABASE_URL, prod: process.env.PROD_DATABASE_URL}[db]

if( !sheet || !url )
{
  console.error( 'Usage: node src/db/scripts/import-catalog.mjs <sheet.csv> --db=dev|prod [--apply]' )
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

const number = v => v === '' || v == null ? null : Number( String( v ).replace( /[$,]/g, '' ) )
const lower = s => s.toLowerCase()
const list = s => (s ?? '').split( /\s+/ ).filter( Boolean )

// "MWCi10 MH-HangKit*2" -> [{sku: 'MWCi10', quantity: 1}, {sku: 'MH-HangKit', quantity: 2}]
const components = s => list( s ).map( c => {
  const [sku, qty] = c.split( '*' )

  return {sku, quantity: qty ? Number( qty ) : 1}
} )

const products = parseCsv( readFileSync( sheet, 'utf8' ).replace( /^﻿/, '' ) )

// Problems that would make the import half-work are refused up front.
const problems = []
const seenSku = new Set(), seenName = new Set()

for( const p of products )
{
  if( !p.sku ) problems.push( `a row has no SKU (name "${p.name}")` )
  if( !p.name ) problems.push( `${p.sku}: no name` )
  if( !['visible', 'hidden'].includes( p.status ) ) problems.push( `${p.sku}: status must be visible or hidden, not "${p.status}"` )
  if( p.type && !TYPES.includes( p.type ) ) problems.push( `${p.sku}: type must be blank or one of ${TYPES.join( ', ' )} - not "${p.type}"` )
  if( [p.wholesale, p.retail, p.shippingWeightLb].some( v => Number.isNaN( number( v ) ) ) ) problems.push( `${p.sku}: a price or weight isn't a number` )
  if( components( p.bom ).some( c => !(c.quantity > 0) ) ) problems.push( `${p.sku}: bad bom quantity in "${p.bom}"` )
  if( seenSku.has( lower( p.sku ) ) ) problems.push( `${p.sku}: SKU appears twice` )
  if( p.name && seenName.has( lower( p.name ) ) ) problems.push( `${p.sku}: name "${p.name}" appears twice` )
  seenSku.add( lower( p.sku ) )
  seenName.add( lower( p.name ) )
}

if( problems.length )
{
  console.error( `Not imported - fix these in the sheet first:\n  ${problems.join( '\n  ' )}` )
  process.exit( 1 )
}

// Every product image in the bucket, grouped by the SKU its name starts
// with: <SKU>-<n>[suffix].<ext>, ordered by n, then suffix.
const imagesBySku = new Map()
const s3 = new S3Client( {region: 'us-west-2'} )

for( let ContinuationToken; ; )
{
  const page = await s3.send( new ListObjectsV2Command( {Bucket: BUCKET, Prefix: PREFIX, ContinuationToken} ) )

  for( const {Key} of page.Contents ?? [] )
  {
    const m = Key.slice( PREFIX.length ).match( /^(.+)-(\d+)([a-z]?)\.[a-z]+$/i )

    if( m )
      imagesBySku.set( lower( m[1] ), [...(imagesBySku.get( lower( m[1] ) ) ?? []), {key: Key, n: Number( m[2] ), suffix: m[3]}] )
  }

  if( !page.IsTruncated )
    break

  ContinuationToken = page.NextContinuationToken
}

for( const images of imagesBySku.values() )
  images.sort( (a, b) => a.n - b.n || a.suffix.localeCompare( b.suffix ) )

const conn = await mysql.createConnection( url )
const counts = {created: 0, updated: 0, deleted: 0, geometryMoved: 0, infosDropped: 0, supplierPrices: 0, costOverrides: 0, bomLines: 0, images: 0, imageLinks: 0, channelLinesMatched: 0}
const missingComponents = new Set()
const geometryNotFound = []

async function insertAll( table, rows )
{
  for( let i = 0; i < rows.length; i += CHUNK )
  {
    const chunk = rows.slice( i, i + CHUNK )
    const cols = Object.keys( chunk[0] )

    await conn.query( `INSERT INTO ${table} (${cols.join( ', ' )}) VALUES ?`, [chunk.map( r => cols.map( c => r[c] ) )] )
  }
}

const ids = rows => rows.length ? rows : [0]   // "IN (?)" needs at least one value

await conn.beginTransaction()

try
{
  // --- what's there, and what goes ---
  const [existing] = await conn.query( 'SELECT id, sku FROM Products' )
  const sheetSkus = new Set( products.map( p => lower( p.sku ) ) )
  const gone = existing.filter( e => !sheetSkus.has( lower( e.sku ) ) )
  const goneIds = gone.map( g => g.id )
  const skuOf = new Map( existing.map( e => [e.id, e.sku] ) )

  const [usedByOrders] = await conn.query(
    `SELECT DISTINCT productId FROM OrderProducts WHERE productId IN (?)
     UNION SELECT DISTINCT productId FROM Pieces WHERE productId IN (?)`, [ids( goneIds ), ids( goneIds )] )

  if( usedByOrders.length )
    throw new Error( `orders still use Products the sheet leaves out - add them back to the sheet: ${usedByOrders.map( u => skuOf.get( u.productId ) || `id ${u.productId}` ).join( ', ' )}` )

  // --- wooden-base geometry to carry over; every other type detail goes ---
  const [geometry] = await conn.query( 'SELECT * FROM WoodenBaseInfos' )
  const geometryBySku = new Map( geometry.filter( g => skuOf.has( g.productId ) ).map( g => [lower( skuOf.get( g.productId ) ), g] ) )
  const moved = []   // [row, toSku, fromProductId]

  for( const p of products.filter( p => p.geometryFrom ) )
  {
    const from = list( p.geometryFrom ).find( s => geometryBySku.has( lower( s ) ) )

    if( !from )
    {
      geometryNotFound.push( p.sku )
      continue
    }

    moved.push( [geometryBySku.get( lower( from ) ), p.sku, geometryBySku.get( lower( from ) ).productId] )
    geometryBySku.delete( lower( from ) )
  }

  // Shape types' prototype wooden bases follow their geometry
  const [shapeTypes] = await conn.query( 'SELECT id, prototypeWoodenBaseId FROM ShapeTypes WHERE prototypeWoodenBaseId IS NOT NULL' )

  await conn.query( 'UPDATE ShapeTypes SET prototypeWoodenBaseId = NULL' )

  const totalInfos = (await Promise.all( Object.values( INFO_TABLES ).map( t => conn.query( `SELECT COUNT(*) AS n FROM ${t}` ) ) )).reduce( (n, [[r]]) => n + r.n, 0 )

  for( const table of Object.values( INFO_TABLES ) )
    await conn.query( `DELETE FROM ${table}` )

  counts.geometryMoved = moved.length
  counts.infosDropped = totalInfos - moved.length

  // --- everything else hung off a Product goes; BOM + images are rebuilt ---
  counts.supplierPrices = (await conn.query( 'DELETE FROM SupplierProducts' ))[0].affectedRows
  counts.costOverrides = (await conn.query( 'DELETE FROM ProductCostOverrides' ))[0].affectedRows
  await conn.query( 'DELETE FROM BillOfMaterials' )
  await conn.query( 'DELETE FROM ProductImages' )

  // --- Products the sheet leaves out ---
  if( goneIds.length )
  {
    await conn.query( 'UPDATE ChannelOrderLines SET productId = NULL WHERE productId IN (?)', [goneIds] )
    counts.deleted = (await conn.query( 'DELETE FROM Products WHERE id IN (?)', [goneIds] ))[0].affectedRows
  }

  // --- the sheet's Products: overwrite kept ones, create the rest ---
  const fields = p => ({
    name: p.name, type: p.type || null, status: p.status, sellable: true,
    description: p.description || null, priceWholesale: number( p.wholesale ), priceRetail: number( p.retail ),
    shippingWeight: number( p.shippingWeightLb ), cogsCostCacheStale: true,
  })

  const bySku = new Map( existing.filter( e => sheetSkus.has( lower( e.sku ) ) ).map( e => [lower( e.sku ), e.id] ) )

  // names are unique: park the kept ones first, so they can trade names
  if( bySku.size )
    await conn.query( "UPDATE Products SET name = CONCAT( '~import~', id ) WHERE id IN (?)", [[...bySku.values()]] )

  for( const p of products.filter( p => bySku.has( lower( p.sku ) ) ) )
  {
    await conn.query( 'UPDATE Products SET ? WHERE id = ?', [{...fields( p ), sku: p.sku}, bySku.get( lower( p.sku ) )] )
    counts.updated++
  }

  const fresh = products.filter( p => !bySku.has( lower( p.sku ) ) )

  if( fresh.length )
  {
    await insertAll( 'Products', fresh.map( p => ({...fields( p ), sku: p.sku, units: 'each'}) ) )
    counts.created = fresh.length

    for( let i = 0; i < fresh.length; i += CHUNK )
    {
      const [rows] = await conn.query( 'SELECT id, sku FROM Products WHERE sku IN (?)', [fresh.slice( i, i + CHUNK ).map( p => p.sku )] )

      for( const r of rows ) bySku.set( lower( r.sku ), r.id )
    }
  }

  // --- geometry back, against its wooden base ---
  const newIdOf = new Map()

  for( const [row, toSku, fromId] of moved )
  {
    await conn.query( 'INSERT INTO WoodenBaseInfos SET ?', [{...row, productId: bySku.get( lower( toSku ) )}] )
    newIdOf.set( fromId, bySku.get( lower( toSku ) ) )
  }

  counts.prototypes = shapeTypes.filter( s => newIdOf.has( s.prototypeWoodenBaseId ) ).length

  for( const s of shapeTypes.filter( s => newIdOf.has( s.prototypeWoodenBaseId ) ) )
    await conn.query( 'UPDATE ShapeTypes SET prototypeWoodenBaseId = ? WHERE id = ?', [newIdOf.get( s.prototypeWoodenBaseId ), s.id] )

  // --- bills of materials ---
  const bom = []

  for( const p of products )
    for( const c of components( p.bom ) )
    {
      const material = bySku.get( lower( c.sku ) )

      if( !material )
        missingComponents.add( c.sku )
      else
        bom.push( {parentProductId: bySku.get( lower( p.sku ) ), materialProductId: material, quantity: c.quantity} )
    }

  if( bom.length )
  {
    await insertAll( 'BillOfMaterials', bom )
    counts.bomLines = bom.length
  }

  // --- images ---
  const imageUrl = key => IMAGE_HOST + key.split( '/' ).map( encodeURIComponent ).join( '/' )
  const wanted = products.flatMap( p => [p.sku, ...list( p.aliases )].flatMap( s => imagesBySku.get( lower( s ) ) ?? [] ).map( (img, sortOrder) => ({p, url: imageUrl( img.key ), sortOrder}) ) )
  const [imageRows] = await conn.query( 'SELECT id, url FROM Images' )
  const imageId = new Map( imageRows.map( i => [i.url, i.id] ) )
  const newImages = [...new Map( wanted.filter( w => !imageId.has( w.url ) ).map( w => [w.url, {url: w.url, altText: w.p.name}] ) ).values()]

  if( newImages.length )
  {
    await insertAll( 'Images', newImages )
    counts.images = newImages.length

    for( let i = 0; i < newImages.length; i += CHUNK )
    {
      const [rows] = await conn.query( 'SELECT id, url FROM Images WHERE url IN (?)', [newImages.slice( i, i + CHUNK ).map( n => n.url )] )

      for( const r of rows ) imageId.set( r.url, r.id )
    }
  }

  if( wanted.length )
  {
    await insertAll( 'ProductImages', wanted.map( w => ({productId: bySku.get( lower( w.p.sku ) ), imageId: imageId.get( w.url ), sortOrder: w.sortOrder}) ) )
    counts.imageLinks = wanted.length
  }

  // --- channel order lines left unmatched, by exact SKU ---
  counts.channelLinesMatched = (await conn.query(
    'UPDATE ChannelOrderLines l JOIN Products p ON p.sku = TRIM( l.sku ) SET l.productId = p.id WHERE l.productId IS NULL' ))[0].affectedRows

  if( apply )
    await conn.commit()
  else
    await conn.rollback()
}
catch( error )
{
  await conn.rollback()
  console.error( `Not imported (rolled back): ${error.message}` )
  process.exitCode = 1
}
finally
{
  await conn.end()
}

if( !process.exitCode )
{
  console.log( `${apply ? 'Imported into' : 'Dry run against'} ${db}: ${products.length} rows` )
  console.log( `  Products: ${counts.created} created, ${counts.updated} kept (same id) + overwritten, ${counts.deleted} deleted` )
  console.log( `  ${counts.geometryMoved} wooden-base geometries (${counts.prototypes} shape-type prototypes) carried over; dropped: ${counts.infosDropped} other type details, ${counts.supplierPrices} supplier prices, ${counts.costOverrides} cost overrides` )
  console.log( `  ${counts.bomLines} BOM lines; ${counts.images} new Images, ${counts.imageLinks} image links; ${counts.channelLinesMatched} channel order lines matched` )

  if( geometryNotFound.length )
    console.log( `No geometry to move for: ${geometryNotFound.join( ', ' )}` )

  if( missingComponents.size )
    console.log( `BOM components not in the catalog (no line): ${[...missingComponents].join( ', ' )}` )

  if( !apply )
    console.log( 'Nothing was written - add --apply to import.' )
}
