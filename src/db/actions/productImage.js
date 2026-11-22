'use server'

import { unauthorized } from 'next/navigation'

import { DeleteObjectCommand, HeadObjectCommand, PutObjectCommand, S3Client } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import { col, fn } from 'sequelize'

import Image from '@/db/models/Image'
import Product from '@/db/models/Product'
import ProductImage from '@/db/models/ProductImage'
import sequelize from '@/db/sequelize'
import { auth } from '@/lib/auth'

// Product images live in S3 (s3://zetamari-console/images/products/) and
// are served through CloudFront; the Images table keeps just the public
// URL (and alt text). An Image can be shared by several products, each
// through its own ProductImage link carrying that product's gallery order.
//
// Uploads go straight from the browser to S3 on a short-lived presigned
// PUT (prepareImageUploads), so large photos never pass through a
// serverless function's request-size limit; createImages then records
// them, and attachImagesToProduct links any to a product. The IAM user (PRODUCT_IMAGES_AWS_*, not the AWS_* names
// Vercel reserves) needs s3:PutObject and s3:GetObject on
// images/products/* (plus s3:DeleteObject, to delete files from the Images
// page), and s3:ListBucket (so a missing key reads as 404,
// not 403); the bucket's CORS must allow PUT from the app's origins.
const BUCKET = process.env.PRODUCT_IMAGES_S3_BUCKET || 'zetamari-console'
const PREFIX = 'images/products/'
const URL_BASE = (process.env.PRODUCT_IMAGES_URL_BASE || 'https://d1l5nuc3go57nu.cloudfront.net/').replace( /\/?$/, '/' )

function s3Client()
{
  return new S3Client( {
    region: process.env.PRODUCT_IMAGES_AWS_REGION || 'us-west-2',
    credentials: {
      accessKeyId: process.env.PRODUCT_IMAGES_AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.PRODUCT_IMAGES_AWS_SECRET_ACCESS_KEY,
    },
  } )
}

async function requireSession()
{
  const session = await auth()

  if( !session )
    unauthorized()

  await sequelize.sync()
}

// The product's images in gallery order, each with how many products
// share it (so an alt-text edit can say who else it changes).
export async function readProductImages( productId )
{
  await requireSession()

  const links = await ProductImage.findAll( {
    where: {productId},
    include: [{model: Image, as: 'image'}],
    order: [['sortOrder', 'ASC'], ['id', 'ASC']],
  } )

  const countById = await productCounts( links.map( l => l.imageId ) )

  return links.map( l => ({
    linkId: l.id,
    imageId: l.imageId,
    url: l.image.url,
    altText: l.image.altText,
    productCount: countById[l.imageId] ?? 1,
  }) )
}

// "Seafoam Drop (2).JPG" -> "seafoam-drop-2.jpg"
function cleanFileName( name )
{
  const dot = name.lastIndexOf( '.' )
  const base = (dot > 0 ? name.slice( 0, dot ) : name).normalize( 'NFKD' ).replace( /[^\w\s.-]/g, '' ).trim().replace( /[\s_.]+/g, '-' ).toLowerCase()
  const ext = dot > 0 ? name.slice( dot + 1 ).toLowerCase().replace( /[^a-z0-9]/g, '' ) : ''

  return {base: base || 'image', ext}
}

async function keyExists( s3, key, taken )
{
  if( taken.has( key ) || await Image.count( {where: {url: URL_BASE + key}} ) )
    return true

  try
  {
    await s3.send( new HeadObjectCommand( {Bucket: BUCKET, Key: key} ) )

    return true
  }
  catch( error )
  {
    if( error.$metadata?.httpStatusCode === 404 )
      return false

    throw error
  }
}

