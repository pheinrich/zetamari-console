'use strict'

/*
 * Second refinement of item 13's formula (see the
 * 20260725000000-owner-assistant-labor.js migration for the first): per
 * the follow-up discussion,
 *   COGS = Material + Machine cost + Assistant labor cost (no markup at all)
 *   Wholesale = COGS x (1 + Markup%) + Owner labor cost
 *   Retail = Wholesale x the existing wholesale-to-retail multiplier
 *
 * `wholesaleMultiplier` (a straight x1-style multiplier applied only to
 * Material+Machine cost, per the first version) is replaced by
 * `markupPercent` (a percentage applied to the *entire* COGS figure,
 * materials+machine+assistant labor together) - different enough in
 * both scope and unit that reusing the column under its old meaning
 * would silently misinterpret whatever was already configured, so this
 * renames the column and converts any existing value
 * ((old x1 multiplier - 1) x 100 = new % markup) rather than just
 * relabeling it. retailMultiplier is untouched - its role (Wholesale x
 * N = Retail) hasn't changed.
 */
module.exports = {
  async up( queryInterface, Sequelize )
  {
    await queryInterface.renameColumn( 'Settings', 'wholesaleMultiplier', 'markupPercent' )

    await queryInterface.sequelize.query( 'UPDATE `Settings` SET `markupPercent` = (`markupPercent` - 1) * 100' )

    await queryInterface.changeColumn( 'Settings', 'markupPercent', {
      type: Sequelize.DataTypes.FLOAT,
      allowNull: false,
      defaultValue: 25,
    } )
  },

  async down( queryInterface, Sequelize )
  {
    await queryInterface.sequelize.query( 'UPDATE `Settings` SET `markupPercent` = (`markupPercent` / 100) + 1' )

    await queryInterface.changeColumn( 'Settings', 'markupPercent', {
      type: Sequelize.DataTypes.FLOAT,
      allowNull: false,
      defaultValue: 1,
    } )

    await queryInterface.renameColumn( 'Settings', 'markupPercent', 'wholesaleMultiplier' )
  },
}
