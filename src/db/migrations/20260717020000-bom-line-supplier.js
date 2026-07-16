'use strict'

/*
 * Which supplier's price a BOM line uses for its "actual cost" (see the
 * new Bill of Materials CostFactor) - nullable, so a line defaults to
 * its material's cheapest available SupplierProduct.cost until someone
 * explicitly picks a different one via the BomEditor's supplier picker
 * (only shown once a material has more than one supplier on file).
 * SET NULL on delete: removing a supplier just falls a line back to the
 * cheapest-remaining default rather than blocking the delete.
 */
module.exports = {
  async up( queryInterface, Sequelize )
  {
    await queryInterface.addColumn( 'BillOfMaterials', 'supplierId', {
      type: Sequelize.DataTypes.INTEGER,
      allowNull: true,
      references: { model: 'Suppliers', key: 'id' },
      onDelete: 'SET NULL',
    })
  },

  async down( queryInterface )
  {
    await queryInterface.removeColumn( 'BillOfMaterials', 'supplierId' )
  },
}
