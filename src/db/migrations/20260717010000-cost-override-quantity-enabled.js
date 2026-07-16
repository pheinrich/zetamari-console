'use strict'

/*
 * ProductCostOverride was sparse in one dimension only - a row existed
 * iff a factor's computed quantity had been manually overridden. Adding
 * a per-factor include/exclude checkbox (see the ProductCostEditor.jsx
 * "Bill of Materials" work) needs the same sparse-override treatment for
 * a second, independent thing: whether the factor counts toward the
 * product's cost at all. So `quantity` (always required) becomes
 * `quantityOverride` (nullable - null means "not overridden, use the
 * computed default"), and a new nullable `enabledOverride` boolean is
 * added alongside it. A row can now exist with just one of the two set;
 * it's only deleted once both are back to null (see productCost.js's
 * setProductCostOverride/revertProductCostOverride and the new
 * setProductCostFactorEnabled/revertProductCostFactorEnabled).
 */
module.exports = {
  async up( queryInterface, Sequelize )
  {
    await queryInterface.renameColumn( 'ProductCostOverrides', 'quantity', 'quantityOverride' )
    await queryInterface.changeColumn( 'ProductCostOverrides', 'quantityOverride', { type: Sequelize.DataTypes.FLOAT, allowNull: true } )
    await queryInterface.addColumn( 'ProductCostOverrides', 'enabledOverride', { type: Sequelize.DataTypes.BOOLEAN, allowNull: true } )
  },

  async down( queryInterface, Sequelize )
  {
    await queryInterface.removeColumn( 'ProductCostOverrides', 'enabledOverride' )

    // A row that only existed to override `enabled` (quantityOverride
    // still null) has no meaning under the old single-purpose schema -
    // drop it rather than coerce a null quantity into allowNull:false.
    await queryInterface.sequelize.query( 'DELETE FROM `ProductCostOverrides` WHERE `quantityOverride` IS NULL' )

    await queryInterface.changeColumn( 'ProductCostOverrides', 'quantityOverride', { type: Sequelize.DataTypes.FLOAT, allowNull: false } )
    await queryInterface.renameColumn( 'ProductCostOverrides', 'quantityOverride', 'quantity' )
  },
}
