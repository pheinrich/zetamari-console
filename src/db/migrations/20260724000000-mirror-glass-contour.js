'use strict'

// Adds a nullable contourId to MirrorGlassInfo - the first step toward
// item 8 of the 2026-07-23 refactor ("start thinking about how
// MirrorGlass products might incorporate a single Contour representing
// their shape"). Deliberately additive rather than a replacement: the
// existing `shape` ENUM/width/height/thickness/bevel columns are
// untouched, so every existing MirrorGlassInfo row keeps working as-is.
// A product can optionally reference a real Contour (with its own
// svgData/shape family, same catalog WoodenBaseInfo's outside/inside/
// rabbet already draw from) once one applies to it; nothing consumes
// this column yet (no geometry/cost wiring), so it's safe to add ahead
// of that follow-up work.
module.exports = {
  async up( queryInterface, Sequelize ) {
    await queryInterface.addColumn( 'MirrorGlassInfos', 'contourId', {
      type: Sequelize.DataTypes.INTEGER,
      allowNull: true,
      references: { model: 'Contours', key: 'id' },
    } )
  },

  async down( queryInterface ) {
    await queryInterface.removeColumn( 'MirrorGlassInfos', 'contourId' )
  },
}
