'use strict'

/*
 * Grows Piece.phase from the original six Production Phases to the full
 * eight settled in the grill-with-docs follow-up session (see
 * CONTEXT.md's Production Phase entry): adds 'Picking' and 'Glass',
 * matching the CostFactor keys laborPicking/laborGlass that already
 * existed (20260805000000-labor-picking-cost-factor.js,
 * 20260802000000-labor-glass-cost-factor.js) but were never wired to
 * Piece until now. Which phases a given Piece actually passes through
 * depends on its Product's type - see src/libs/pieceScheduling.js's
 * PHASE_SEQUENCES - this migration only widens the set of values the
 * column can hold, it doesn't enforce a sequence.
 *
 * Unlike 20260723000000-rename-product-types.js's widen/UPDATE/narrow
 * dance, this doesn't need to preserve any existing rows' values - the
 * Pieces table has zero rows in both dev and production (order intake
 * doesn't exist yet), so a direct changeColumn to the final eight-value
 * ENUM is safe.
 */
module.exports = {
  async up( queryInterface, Sequelize )
  {
    await queryInterface.changeColumn( 'Pieces', 'phase', {
      type: Sequelize.DataTypes.ENUM( 'Design', 'CNC', 'Sanding', 'Picking', 'Gluing', 'Grouting', 'Glass', 'Finishing' ),
      allowNull: false,
      defaultValue: 'Design',
    } )
  },

  async down( queryInterface, Sequelize )
  {
    await queryInterface.changeColumn( 'Pieces', 'phase', {
      type: Sequelize.DataTypes.ENUM( 'Design', 'CNC', 'Sanding', 'Gluing', 'Grouting', 'Finishing' ),
      allowNull: false,
      defaultValue: 'Design',
    } )
  },
}
