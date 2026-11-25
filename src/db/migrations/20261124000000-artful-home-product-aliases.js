'use strict'

/*
 * Artful Home item numbers become Product Aliases. Artful Home names its
 * products only by its own item numbers ("P07859-P00152"), which
 * parseArtfulHomeOrder() used to translate to our SKUs from a hard-coded
 * table. Now a line keeps the item number as its SKU, as received, and
 * matches through these aliases like any other channel's - and a person
 * can correct or add one in the app instead of in code.
 *
 * The pairs are that table's 86 entries as of 2026-11-24 (from Artist
 * Center's "Inventory & Turnaround Time" page, 2026-11-16). A pair
 * whose SKU isn't a Product here is skipped and reported, and an item
 * number that's already an alias is left as it is.
 */
const ITEMS = [
  ['P07859-P00001', 'ZMCi19-IrisDp'],
  ['P07859-P00004', 'ZMOv2228-GoldenBronze'],
  ['P07859-P00006', 'ZMOv1822-Butterfly'],
  ['P07859-P00007', 'ZMOv2228-TealDp'],
  ['P07859-P00018', 'ZMOv1822-TealDp'],
  ['P07859-P00019', 'ZMCi30-GoldenBronze'],
  ['P07859-P00020', 'ZMCi24-GoldenBronze'],
  ['P07859-P00025', 'ZMCi30-SeafoamPurple'],
  ['P07859-P00026', 'ZMCi24-SeafoamPurple'],
  ['P07859-P00028', 'ZMOv2228-Sangria'],
  ['P07859-P00029', 'ZMOv1822-Sangria'],
  ['P07859-P00030', 'ZMOv2636-Sangria'],
  ['P07859-P00031', 'ZMCi24-SeafoamDp'],
  ['P07859-P00032', 'ZMCi30-SeafoamDp'],
  ['P07859-P00034', 'ZMLr3033-GreenTea'],
  ['P07859-P00042', 'ZMLr3033-CinnamonSage'],
  ['P07859-P00043', 'ZMLr2224-CinnamonSage'],
  ['P07859-P00044', 'ZMLr2224-Seafoam'],
  ['P07859-P00045', 'ZMLr3033-Seafoam'],
  ['P07859-P00046', 'ZMRe2428-MahoganySlate'],
  ['P07859-P00047', 'ZMSq30-MahoganySlate'],
  ['P07859-P00048', 'ZMRe1827-MahoganySlate'],
  ['P07859-P00065', 'ZMCi24-IrisFl'],
  ['P07859-P00066', 'ZMCi30-IrisFl'],
  ['P07859-P00067', 'ZMCi24-PewterDp'],
  ['P07859-P00068', 'ZMCi30-PewterDp'],
  ['P07859-P00073', 'ZMMn24-Gold'],
  ['P07859-P00082', 'ZMMn24-WarmGrey'],
  ['P07859-P00090', 'ZMLr2224-Jasmine'],
  ['P07859-P00091', 'ZMLr3033-Jasmine'],
  ['P07859-P00092', 'ZMCi24-IrisDp'],
  ['P07859-P00093', 'ZMCi30-IrisDp'],
  ['P07859-P00095', 'ZMCi19-SeafoamDp'],
  ['P07859-P00097', 'ZMCi19-GoldenBronze'],
  ['P07859-P00099', 'ZMOv2636-TealDp'],
  ['P07859-P00100', 'ZMOv1822-GoldenBronze'],
  ['P07859-P00101', 'ZMOv2636-GoldenBronze'],
  ['P07859-P00104', 'ZMOv2228-Butterfly'],
  ['P07859-P00105', 'ZMOv2636-Butterfly'],
  ['P07859-P00107', 'ZMCd4532'],
  ['P07859-P00111', 'ZMCi24-Ebony'],
  ['P07859-P00112', 'ZMCi19-Ebony'],
  ['P07859-P00113', 'ZMCi30-Ebony'],
  ['P07859-P00114', 'ZMCi19-FrostDp'],
  ['P07859-P00115', 'ZMCi24-FrostDp'],
  ['P07859-P00116', 'ZMCi30-FrostDp'],
  ['P07859-P00117', 'ZMWf1761-Aquamarine'],
  ['P07859-P00125', 'ZMMdSn23-Ruby'],
  ['P07859-P00126', 'ZMMdSn27-Ruby'],
  ['P07859-P00127', 'ZMMdSn32-Ruby'],
  ['P07859-P00128', 'ZMMdSl21-LimeAqua'],
  ['P07859-P00129', 'ZMMdSl26-LimeAqua'],
  ['P07859-P00130', 'ZMMdSl21-CottonCandy'],
  ['P07859-P00131', 'ZMMdSl26-CottonCandy'],
  ['P07859-P00132', 'ZMMdSl21-CapriBlue'],
  ['P07859-P00133', 'ZMMdSl26-CapriBlue'],
  ['P07859-P00134', 'ZMMdSl26-Cocktail'],
  ['P07859-P00135', 'ZMMdSl26-Plum'],
  ['P07859-P00136', 'ZMMdSl26-Blush'],
  ['P07859-P00137', 'ZMMdSl21-Blush'],
  ['P07859-P00138', 'ZMMdSl21-Plum'],
  ['P07859-P00139', 'ZMMdSl21-Cocktail'],
  ['P07859-P00144', 'ZMMdSl21-SweetFern'],
  ['P07859-P00145', 'ZMMdSl26-SweetFern'],
  ['P07859-P00146', 'ZMMdSl21-PurpleHaze'],
  ['P07859-P00147', 'ZMMdSl26-PurpleHaze'],
  ['P07859-P00148', 'ZMCd4532-Seafoam'],
  ['P07859-P00149', 'ZMMdSl26-Cobalt'],
  ['P07859-P00151', 'ZMOv2228-GoldenMeadow'],
  ['P07859-P00152', 'ZMOv1822-GoldenMeadow'],
  ['P07859-P00153', 'ZMOv2636-GoldenMeadow'],
  ['P07859-P00154', 'ZMMdSl26-Pearl'],
  ['P07859-P00155', 'ZMCd4532-ChampagneGold'],
  ['P07859-P00156', 'ZMNe1850-GoldenTeal'],
  ['P07859-P00157', 'ZMNe1850-MidnightBlue'],
  ['P07859-P00165', 'ZMCa2436-SageCream'],
  ['P07859-P00166', 'ZMRe2428-GoldenChocolate'],
  ['P07859-P00169', 'ZMCa2436-CinnamonSage'],
  ['P07859-P00174', 'ZMCa2436-IndigoTide'],
  ['P07859-P00175', 'ZMRe2428-SeafoamLace'],
  ['P07859-P00176', 'ZMRe1827-GoldenTeal'],
  ['P07859-P00177', 'ZMSq30-GoldenTeal'],
  ['P07859-P00178', 'ZMRe1827-SeafoamLace'],
  ['P07859-P00179', 'ZMSq30-SeafoamLace'],
  ['P07859-P00180', 'ZMRe1827-GoldenChocolate'],
  ['P07859-P00181', 'ZMSq30-GoldenChocolate'],
]

