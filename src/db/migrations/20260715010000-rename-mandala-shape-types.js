'use strict';

/*
 * Renames the hyphenated "Mandala-X" ShapeTypes to the same "Base
 * (Variant)" convention every other multi-variant custom shape already
 * uses (e.g. "Cora (Large)"): "Mandala-Avens" -> "Mandala (Avens)", and
 * "Mandala-Starlight (Mini)" -> "Mandala (Starlight, Mini)" (folding its
 * own size suffix into the one parenthetical rather than stacking two).
 *
 * This is a pure display-name change - no Contours/shapeTypeId rows are
 * touched. It matters beyond cosmetics though: CopyFromMenu.jsx (the
 * calculator's "Copy From..." picker) nests any shapes sharing a "Base"
 * under one submenu, so this also collapses that menu's 7 flat
 * "Mandala-*" entries down to a single "Mandala" group.
 */
const RENAMES = [
  { from: 'Mandala-Avens', to: 'Mandala (Avens)' },
  { from: 'Mandala-Planet', to: 'Mandala (Planet)' },
  { from: 'Mandala-Sonora', to: 'Mandala (Sonora)' },
  { from: 'Mandala-Starlight (Mini)', to: 'Mandala (Starlight, Mini)' },
  { from: 'Mandala-Starlight (Small)', to: 'Mandala (Starlight, Small)' },
  { from: 'Mandala-Starlight (Medium)', to: 'Mandala (Starlight, Medium)' },
  { from: 'Mandala-Starlight (Large)', to: 'Mandala (Starlight, Large)' },
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