// files: [{name, type, size}] -> [{name, key, url, uploadUrl, contentType}],
// one presigned PUT per file. Keys keep the file's own (cleaned-up) name,
// numbered "-2", "-3", … rather than overwrite anything already there.
export async function prepareImageUploads( files )
{
  await requireSession()

  if( !process.env.PRODUCT_IMAGES_AWS_ACCESS_KEY_ID )
    return {error: 'Image uploads aren\'t set up: PRODUCT_IMAGES_AWS_ACCESS_KEY_ID / _SECRET_ACCESS_KEY are missing.'}

  const notImages = files.filter( f => !/^image\//.test( f.type ) )

  if( notImages.length )
    return {error: `Not an image: ${notImages.map( f => f.name ).join( ', ' )}`}

  const s3 = s3Client()
  const taken = new Set()

  try
  {
    const uploads = []

    for( const file of files )
    {
      const {base, ext} = cleanFileName( file.name )
      let key

      for( let n = 1; ; n++ )
      {
        key = `${PREFIX}${base}${n > 1 ? `-${n}` : ''}${ext ? `.${ext}` : ''}`

        if( !await keyExists( s3, key, taken ) )
          break
      }

      taken.add( key )

      const uploadUrl = await getSignedUrl( s3, new PutObjectCommand( {Bucket: BUCKET, Key: key, ContentType: file.type} ), {expiresIn: 600} )

      uploads.push( {name: file.name, key, url: URL_BASE + key, uploadUrl, contentType: file.type} )
    }

    return {uploads}
  }
  catch( error )
  {
    return {error: `Couldn't prepare the upload: ${error.message}`}
  }
}

// How many distinct products link to each of `imageIds`.
async function productCounts( imageIds )
{
  if( !imageIds.length )
    return {}

  const counts = await ProductImage.findAll( {
    attributes: ['imageId', [fn( 'COUNT', fn( 'DISTINCT', col( 'productId' ) ) ), 'n']],
    where: {imageId: imageIds},
    group: ['imageId'],
    raw: true,
  } )

  return Object.fromEntries( counts.map( c => [c.imageId, Number( c.n )] ) )
}

// Every Image, newest first, with how many products use it - for the
// Images page and the product page's image picker.
export async function readImages()
{
  await requireSession()

  const images = await Image.findAll( {order: [['id', 'DESC']], raw: true} )
  const countById = await productCounts( images.map( i => i.id ) )

  return images.map( i => ({imageId: i.id, url: i.url, altText: i.altText, productCount: countById[i.id] ?? 0}) )
}

// After the browser's PUTs succeed: an Image row per URL (reusing one
// already there), returned in readImages()'s shape.
export async function createImages( urls )
{
  await requireSession()

  if( !urls.every( u => u.startsWith( URL_BASE + PREFIX ) ) )
    return {error: 'Not a product image URL'}

  const images = []

  for( const url of urls )
    images.push( (await Image.findOrCreate( {where: {url}, defaults: {url}} ))[0] )

  const countById = await productCounts( images.map( i => i.id ) )

  return {images: images.map( i => ({imageId: i.id, url: i.url, altText: i.altText, productCount: countById[i.id] ?? 0}) )}
}

// Links Images to a product, after its current ones, in the order given
// (skipping any it already has).
export async function attachImagesToProduct( productId, imageIds )
{
  await requireSession()

  await sequelize.transaction( async transaction => {
    let next = ((await ProductImage.max( 'sortOrder', {where: {productId}, transaction} )) ?? -1) + 1

    for( const imageId of imageIds )
      await ProductImage.findOrCreate( {where: {productId, imageId}, defaults: {sortOrder: next++}, transaction} )
  } )

  return {success: true}
}

// The products linked to an Image, for the delete dialog - each flagged
// `primary` when this is its first (thumbnail) image.
export async function readImageProducts( imageId )
{
  await requireSession()

  const links = await ProductImage.findAll( {
    where: {imageId},
    include: [{model: Product, as: 'product', attributes: ['id', 'name', 'sku']}],
  } )

  const productIds = [...new Set( links.map( l => l.productId ) )]

  const firsts = productIds.length
    ? await ProductImage.findAll( {
      attributes: ['productId', [fn( 'MIN', col( 'sortOrder' ) ), 'first']],
      where: {productId: productIds},
      group: ['productId'],
      raw: true,
    } )
    : []

  const firstById = Object.fromEntries( firsts.map( f => [f.productId, Number( f.first )] ) )
  const seen = new Set()

  return links
    .filter( l => !seen.has( l.productId ) && seen.add( l.productId ) )
    .map( l => ({id: l.product.id, name: l.product.name, sku: l.product.sku, primary: l.sortOrder === firstById[l.productId]}) )
    .sort( (a, b) => a.name.localeCompare( b.name ) )
}

// Deletes the Image record and unlinks it from every product using it.
// With removeFile, the file is deleted from S3 first - so if that fails,
// nothing has changed.
export async function deleteImage( imageId, {removeFile = false} = {} )
{
  await requireSession()

  const image = await Image.findByPk( imageId )

  if( !image )
    return {error: 'That image no longer exists'}

  if( removeFile )
  {
    if( !image.url.startsWith( URL_BASE + PREFIX ) )
      return {error: 'That image isn\'t stored in the product images folder, so its file can\'t be removed here'}

    try
    {
      await s3Client().send( new DeleteObjectCommand( {Bucket: BUCKET, Key: decodeURIComponent( image.url.slice( URL_BASE.length ) )} ) )
    }
    catch( error )
    {
      return {error: `Couldn't remove the file from S3, so nothing was deleted: ${error.message}`}
    }
  }

  await sequelize.transaction( async transaction => {
    await ProductImage.destroy( {where: {imageId}, transaction} )
    await image.destroy( {transaction} )
  } )

  return {success: true}
}

// linkIds: the product's ProductImage ids in their new order.
export async function reorderProductImages( productId, linkIds )
{
  await requireSession()

  await sequelize.transaction( async transaction => {
    for( const [i, id] of linkIds.entries() )
      await ProductImage.update( {sortOrder: i}, {where: {id, productId}, transaction} )
  } )

  return {success: true}
}

// Alt text belongs to the shared Image, so this changes it for every
// product the image is attached to.
export async function updateImageAltText( imageId, altText )
{
  await requireSession()

  await Image.update( {altText: altText?.trim() || null}, {where: {id: imageId}} )

  return {success: true}
}

// Unlinks the image from this product only; the Image row stays for any
// other product that shares it.
export async function detachProductImage( linkId )
{
  await requireSession()

  await ProductImage.destroy( {where: {id: linkId}} )

  return {success: true}
}

// The image file's size in bytes, from a HEAD of its public URL (not
// stored; the browser can't read it cross-origin itself).
export async function readImageFileSize( url )
{
  await requireSession()

  if( !url.startsWith( URL_BASE ) )
    return null

  try
  {
    const response = await fetch( url, {method: 'HEAD', cache: 'no-store'} )
    const length = Number( response.headers.get( 'content-length' ) )

    return response.ok && length > 0 ? length : null
  }
  catch
  {
    return null
  }
}
