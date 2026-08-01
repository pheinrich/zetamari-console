'use strict'

/*
 * Splits the single "Sheet Breakage" Material CostFactor
 * (20260731000000-sheet-breakage-cost-factor.js) into two - Wooden Base
 * and Mirror Glass are both cut from standard sheet stock, so both incur
 * the same kind of "this piece's share of the sheet costs more than its
 * simple per-sq-in estimate suggests, because only a few copies fit"
 * penalty, per the 2026-08-04 Visualizer discussion. Renames the existing
 * row (key 'sheetBreakage' -> 'sheetBreakageWood', label "Sheet Breakage"
 * -> "Sheet Breakage (Wood)") rather than leaving it as a bare "Wood"-
 * unqualified row now that a Glass counterpart exists, and adds
 * 'sheetBreakageGlass' alongside it - same "$" pass-through convention
 * (rate=1, the computed quantity IS the dollar figure - see
 * libs/costFactors.js).
 *
 * Three new Settings fields describe the shop's standard sheet of mirror
 * glass, mirroring sheetCostPerSheet/sheetWidthIn/sheetHeightIn's wood
 * equivalent - but, unlike wood's fields, all three are nullable with no
 * forced default: plywood sheets are a near-universal 4'x8' (see the
 * original migration's 48.5"x96.5" default), but mirror glass sheet stock
 * varies a lot by supplier, so there's no one-size default worth assuming.
 * Deliberately NOT wired into the 'mirrorGlass' CostFactor's own rate the
 * way sheetWidthIn/sheetHeightIn/sheetCostPerSheet feed 'woodenBase''s
 * rate (see libs/woodenBaseRates.js) - Mirror Glass material pricing
 * stays a manually-entered $/sq-in figure; only the new *breakage
 * surcharge* is sheet-derived (see libs/glassSheetRates.js).
 *
 * WoodenBaseInfos.glassPiecesPerSheet mirrors WoodenBaseInfos.
 * piecesPerSheet (same original migration) - NULL means "not yet known,
 * estimate live via grid-packing"; a shop can enter a real learned-
 * through-experience count that always wins over the estimate, same
 * convention. Lives on WoodenBaseInfo rather than MirrorGlassInfo because
 * the glass geometry this feeds is the wood shape's own cutout
 * (`mirror.glass`), not a separate Mirror Glass product's own dimensions -
 * see MirrorGlassInfo.js's doc comment.
 */
module.exports = {
  async up( queryInterface, Sequelize )
  {
    await queryInterface.sequelize.query(
      "UPDATE `CostFactors` SET `key` = 'sheetBreakageWood', `label` = 'Sheet Breakage (Wood)' WHERE `key` = 'sheetBreakage'"
    )

    await queryInterface.bulkInsert( 'CostFactors', [
      { key: 'sheetBreakageGlass', label: 'Sheet Breakage (Glass)', unit: '$', category: 'material', rate: 1 },
    ] )

    await queryInterface.addColumn( 'Settings', 'glassSheetCostPerSheet', { type: Sequelize.DataTypes.FLOAT, allowNull: true } )
    await queryInterface.addColumn( 'Settings', 'glassSheetWidthIn', { type: Sequelize.DataTypes.FLOAT, allowNull: true } )
    await queryInterface.addColumn( 'Settings', 'glassSheetHeightIn', { type: Sequelize.DataTypes.FLOAT, allowNull: true } )

    await queryInterface.addColumn( 'WoodenBaseInfos', 'glassPiecesPerSheet', { type: Sequelize.DataTypes.INTEGER, allowNull: true } )
  },

  async down( queryInterface, Sequelize )
  {
    await queryInterface.removeColumn( 'WoodenBaseInfos', 'glassPiecesPerSheet' )

    await queryInterface.removeColumn( 'Settings', 'glassSheetHeightIn' )
    await queryInterface.removeColumn( 'Settings', 'glassSheetWidthIn' )
    await queryInterface.removeColumn( 'Settings', 'glassSheetCostPerSheet' )

    const [factor] = await queryInterface.sequelize.query(
      "SELECT `id` FROM `CostFactors` WHERE `key` = 'sheetBreakageGlass'", { type: Sequelize.QueryTypes.SELECT }
    )

    if( factor )
    {
      await queryInterface.sequelize.query( 'DELETE FROM `ProductCostOverrides` WHERE `costFactorId` = ?', { replacements: [factor.id] } )
      await queryInterface.sequelize.query( 'DELETE FROM `CostFactors` WHERE `id` = ?', { replacements: [factor.id] } )
    }

    await queryInterface.sequelize.query(
      "UPDATE `CostFactors` SET `key` = 'sheetBreakage', `label` = 'Sheet Breakage' WHERE `key` = 'sheetBreakageWood'"
    )
  },
}
