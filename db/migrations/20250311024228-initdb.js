'use strict';

module.exports =
{
  async up( queryInterface, Sequelize )
  {
    await queryInterface.createTable(
      'Users',
      {
        id: { type: Sequelize.DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
        name: { type: Sequelize.DataTypes.STRING, allowNull: false },
        email: { type: Sequelize.DataTypes.STRING, unique: true, allowNull: false },
        password: { type: Sequelize.DataTypes.STRING, allowNull: false },
      })

    await queryInterface.createTable(
      'Products',
      {
        id: { type: Sequelize.DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
        name: { type: Sequelize.DataTypes.STRING, unique: true, allowNull: false },
        sku: { type: Sequelize.DataTypes.STRING, unique: true, allowNull: false },
        description: { type: Sequelize.DataTypes.TEXT },
        priceWholesale: { type: Sequelize.DataTypes.DECIMAL( 5, 2 ) },
        priceRetail: { type: Sequelize.DataTypes.DECIMAL( 5, 2 ) },
      })

    await queryInterface.createTable(
      'Materials',
      {
        id: { type: Sequelize.DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
        name: { type: Sequelize.DataTypes.STRING, unique: true, allowNull: false },
        type: { type: Sequelize.DataTypes.ENUM( 'bead', 'birdhouse', 'grout', 'mirror', 'frame', 'tile', 'substrate' ), allowNull: false },
        sku: { type: Sequelize.DataTypes.STRING, unique: true, allowNull: false },
        units: { type: Sequelize.DataTypes.STRING, defaultValue: 'each' },
        weight: { type: Sequelize.DataTypes.FLOAT },
        description: { type: Sequelize.DataTypes.TEXT }
      })

    await queryInterface.createTable(
      'ProductMaterials',
      {
        productId: { type: Sequelize.DataTypes.INTEGER, allowNull: false, foreignKey: true },
        materialId: { type: Sequelize.DataTypes.INTEGER, allowNull: false, foreignKey: true },
        quantity: { type: Sequelize.DataTypes.FLOAT, allowNull: false },
      },
      {
        uniqueKeys: [
          { name: "productIdmaterialId", singleField: false, fields: ['productId', 'materialId'], }
        ]
      })

    await queryInterface.createTable(
      'BeadInfos',
      {
        materialId: { type: Sequelize.DataTypes.INTEGER, allowNull: false, foreignKey: true },
        type: { type: Sequelize.DataTypes.ENUM( 'glass', 'plastic', 'ceramic', 'shell', 'metal', 'rhinestone', 'cabochon', 'other' ), defaultValue: 'plastic' },
        finish: { type: Sequelize.DataTypes.ENUM( 'fire-polished', 'silvered', 'opaque', 'opaque luster', 'transparent', 'aurora borealis', 'plain' ), defaultValue: 'plain' },
        shape: { type: Sequelize.DataTypes.ENUM( 'round', 'faceted round', 'bicone', 'drop', 'rondelle', 'rivoli', 'chaton', 'other' ), defaultValue: 'round' },
        color: { type: Sequelize.DataTypes.STRING, allowNull: false },
        width: { type: Sequelize.DataTypes.FLOAT, defaultValue: 6.0 },
        height: { type: Sequelize.DataTypes.FLOAT, defaultValue: 6.0 },
        depth: { type: Sequelize.DataTypes.FLOAT, defaultValue: 6.0 },
      })

    await queryInterface.createTable(
      'SubstrateInfos',
      {
        materialId: { type: Sequelize.DataTypes.INTEGER, allowNull: false, foreignKey: true },
        outsideId: { type: Sequelize.DataTypes.INTEGER, allowNull: false, foreignKey: true },
        insideId: { type: Sequelize.DataTypes.INTEGER, foreignKey: true },
        rabbetId: { type: Sequelize.DataTypes.INTEGER, foreignKey: true },
        width: { type: Sequelize.DataTypes.FLOAT, allowNull: false },
        height: { type: Sequelize.DataTypes.FLOAT, allowNull: false },
        depth: { type: Sequelize.DataTypes.FLOAT, defaultValue: 0.455 },
        border: { type: Sequelize.DataTypes.FLOAT, defaultValue: 1.0 },
      })

    await queryInterface.createTable(
      'TileInfos',
      {
        materialId: { type: Sequelize.DataTypes.INTEGER, allowNull: false, foreignKey: true },
        color: { type: Sequelize.DataTypes.STRING, allowNull: false },
        width: { type: Sequelize.DataTypes.FLOAT, defaultValue: 20.0 },
        height: { type: Sequelize.DataTypes.FLOAT, defaultValue: 20.0 },
        depth: { type: Sequelize.DataTypes.FLOAT, defaultValue: 5.5 },
      })

    await queryInterface.createTable(
      'Contours',
      {
        id: { type: Sequelize.DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
        name: { type: Sequelize.DataTypes.STRING, unique: true, allowNull: false },
        svgData: { type: Sequelize.DataTypes.TEXT },
      })

    await queryInterface.createTable(
      'Suppliers',
      {
        id: { type: Sequelize.DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
        name: { type: Sequelize.DataTypes.STRING, unique: true, allowNull: false },
        email: { type: Sequelize.DataTypes.STRING },
        address: { type: Sequelize.DataTypes.STRING },
        phone: { type: Sequelize.DataTypes.STRING },
        url: { type: Sequelize.DataTypes.STRING },
        notes: { type: Sequelize.DataTypes.TEXT },
      })

    await queryInterface.createTable(
      'SupplierMaterials',
      {
        supplierId: { type: Sequelize.DataTypes.INTEGER, allowNull: false, foreignKey: true },
        materialId: { type: Sequelize.DataTypes.INTEGER, allowNull: false, foreignKey: true },
        partNumber: { type: Sequelize.DataTypes.STRING, allowNull: false },
        url: { type: Sequelize.DataTypes.STRING },
        cost: { type: Sequelize.DataTypes.FLOAT },
      })

    await queryInterface.createTable(
      'Orders',
      {
        id: { type: Sequelize.DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
        createdOn: { type: Sequelize.DataTypes.DATEONLY, defaultValue: Sequelize.DataTypes.NOW },
        completedOn: { type: Sequelize.DataTypes.DATEONLY },
        packedOn: { type: Sequelize.DataTypes.DATEONLY },
      })

    await queryInterface.createTable(
      'OrderProducts',
      {
        orderId: { type: Sequelize.DataTypes.INTEGER, allowNull: false, foreignKey: true },
        productId: { type: Sequelize.DataTypes.INTEGER, allowNull: false, foreignKey: true },
        quantity: { type: Sequelize.DataTypes.FLOAT, defaultValue: 1 },
      })

    await queryInterface.createTable(
      'Shipments',
      {
        orderId: { type: Sequelize.DataTypes.INTEGER, allowNull: false, foreignKey: true },
        carrier: { type: Sequelize.DataTypes.STRING, allowNull: false },
        tracking: { type: Sequelize.DataTypes.STRING, allowNull: false },
        createdOn: { type: Sequelize.DataTypes.DATEONLY, defaultValue: Sequelize.DataTypes.NOW },
      })
  },

  async down( queryInterface, Sequelize )
  {
    await queryInterface.dropTable( 'Shipments' )
    await queryInterface.dropTable( 'OrderProducts' )
    await queryInterface.dropTable( 'Orders' )
    await queryInterface.dropTable( 'SupplierMaterials' )
    await queryInterface.dropTable( 'Suppliers' )
    await queryInterface.dropTable( 'Contours' )
    await queryInterface.dropTable( 'TileInfos' )
    await queryInterface.dropTable( 'SubstrateInfos' )
    await queryInterface.dropTable( 'BeadInfos' )
    await queryInterface.dropTable( 'ProductMaterials' )
    await queryInterface.dropTable( 'Materials' )
    await queryInterface.dropTable( 'Products' )
    await queryInterface.dropTable( 'Users' )
  }
}
