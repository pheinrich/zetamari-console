'use strict';

/*
 * Adds Contours.shapeType - records which of the 7 parametric shapes
 * (buildFromType() in @/libs/mirror) a "basic shape" (no svgData) contour
 * represents. Previously nothing recorded this; three call sites papered
 * over the gap by passing the contour's row id into buildFromType() as if
 * it were the shape code, which only worked by coincidence of insertion
 * order. `unique: true` (rather than a partial/filtered index) is the
 * MySQL-friendly way to enforce "at most one contour per basic shape type"
 * while still allowing unlimited custom contours, since MySQL's unique
 * indexes treat NULL as distinct from all other NULLs.
 */
// Name -> shapeType for the 7 basic-shape rows the standard seeder
// (20250311021615-contours.js) creates by name, in this exact order -
// backfilled below so anyone who ran the seeders doesn't end up with all 7
// silently blank after this migration.
const SEEDED_NAMES = {
  'Chapel Arch': 'chapel arch',
  'Circle': 'circle',
  'Gothic Arch': 'gothic arch',
  'Oval': 'oval',
  'Rectangle': 'rectangle',
  'Square': 'square',
  'Vesica Piscis': 'vesica picscis',
}

module.exports =
{
  async up( queryInterface, Sequelize )
  {
    await queryInterface.addColumn(
      'Contours',
      'shapeType',
      {
        type: Sequelize.DataTypes.ENUM( 'chapel arch', 'circle', 'gothic arch', 'oval', 'rectangle', 'square', 'vesica picscis' ),
        allowNull: true,
        unique: true,
      })

    for( const [name, shapeType] of Object.entries( SEEDED_NAMES ) )
      await queryInterface.sequelize.query(
        'UPDATE `Contours` SET `shapeType` = ? WHERE `name` = ? AND `svgData` IS NULL',
        { replacements: [shapeType, name] }
      )
  },

  async down( queryInterface )
  {
    await queryInterface.removeColumn( 'Contours', 'shapeType' )
  }
}
