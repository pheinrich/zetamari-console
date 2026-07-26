'use strict'

/*
 * Adds Settings.profilingKerfIn - the CNC profiling bit's actual
 * diameter/width (e.g. 0.25" for a 1/4" bit), a Machine setting.
 *
 * This is the input, not a pre-doubled "clearance" figure: two adjacent
 * pieces on the same sheet of plywood can't share a single cut line, so
 * each piece's true footprint (for sheet-nesting purposes - see the
 * forthcoming sheet-nesting cost factor in libs/costFactors.js) grows by
 * one full bit-width on every side it borders another piece or the sheet
 * edge - i.e. by 2x profilingKerfIn in each direction (width and height),
 * not 1x. A 1/4" bit therefore expands the wood OBB by 1/2" total in each
 * direction (1/4" on all four sides).
 */
module.exports = {
  async up( queryInterface, Sequelize )
  {
    await queryInterface.addColumn( 'Settings', 'profilingKerfIn', { type: Sequelize.DataTypes.FLOAT, allowNull: true } )
  },

  async down( queryInterface )
  {
    await queryInterface.removeColumn( 'Settings', 'profilingKerfIn' )
  },
}
