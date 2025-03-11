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
        beadInfoId: { type: Sequelize.DataTypes.INTEGER, foreignKey: true },
        substrateInfoId: { type: Sequelize.DataTypes.INTEGER, foreignKey: true },
        TileInfoId: { type: Sequelize.DataTypes.INTEGER, foreignKey: true },
        name: { type: Sequelize.DataTypes.STRING, unique: true, allowNull: false },
        type: { type: Sequelize.DataTypes.ENUM( 'bead', 'birdhouse', 'grout', 'mirror', 'frame', 'tile', 'substrate' ), allowNull: false },
        sku: { type: Sequelize.DataTypes.STRING, unique: true, allowNull: false },
        units: { type: Sequelize.DataTypes.STRING, defaultValue: 'each' },
        weight: { type: Sequelize.DataTypes.FLOAT },
        description: { type: Sequelize.DataTypes.TEXT }
      })

    await queryInterface.createTable(
      'ProductMaterial',
      {
        productId: { type: Sequelize.DataTypes.INTEGER, allowNull: false, foreignKey: true },
        materialId: { type: Sequelize.DataTypes.INTEGER, allowNull: false, foreignKey: true },
        quantity: { type: Sequelize.DataTypes.FLOAT, allowNull: false },
        width: { type: Sequelize.DataTypes.FLOAT, defaultValue: 1.0 },
        height: { type: Sequelize.DataTypes.FLOAT, defaultValue: 1.0 },
      },
      {
        uniqueKeys: [
          { name: "productIdmaterialId", singleField: false, fields: ['productId', 'materialId'], }
        ]
      })

    await queryInterface.createTable(
      'BeadInfos',
      {
        id: { type: Sequelize.DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
        type: { type: Sequelize.DataTypes.ENUM( 'ceramic', 'plastic', 'metal' ), defaultValue: 'plastic' },
        finish: { type: Sequelize.DataTypes.ENUM( 'fire-polished', 'iridized', 'metalized', 'plain' ), defaultValue: 'plain' },
        color: { type: Sequelize.DataTypes.STRING, allowNull: false },
        width: { type: Sequelize.DataTypes.FLOAT, defaultValue: 6.0 },
        height: { type: Sequelize.DataTypes.FLOAT, defaultValue: 6.0 },
        depth: { type: Sequelize.DataTypes.FLOAT, defaultValue: 6.0 },
      })

    await queryInterface.createTable(
      'SubstrateInfos',
      {
        id: { type: Sequelize.DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
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
        id: { type: Sequelize.DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
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
  },

  async down( queryInterface, Sequelize )
  {
    await queryInterface.dropTable( 'Contours' )
    await queryInterface.dropTable( 'TileInfos' )
    await queryInterface.dropTable( 'SubstrateInfos' )
    await queryInterface.dropTable( 'BeadInfos' )
    await queryInterface.dropTable( 'ProductMaterial' )
    await queryInterface.dropTable( 'Materials' )
    await queryInterface.dropTable( 'Products' )
    await queryInterface.dropTable( 'Users' )
  }
}
