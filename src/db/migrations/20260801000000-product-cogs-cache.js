'use strict'

/*
 * Adds Products.cogsCostCache/cogsCostCacheStale - a cache of each
 * product's computed COGS total, so the products list page (Cost column)
 * doesn't have to recompute every product's cost live, from scratch, on
 * every single page view.
 *
 * Before this, readProductsCogsCosts() (db/actions/productCost.js) was
 * "batched" only in the sense of a constant number of *queries* no
 * matter how many products exist - the actual $ math it then ran in JS
 * for every product, sumEffectiveCost() -> computeDefaultQuantities()
 * (libs/costFactors.js), rebuilds a wooden-base product's full JTS
 * geometry (libs/mirror.js's build()) synchronously. That's CPU-bound
 * work that scales with catalog size and shape complexity, and with
 * enough wooden-base products in the catalog it started exceeding
 * Vercel's function timeout on every single page view.
 *
 * cogsCostCacheStale defaults to true so every existing row gets
 * computed (and cached) at least once, the first time it's read after
 * this migration runs - same cost as today, but only once. From then on,
 * only rows actually marked stale (by editing that product/its BOM/its
 * cost overrides, or shop-wide by a Settings/CostFactor-rate/Contour/
 * supplier-price change - see markProductsCostStale()/
 * markAllProductsCostStale() in productCost.js) get recomputed on the
 * next read; everything else is served straight from cogsCostCache.
 */
module.exports = {
  async up( queryInterface, Sequelize )
  {
    await queryInterface.addColumn( 'Products', 'cogsCostCache', { type: Sequelize.DataTypes.FLOAT, allowNull: true } )
    await queryInterface.addColumn( 'Products', 'cogsCostCacheStale', { type: Sequelize.DataTypes.BOOLEAN, allowNull: false, defaultValue: true } )
  },

  async down( queryInterface )
  {
    await queryInterface.removeColumn( 'Products', 'cogsCostCacheStale' )
    await queryInterface.removeColumn( 'Products', 'cogsCostCache' )
  },
}
