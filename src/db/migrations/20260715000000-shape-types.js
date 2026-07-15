'use strict';

/*
 * Promotes Contours.shapeType from a hardcoded 7-value ENUM into a real
 * ShapeTypes lookup table (name, key, description), and points every
 * Contour at one via shapeTypeId - including custom (svgData) contours,
 * which previously had no shape classification at all beyond their own
 * row name.
 *
 * This unifies "which shape family is this" for both kinds of contour.
 * It matters because custom shapes are often stored as multiple Contour
 * rows for the same family - e.g. the seeded "Willow Leaf, Outside" /
 * "Cora (Mini), Outside" + "..., Inside" + "..., Rabbet" - so grouping by
 * a contour's own row name (as the calculator's "Copy From..." product
 * picker used to) incorrectly split one shape family into several
 * groups. Grouping by shapeTypeId's shared family name fixes that.
 *
 * `key` is only set for the shapes buildFromType() (@/libs/mirror) can
 * draw parametrically from width/height alone (the original 7 ENUM
 * values); it stays null for shapes that only ever exist as svgData.
 */
const PARAMETRIC_SHAPES = [
  { key: 'chapel arch', name: 'Chapel Arch' },
  { key: 'circle', name: 'Circle' },
  { key: 'gothic arch', name: 'Gothic Arch' },
  { key: 'oval', name: 'Oval' },
  { key: 'rectangle', name: 'Rectangle' },
  { key: 'square', name: 'Square' },
  { key: 'vesica picscis', name: 'Vesica Piscis' },
]

// The seeded custom contours (20250311021615-contours.js) all name each
// role-specific row "<Family>, Outside" / "<Family>, Inside" / "<Family>,
// Rabbet" - stripping that suffix recovers the shared family name so
// same-family rows resolve to one ShapeType instead of one each.
const ROLE_SUFFIX = /, (Outside|Inside|Rabbet)$/

const FK_CONSTRAINT = 'contours_shape_type_id_fkey'

module.exports =
{
  async up( queryInterface, Sequelize )
  {
    await queryInterface.createTable( 'ShapeTypes', {
      id: { type: Sequelize.DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
      name: { type: Sequelize.DataTypes.STRING, allowNull: false, unique: true },
      key: { type: Sequelize.DataTypes.STRING, allowNull: true, unique: true },
      description: { type: Sequelize.DataTypes.TEXT, allowNull: true },
    })

    for( const shape of PARAMETRIC_SHAPES )
      await queryInterface.sequelize.query(
        'INSERT INTO `ShapeTypes` (`name`, `key`) VALUES (?, ?)',
        { replacements: [shape.name, shape.key] }
      )

    await queryInterface.addColumn( 'Contours', 'shapeTypeId', {
      type: Sequelize.DataTypes.INTEGER,
      allowNull: true,
    })

    // Point every parametric contour at its matching ShapeType.
    for( const shape of PARAMETRIC_SHAPES )
      await queryInterface.sequelize.query(
        'UPDATE `Contours` c JOIN `ShapeTypes` s ON s.`key` = ? SET c.`shapeTypeId` = s.`id` WHERE c.`shapeType` = ?',
        { replacements: [shape.key, shape.key] }
      )

    // Custom contours: derive each one's shape-family name, creating one
    // new ShapeType per distinct family and reusing it across every row
    // (Outside/Inside/Rabbet) that shares that family.
    const customContours = await queryInterface.sequelize.query(
      'SELECT `id`, `name` FROM `Contours` WHERE `shapeTypeId` IS NULL',
      { type: Sequelize.QueryTypes.SELECT }
    )

    const familyIdByName = new Map()

    for( const contour of customContours )
    {
      const familyName = contour.name.replace( ROLE_SUFFIX, '' )

      if( !familyIdByName.has( familyName ) )
      {
        await queryInterface.sequelize.query(
          'INSERT INTO `ShapeTypes` (`name`) VALUES (?)',
          { replacements: [familyName] }
        )

        // Re-selecting by name (unique) rather than trusting the INSERT
        // result's shape - that varies enough across Sequelize/dialect
        // versions that it's not worth relying on here.
        const [inserted] = await queryInterface.sequelize.query(
          'SELECT `id` FROM `ShapeTypes` WHERE `name` = ?',
          { replacements: [familyName], type: Sequelize.QueryTypes.SELECT }
        )
        familyIdByName.set( familyName, inserted.id )
      }

      await queryInterface.sequelize.query(
        'UPDATE `Contours` SET `shapeTypeId` = ? WHERE `id` = ?',
        { replacements: [familyIdByName.get( familyName ), contour.id] }
      )
    }

    await queryInterface.changeColumn( 'Contours', 'shapeTypeId', {
      type: Sequelize.DataTypes.INTEGER,
      allowNull: false,
    })

    await queryInterface.addConstraint( 'Contours', {
      fields: ['shapeTypeId'],
      type: 'foreign key',
      name: FK_CONSTRAINT,
      references: { table: 'ShapeTypes', field: 'id' },
    })

    await queryInterface.removeColumn( 'Contours', 'shapeType' )
  },

  async down( queryInterface, Sequelize )
  {
    await queryInterface.addColumn( 'Contours', 'shapeType', {
      type: Sequelize.DataTypes.ENUM( 'chapel arch', 'circle', 'gothic arch', 'oval', 'rectangle', 'square', 'vesica picscis' ),
      allowNull: true,
      unique: true,
    })

    for( const shape of PARAMETRIC_SHAPES )
      await queryInterface.sequelize.query(
        'UPDATE `Contours` c JOIN `ShapeTypes` s ON s.`id` = c.`shapeTypeId` SET c.`shapeType` = ? WHERE s.`key` = ?',
        { replacements: [shape.key, shape.key] }
      )

    await queryInterface.removeConstraint( 'Contours', FK_CONSTRAINT )
    await queryInterface.removeColumn( 'Contours', 'shapeTypeId' )
    await queryInterface.dropTable( 'ShapeTypes' )
  }
}
