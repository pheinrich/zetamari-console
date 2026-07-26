'use strict'

/*
 * Adds a "Sheet Breakage" Material CostFactor (key='sheetBreakage', unit=
 * '$', category='material', rate=1 - a $ pass-through, same convention as
 * 'bom' from 20260717000000-add-bom-cost-factor.js) alongside the
 * existing Wooden Base factor, and reformulates Wooden Base's own rate
 * around a full sheet's cost instead of a manually-entered per-sq-in
 * price.
 *
 * The per-sq-in wood price alone understates the true cost of a large
 * base: only so many copies of a given shape actually fit on one 4'x8'
 * sheet of plywood, and any of a sheet's area left over after those
 * copies is generally too small/oddly-shaped to use for anything else.
 * A 30" circle blank (kerf-padded to roughly 30.5"x30.5" - see
 * profilingKerfIn/20260730000000-profiling-kerf.js), for example, only
 * nests 3-to-a-sheet on a 48.5"x96.5" sheet, so each one's true material
 * cost is 1/3 of a full sheet, not just its own sq-in share.
 *
 * Three new Settings fields carry this:
 *   - sheetCostPerSheet ($/sheet): what one full sheet of plywood costs,
 *     delivered.
 *   - sheetWidthIn/sheetHeightIn (in): the sheet's usable dimensions -
 *     default to 48.5"x96.5" (a nominal 4'x8' sheet minus unusable edge
 *     trim), the shop's stated standard, so these two behave like
 *     markupPercent/retailMultiplier (allowNull: false, a real default)
 *     rather than "not yet configured" nulls - sheetCostPerSheet has no
 *     universal default (shop-specific pricing) and stays nullable like
 *     every other shop-specific cost constant.
 *
 * The Wooden Base CostFactor's rate is no longer manually entered - it's
 * now sheetCostPerSheet / (sheetWidthIn x sheetHeightIn), kept in sync on
 * every Settings save (see libs/woodenBaseRates.js and
 * db/actions/settings.js's updateSettings(), same "computed rate" pattern
 * item 14/20260728000000-bit-wear-cost-factor.js established for Machine
 * Wear/Utilities). Its existing rate isn't converted here - it's
 * meaningless under the new derivation regardless, and gets overwritten
 * the next time Settings are saved with Sheet Cost/Width/Height filled
 * in.
 *
 * Sheet Breakage's own "quantity" (computed in libs/costFactors.js,
 * already a dollar figure, hence the '$' unit/rate=1 pass-through) is the
 * amount a piece's *effective* per-sheet share costs above the simple
 * per-sq-in estimate: max(0, sheetCostPerSheet/piecesPerSheet -
 * woodenBaseArea x (the same derived per-sq-in rate above)) - zero
 * whenever a shape packs efficiently enough that its sq-in share already
 * covers its portion of the sheet.
 *
 * piecesPerSheet - how many copies of this exact shape actually fit on
 * one sheet - is a new nullable WoodenBaseInfos column, not a Settings
 * constant: it depends on each product's own shape, and isn't always
 * something a formula gets right (real-world nesting sometimes beats a
 * naive grid-packing estimate, or a fussy shape needs more clearance
 * than the algorithm assumes). NULL (the default - nothing back-filled
 * for existing rows) means "compute it live" via a straightforward grid-
 * packing estimate (try the kerf-padded piece both ways round against
 * the sheet, take whichever orientation fits more); a shop can instead
 * enter a real number - "learned through experience" - when editing a
 * product, which then always wins over the estimate.
 */
module.exports = {
  async up( queryInterface, Sequelize )
  {
    await queryInterface.addColumn( 'Settings', 'sheetCostPerSheet', { type: Sequelize.DataTypes.FLOAT, allowNull: true } )
    await queryInterface.addColumn( 'Settings', 'sheetWidthIn', { type: Sequelize.DataTypes.FLOAT, allowNull: false, defaultValue: 48.5 } )
    await queryInterface.addColumn( 'Settings', 'sheetHeightIn', { type: Sequelize.DataTypes.FLOAT, allowNull: false, defaultValue: 96.5 } )

    await queryInterface.addColumn( 'WoodenBaseInfos', 'piecesPerSheet', { type: Sequelize.DataTypes.INTEGER, allowNull: true } )

    await queryInterface.sequelize.query(
      "INSERT INTO `CostFactors` (`key`, `label`, `unit`, `category`, `rate`) VALUES ('sheetBreakage', 'Sheet Breakage', '$', 'material', 1)"
    )
  },

  async down( queryInterface, Sequelize )
  {
    const [factor] = await queryInterface.sequelize.query(
      "SELECT `id` FROM `CostFactors` WHERE `key` = 'sheetBreakage'", { type: Sequelize.QueryTypes.SELECT }
    )

    if( factor )
    {
      await queryInterface.sequelize.query( 'DELETE FROM `ProductCostOverrides` WHERE `costFactorId` = ?', { replacements: [factor.id] } )
      await queryInterface.sequelize.query( 'DELETE FROM `CostFactors` WHERE `id` = ?', { replacements: [factor.id] } )
    }

    await queryInterface.removeColumn( 'WoodenBaseInfos', 'piecesPerSheet' )

    await queryInterface.removeColumn( 'Settings', 'sheetHeightIn' )
    await queryInterface.removeColumn( 'Settings', 'sheetWidthIn' )
    await queryInterface.removeColumn( 'Settings', 'sheetCostPerSheet' )
  },
}
