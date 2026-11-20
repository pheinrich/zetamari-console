// Ranks Products as likely matches for a Channel Order Line - only ever
// shown to a person as suggestions, never applied (see matching.js).
// Pure, so it runs in the browser over the picker's product list.
//
// Two signals:
//   - SKU similarity: edit distance between normalized SKUs, where
//     normalizing drops case and punctuation and pads one-digit sizes
//     (IndieMe's ZMCi7-Joy and the catalog's ZMCi07-Joy compare equal);
//   - description overlap: the share of the line description's words
//     (sizes included) found in the Product's name or SKU - all a line
//     without a SKU (some of Faire's) has to go on.

// Abbreviations the catalog uses in SKUs, spelled out in channel descriptions
const SPELLED = {dp: 'drop', lf: 'leaf', bh: 'bodhi', md: 'mandala', fl: 'flower', dk: 'dark', lt: 'light', ci: 'round circular', ov: 'oval', re: 'rectangle', sq: 'square'}

const normalizeSku = sku => (sku ?? '').toLowerCase()
  .replace( /([a-z])(\d)(?!\d)/g, '$10$2' )
  .replace( /[^a-z0-9]/g, '' )

const words = text => new Set( (text ?? '').toLowerCase().replace( /(\d)"/g, '$1' ).split( /[^a-z0-9]+/ ).filter( w => w.length > 1 ) )

// Words in a SKU: ZMCi10-SeafoamDp -> ci 10 seafoam dp, plus spelled-out abbreviations
function skuWords( sku )
{
  const parts = (sku ?? '').replace( /([a-z])([A-Z])/g, '$1 $2' ).replace( /([a-zA-Z])(\d)/g, '$1 $2' ).replace( /(\d)([a-zA-Z])/g, '$1 $2' )

  return [...words( parts )].flatMap( w => [w, ...(SPELLED[w]?.split( ' ' ) ?? [])] )
}

function editDistance( a, b )
{
  let prev = Array.from( {length: b.length + 1}, (_, j) => j )

  for( let i = 1; i <= a.length; i++ )
  {
    const row = [i]

    for( let j = 1; j <= b.length; j++ )
      row[j] = Math.min( prev[j] + 1, row[j - 1] + 1, prev[j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1) )

    prev = row
  }

  return prev[b.length]
}

// products: [{id, sku, name}] -> the best `limit`, [{product, score}], score 0..1
export function suggestProducts( line, products, limit = 5 )
{
  const lineSku = normalizeSku( line.sku )
  const lineWords = [...words( line.description )]

  const scored = products.map( product => {
    const sku = normalizeSku( product.sku )
    const skuScore = lineSku && sku ? 1 - editDistance( lineSku, sku ) / Math.max( lineSku.length, sku.length ) : 0
    const productWords = new Set( [...words( product.name ), ...skuWords( product.sku )] )
    const wordScore = lineWords.length ? lineWords.filter( w => productWords.has( w ) ).length / lineWords.length : 0
    const score = lineSku ? 0.75 * skuScore + 0.25 * wordScore : wordScore

    return {product, score}
  } )

  return scored.filter( s => s.score > 0.3 ).sort( (a, b) => b.score - a.score ).slice( 0, limit )
}
