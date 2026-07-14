'use strict';

/*
 * Collapses the size-variant ShapeTypes for Cora, Leaf, and Mandala
 * (Starlight) - the three families CopyFromMenu.jsx was only grouping
 * into one menu entry at render time - into a single ShapeType row per
 * family, matching the flat, dimension-sorted layout we settled on (no
 * separate row per size). Every other ShapeType (the 7 parametric
 * shapes, Cloud/Mina/Neslo/Neslo Whimsy/Willow Leaf, and the three
 * standalone Mandala flavors) is already a single row and untouched,
 * leaving exactly the 18 top-level shapes: Chapel Arch, Circle, Gothic
 * Arch, Oval, Rectangle, Square, Vesica Piscis, Cloud, Cora, Leaf,
 * Mandala (Avens), Mandala (Planet), Mandala (Sonora), Mandala
 * (Starlight), Mina, Neslo, Neslo Whimsy, Willow Leaf.
 *
 * For each collapsed family, one of its existing size rows is kept
 * (renamed to the plain family name) and every Contour pointing at the
 * other size rows is repointed to it; the now-unreferenced size rows are
 * then deleted.
 *
 * No CopyFromMenu.jsx code changes are needed for this: groupByShape()
 * already merges same-name shapes into one flat, dimension-sorted entry,
 * and parseBaseVariant()'s size-word gate already leaves a plain "Cora"
 * or "Mandala (Starlight)" name alone (no trailing size word to match)
 * rather than trying to re-split it.
 */
const ROLE_SUFFIX = /, (Outside|Inside|Rabbet)$/

const GROUPS = [
  {
    name: 'Cora',
    variants: ['Cora (Large)', 'Cora (Medium)', 'Cora (Mini)', 'Cora (Small)'],
  },
  {
    name: 'Leaf',
    variants: ['Leaf (Large)', 'Leaf (Medium)', 'Leaf (Small)'],
  },
  {
    name: 'Mandala (Starlight)',
    variants: [
      'Mandala (Starlight) (Large)',
      'Mandala (Starlight) (Medium)',
      'Mandala (Starlight) (Mini)',
      'Mandala (Starlight) (Small)',
    ],
  },
]

module.exports =
{
  async up( queryInterface, Sequelize )
  {
    for( const group of GROUPS )
    {
      const rows = await queryInterface.sequelize.query(
        'SELECT `id`, `name` FROM `ShapeTypes` WHERE `name` IN (?)',
        { replacements: [group.variants], type: Sequelize.QueryTypes.SELECT }
      )
      if( 0 === rows.length )
        continue

      const [keeper, ...orphans] = rows

      await queryInterface.sequelize.query(
        'UPDATE `ShapeTypes` SET `name` = ? WHERE `id` = ?',
        { replacements: [group.name, keeper.id] }
      )

      for( const orphan of orphans )
      {
        await queryInterface.sequelize.query(
          'UPDATE `Contours` SET `shapeTypeId` = ? WHERE `shapeTypeId` = ?',
          { replacements: [keeper.id, orphan.id] }
        )
        await queryInterface.sequelize.query(
          'DELETE FROM `ShapeTypes` WHERE `id` = ?',
          { replacements: [orphan.id] }
        )
      }
    }
  },

  // Re-derives each collapsed family's original, size-specific ShapeType
  // per contour from the contour's own row name (e.g. "Cora (Large),
  // Outside" -> "Cora (Large)") - the same ROLE_SUFFIX-stripping
  // technique 20260715000000-shape-types.js uses - rather than trying to
  // remember which contour came from which size row.
  async down( queryInterface, Sequelize )
  {
    for( const group of GROUPS )
    {
      const [collapsed] = await queryInterface.sequelize.query(
        'SELECT `id` FROM `ShapeTypes` WHERE `name` = ?',
        { replacements: [group.name], type: Sequelize.QueryTypes.SELECT }
      )
      if( !collapsed )
        continue

      const contours = await queryInterface.sequelize.query(
        'SELECT `id`, `name` FROM `Contours` WHERE `shapeTypeId` = ?',
        { replacements: [collapsed.id], type: Sequelize.QueryTypes.SELECT }
      )

      const idByFamily = new Map()

      for( const contour of contours )
      {
        const familyName = contour.name.replace( ROLE_SUFFIX, '' )

        if( !idByFamily.has( familyName ) )
        {
          const [existing] = await queryInterface.sequelize.query(
            'SELECT `id` FROM `ShapeTypes` WHERE `name` = ?',
            { replacements: [familyName], type: Sequelize.QueryTypes.SELECT }
          )

          if( existing )
          {
            idByFamily.set( familyName, existing.id )
          }
          else
          {
            await queryInterface.sequelize.query(
              'INSERT INTO `ShapeTypes` (`name`) VALUES (?)',
              { replacements: [familyName] }
            )
            const [inserted] = await queryInterface.sequelize.query(
              'SELECT `id` FROM `ShapeTypes` WHERE `name` = ?',
              { replacements: [familyName], type: Sequelize.QueryTypes.SELECT }
            )
            idByFamily.set( familyName, inserted.id )
          }
        }

        await queryInterface.sequelize.query(
          'UPDATE `Contours` SET `shapeTypeId` = ? WHERE `id` = ?',
          { replacements: [idByFamily.get( familyName ), contour.id] }
        )
      }

      await queryInterface.sequelize.query(
        'DELETE FROM `ShapeTypes` WHERE `id` = ?',
        { replacements: [collapsed.id] }
      )
    }
  }
}
