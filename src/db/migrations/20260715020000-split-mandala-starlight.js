'use strict';

/*
 * "Mandala (Avens)" / "Mandala (Planet)" / "Mandala (Sonora)" / "Mandala
 * (Starlight)" are meant to be four separate top-level shape families in
 * CopyFromMenu.jsx, not one "Mandala" group with four variants - Avens,
 * Planet and Sonora each have no further size breakdown, while Starlight
 * still does (Mini/Small/Medium/Large).
 *
 * CopyFromMenu.jsx's Base (Variant) grouping now only groups when the
 * parsed Variant is a recognized size word (see SIZE_WORDS there), so
 * "Mandala (Avens)" etc. (Variant = "Avens", not a size word) already
 * stay standalone - no rename needed for those three.
 *
 * Starlight's size rows, though, are still named "Mandala (Starlight,
 * Mini)" etc. (from 20260715010000), which parses as Base "Mandala",
 * Variant "Starlight, Mini" - not a recognized size word, so it would
 * currently ALSO stay standalone (four flat "Mandala (Starlight, X)"
 * entries) instead of grouping under one "Mandala (Starlight)". Renaming
 * to "Mandala (Starlight) (Mini)" makes the (greedy) Base/Variant regex
 * capture Base = "Mandala (Starlight)", Variant = "Mini" - a recognized
 * size word - so the four rows group correctly under their own "Mandala
 * (Starlight)" entry, separate from the other three Mandala flavors.
 */
const RENAMES = [
  { from: 'Mandala (Starlight, Mini)', to: 'Mandala (Starlight) (Mini)' },
  { from: 'Mandala (Starlight, Small)', to: 'Mandala (Starlight) (Small)' },
  { from: 'Mandala (Starlight, Medium)', to: 'Mandala (Starlight) (Medium)' },
  { from: 'Mandala (Starlight, Large)', to: 'Mandala (Starlight) (Large)' },
]

module.exports =
{
  async up( queryInterface )
  {
    for( const {from, to} of RENAMES )
      await queryInterface.sequelize.query(
        'UPDATE `ShapeTypes` SET `name` = ? WHERE `name` = ?',
        { replacements: [to, from] }
      )
  },

  async down( queryInterface )
  {
    for( const {from, to} of RENAMES )
      await queryInterface.sequelize.query(
        'UPDATE `ShapeTypes` SET `name` = ? WHERE `name` = ?',
        { replacements: [from, to] }
      )
  }
}
