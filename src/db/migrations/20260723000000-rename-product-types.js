'use strict'

/*
 * Renames four Product.type values to their fuller, less ambiguous
 * names - 'substrate' -> 'wooden base', 'mirror' -> 'mirror glass',
 * 'birdhouse' -> 'birdhouse base', 'frame' -> 'picture frame' - and adds
 * a new 'kit' type (a purchasable bundle with no type-specific Info
 * table, same as 'grout'/'other'). Also adds Products.shippingWeight,
 * a separate manually-entered figure (packaging included) alongside the
 * existing `weight` column, which stays independent/manually-entered
 * too (see productCost.js's computeProductWeight() for the *computed*
 * material weight it can be initialized from - same "independent
 * figure with an optional compute-and-fill" relationship
 * priceWholesale/priceRetail already have to the cost breakdown).
 *
 * MySQL ENUM columns need a full column redefinition to change values -
 * there's no ALTER ... RENAME VALUE like Postgres, and unlike the
 * add-cogs-rate-profile migration (which only ever added a brand new
 * value), existing rows here already hold the *old* values, so this
 * has to widen the ENUM to include both old and new values first,
 * UPDATE every row, then narrow down to just the new set - changing
 * straight to the narrowed ENUM while old-valued rows still exist would
 * either fail or silently null them out, depending on strict mode.
 */

const RENAMES = [
  ['substrate', 'wooden base'],
  ['mirror', 'mirror glass'],
  ['birdhouse', 'birdhouse base'],
  ['frame', 'picture frame'],
]

const OLD_TYPES = ['bead', 'birdhouse', 'frame', 'grout', 'millefiori', 'mirror', 'substrate', 'tile', 'other']
const NEW_TYPES = ['bead', 'birdhouse base', 'picture frame', 'grout', 'kit', 'millefiori', 'mirror glass', 'other', 'tile', 'wooden base']

module.exports = {
  async up( queryInterface, Sequelize )
  {
    // Widen: old values + new values + 'kit', so existing rows remain
    // valid while they're being renamed below.
    await queryInterface.changeColumn( 'Products', 'type', {
      type: Sequelize.DataTypes.ENUM( ...new Set( [...OLD_TYPES, ...NEW_TYPES] ) ),
      allowNull: true,
    } )

    for( const [oldType, newType] of RENAMES )
      await queryInterface.sequelize.query(
        'UPDATE `Products` SET `type` = ? WHERE `type` = ?',
        { replacements: [newType, oldType] }
      )

    // Narrow: just the final set of values.
    await queryInterface.changeColumn( 'Products', 'type', {
      type: Sequelize.DataTypes.ENUM( ...NEW_TYPES ),
      allowNull: true,
    } )

    await queryInterface.addColumn( 'Products', 'shippingWeight', {
      type: Sequelize.DataTypes.FLOAT,
      allowNull: true,
    } )
  },

  async down( queryInterface, Sequelize )
  {
    await queryInterface.removeColumn( 'Products', 'shippingWeight' )

    await queryInterface.changeColumn( 'Products', 'type', {
      type: Sequelize.DataTypes.ENUM( ...new Set( [...OLD_TYPES, ...NEW_TYPES] ) ),
      allowNull: true,
    } )

    for( const [oldType, newType] of RENAMES )
      await queryInterface.sequelize.query(
        'UPDATE `Products` SET `type` = ? WHERE `type` = ?',
        { replacements: [oldType, newType] }
      )

    // Any row that was created with the new 'kit' type has nowhere to
    // go back to - null it out rather than leave it pointing at a value
    // the narrowed-back ENUM won't accept.
    await queryInterface.sequelize.query( "UPDATE `Products` SET `type` = NULL WHERE `type` = 'kit'" )

    await queryInterface.changeColumn( 'Products', 'type', {
      type: Sequelize.DataTypes.ENUM( ...OLD_TYPES ),
      allowNull: true,
    } )
  },
}