module.exports = {
  async up( queryInterface )
  {
    const { sequelize } = queryInterface
    const items = ITEMS.map( ([item]) => item )

    const [products] = await sequelize.query( 'SELECT id, sku FROM Products WHERE sku IN (:skus)', {replacements: {skus: ITEMS.map( ([, sku]) => sku )}} )
    const [aliases] = await sequelize.query( 'SELECT sku FROM ProductAliases WHERE sku IN (:items)', {replacements: {items}} )

    const productIdBySku = new Map( products.map( p => [p.sku.toLowerCase(), p.id] ) )
    const aliased = new Set( aliases.map( a => a.sku.toLowerCase() ) )
    const missing = ITEMS.filter( ([, sku]) => !productIdBySku.has( sku.toLowerCase() ) )

    const rows = ITEMS
      .filter( ([item, sku]) => productIdBySku.has( sku.toLowerCase() ) && !aliased.has( item.toLowerCase() ) )
      .map( ([item, sku]) => ({sku: item, productId: productIdBySku.get( sku.toLowerCase() ), channel: 'artfulhome'}) )

    if( rows.length )
      await queryInterface.bulkInsert( 'ProductAliases', rows )

    console.log( `Artful Home aliases: ${rows.length} added, ${aliased.size} already present, ${missing.length} skipped (no such Product)` )

    for( const [item, sku] of missing )
      console.log( `  skipped ${item} -> ${sku}` )
  },

  async down( queryInterface )
  {
    await queryInterface.bulkDelete( 'ProductAliases', {channel: 'artfulhome', sku: ITEMS.map( ([item]) => item )} )
  },
}
