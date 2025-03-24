'use strict';

module.exports =
{
  async up( queryInterface, Sequelize )
  {
    return queryInterface.bulkInsert(
      'SupplierMaterials',
      [
        { supplierId: 1, materialId: 50, partNumber: '4RD312', url: 'https://www.shipwreckbeads.com/products/4rd312r-cz-round-luster-opaque-white-4mm-150pc', cost: 0.01565 },
      ])
  },

  async down( queryInterface, Sequelize )
  {
    return queryInterface.bulkDelete( 'SupplierMaterials', null, {} )
  }
}
