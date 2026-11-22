'use strict'

/*
 * SupplierProducts.preferred: the one supplier/part # a product should be
 * bought from by default, even when another supplier is cheaper. A BOM
 * line costs its material at the supplier the line picks, else the
 * material's preferred row, else the cheapest priced row (see
 * libs/costFactors.js's resolveSupplierCost). At most one row per product
 * is preferred - enforced by setPreferredSupplierProduct(), not the
 * schema. Kept on the join row rather than as Products.preferred...Id so
 * Products and SupplierProducts don't reference each other.
 */
module.exports = {
  async up( queryInterface, Sequelize )
  {
    await queryInterface.addColumn( 'SupplierProducts', 'preferred', {
      type: Sequelize.DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    })
  },

  async down( queryInterface )
  {
    await queryInterface.removeColumn( 'SupplierProducts', 'preferred' )
  },
}
