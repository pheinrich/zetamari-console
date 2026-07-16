'use strict';

/*
 * Recast by Claude (see /Users/peter/Documents/Development/zetamari/claude)
 * to unify the old separate `Products` and `Materials` tables into a single
 * `Products` table: a product may be a purchasable end item (`sellable:
 * true`), a raw material consumed by other products' bills of materials, or
 * both - "some materials may also be products". The old `ProductMaterials`
 * join is now `BillOfMaterials`, a self-referential join on `Products`
 * (parentProductId / materialProductId + quantity). The six `*Info`
 * extension tables (Bead/Frame/Millefiori/Mirror/Substrate/Tile) are
 * unchanged in shape, just repointed from `materialId` to `productId`.
 * `SupplierMaterials` is renamed `SupplierProducts` for the same reason.
 *
 * The original (unmodified) schema is preserved for reference in the
 * `workbench` project this was forked from.
 */
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

    // Unified Products table (was: Products + Materials).
    await queryInterface.createTable(
      'Products',
      {
        id: { type: Sequelize.DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
        name: { type: Sequelize.DataTypes.STRING, unique: true, allowNull: false },
        sku: { type: Sequelize.DataTypes.STRING, unique: true, allowNull: false },
        // Null for finished/assembled products that are just a bill of
        // materials with no type-specific Info row (e.g. a framed mosaic
        // mirror). Set for raw materials that have a matching *Info row.
        type: { type: Sequelize.DataTypes.ENUM( 'bead', 'birdhouse', 'frame', 'grout', 'millefiori', 'mirror', 'substrate', 'tile', 'other' ), allowNull: true },
        // Whether a customer may purchase this directly. Raw materials that
        // only ever appear in another product's bill of materials should be
        // false; a material that's also sold on its own (e.g. loose beads)
        // can be true on the same row - "some materials may also be
        // products" doesn't require two rows, just this flag.
        sellable: { type: Sequelize.DataTypes.BOOLEAN, allowNull: false, defaultValue: true },
        units: { type: Sequelize.DataTypes.STRING, defaultValue: 'each' },
        weight: { type: Sequelize.DataTypes.FLOAT },
        description: { type: Sequelize.DataTypes.TEXT },
        priceWholesale: { type: Sequelize.DataTypes.DECIMAL( 8, 2 ) },
        priceRetail: { type: Sequelize.DataTypes.DECIMAL( 8, 2 ) },
      })

    // Bill of materials: self-referential on Products. parentProductId is
    // the assembly/finished product; materialProductId is the component
    // product it consumes, at some quantity.
    await queryInterface.createTable(
      'BillOfMaterials',
      {
        id: { type: Sequelize.DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
        parentProductId: {
          type: Sequelize.DataTypes.INTEGER,
          allowNull: false,
          references: { model: 'Products', key: 'id' },
          onDelete: 'CASCADE',
        },
        materialProductId: {
          type: Sequelize.DataTypes.INTEGER,
          allowNull: false,
          references: { model: 'Products', key: 'id' },
          onDelete: 'RESTRICT',
        },
        quantity: { type: Sequelize.DataTypes.FLOAT, allowNull: false },
      },
      {
        uniqueKeys: [
          { name: 'bom_parent_material_unique', fields: ['parentProductId', 'materialProductId'] }
        ]
      })

    await queryInterface.createTable(
      'BeadInfos',
      {
        productId: { type: Sequelize.DataTypes.INTEGER, primaryKey: true, references: { model: 'Products', key: 'id' }, onDelete: 'CASCADE', allowNull: false },
        category: { type: Sequelize.DataTypes.ENUM( 'glass', 'plastic', 'ceramic', 'shell', 'metal', 'rhinestone', 'cabochon', 'other' ), defaultValue: 'plastic' },
        finish: { type: Sequelize.DataTypes.ENUM( 'fire-polished', 'silvered', 'opaque', 'opaque luster', 'transparent', 'aurora borealis', 'plain' ), defaultValue: 'plain' },
        shape: { type: Sequelize.DataTypes.ENUM( 'round', 'faceted round', 'bicone', 'drop', 'rondelle', 'rivoli', 'chaton', 'other' ), defaultValue: 'round' },
        color: { type: Sequelize.DataTypes.STRING, allowNull: false },
        length: { type: Sequelize.DataTypes.FLOAT, defaultValue: 6.0 },
        height: { type: Sequelize.DataTypes.FLOAT, defaultValue: 6.0 },
        thickness: { type: Sequelize.DataTypes.FLOAT, defaultValue: 6.0 },
      })

    // Frames are always rectangular (per Angie), so no shape/contour fields.
    await queryInterface.createTable(
      'FrameInfos',
      {
        productId: { type: Sequelize.DataTypes.INTEGER, primaryKey: true, references: { model: 'Products', key: 'id' }, onDelete: 'CASCADE', allowNull: false },
        width: { type: Sequelize.DataTypes.FLOAT, defaultValue: 20.0 },
        height: { type: Sequelize.DataTypes.FLOAT, defaultValue: 20.0 },
        thickness: { type: Sequelize.DataTypes.FLOAT, defaultValue: 5.5 },
        channel: { type: Sequelize.DataTypes.FLOAT, defaultValue: 1.75 },
        border: { type: Sequelize.DataTypes.FLOAT, defaultValue: 0.25 },
        photoWidth: { type: Sequelize.DataTypes.FLOAT, defaultValue: 4 },
        photoHeight: { type: Sequelize.DataTypes.FLOAT, defaultValue: 6 },
      })

    await queryInterface.createTable(
      'MillefioriInfos',
      {
        productId: { type: Sequelize.DataTypes.INTEGER, primaryKey: true, references: { model: 'Products', key: 'id' }, onDelete: 'CASCADE', allowNull: false },
        shape: { type: Sequelize.DataTypes.ENUM( 'round', 'square' ), defaultValue: 'round' },
        color: { type: Sequelize.DataTypes.STRING, allowNull: false },
        length: { type: Sequelize.DataTypes.FLOAT, defaultValue: 5.0 },
        width: { type: Sequelize.DataTypes.FLOAT, defaultValue: 5.0 },
        height: { type: Sequelize.DataTypes.FLOAT, defaultValue: 5.0 },
      })

    await queryInterface.createTable(
      'MirrorInfos',
      {
        productId: { type: Sequelize.DataTypes.INTEGER, primaryKey: true, references: { model: 'Products', key: 'id' }, onDelete: 'CASCADE', allowNull: false },
        shape: { type: Sequelize.DataTypes.ENUM( 'chapel arch', 'circle', 'gothic arch', 'oval', 'rectangle', 'square', 'vesica piscis', 'other' ), defaultValue: 'circle' },
        width: { type: Sequelize.DataTypes.FLOAT, defaultValue: 6 },
        height: { type: Sequelize.DataTypes.FLOAT, defaultValue: 6 },
        thickness: { type: Sequelize.DataTypes.FLOAT, defaultValue: 0.125 },
        bevel: { type: Sequelize.DataTypes.FLOAT, defaultValue: 0.0 },
      })

    await queryInterface.createTable(
      'SubstrateInfos',
      {
        productId: { type: Sequelize.DataTypes.INTEGER, primaryKey: true, references: { model: 'Products', key: 'id' }, onDelete: 'CASCADE', allowNull: false },
        outsideId: { type: Sequelize.DataTypes.INTEGER, allowNull: false, references: { model: 'Contours', key: 'id' } },
        insideId: { type: Sequelize.DataTypes.INTEGER, allowNull: true, defaultValue: null, references: { model: 'Contours', key: 'id' } },
        rabbetId: { type: Sequelize.DataTypes.INTEGER, allowNull: true, defaultValue: null, references: { model: 'Contours', key: 'id' } },
        width: { type: Sequelize.DataTypes.FLOAT, allowNull: false },
        height: { type: Sequelize.DataTypes.FLOAT, allowNull: false },
        thickness: { type: Sequelize.DataTypes.FLOAT, defaultValue: 0.455 },
        border: { type: Sequelize.DataTypes.FLOAT, defaultValue: 1.0 },
      })

    await queryInterface.createTable(
      'TileInfos',
      {
        productId: { type: Sequelize.DataTypes.INTEGER, primaryKey: true, references: { model: 'Products', key: 'id' }, onDelete: 'CASCADE', allowNull: false },
        color: { type: Sequelize.DataTypes.STRING, allowNull: false },
        width: { type: Sequelize.DataTypes.FLOAT, defaultValue: 20.0 },
        height: { type: Sequelize.DataTypes.FLOAT, defaultValue: 20.0 },
        thickness: { type: Sequelize.DataTypes.FLOAT, defaultValue: 5.5 },
      })

    // Per-supplier pricing for a product (was SupplierMaterials).
    await queryInterface.createTable(
      'SupplierProducts',
      {
        id: { type: Sequelize.DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
        supplierId: { type: Sequelize.DataTypes.INTEGER, allowNull: false, references: { model: 'Suppliers', key: 'id' }, onDelete: 'CASCADE' },
        productId: { type: Sequelize.DataTypes.INTEGER, allowNull: false, references: { model: 'Products', key: 'id' }, onDelete: 'CASCADE' },
        partNumber: { type: Sequelize.DataTypes.STRING, allowNull: false },
        url: { type: Sequelize.DataTypes.STRING },
        cost: { type: Sequelize.DataTypes.FLOAT },
      },
      {
        uniqueKeys: [
          { name: 'supplier_product_unique', fields: ['supplierId', 'productId'] }
        ]
      })

    // Order fulfillment tables - not part of this pass, left structurally
    // as-is (their model files had unrelated bugs fixed, but the schema is
    // unchanged).
    await queryInterface.createTable(
      'Orders',
      {
        id: { type: Sequelize.DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
        createdOn: { type: Sequelize.DataTypes.DATEONLY, defaultValue: Sequelize.DataTypes.NOW },
        completedOn: { type: Sequelize.DataTypes.DATEONLY },
        packedOn: { type: Sequelize.DataTypes.DATEONLY },
        userId: { type: Sequelize.DataTypes.INTEGER, allowNull: true, references: { model: 'Users', key: 'id' } },
      })

    await queryInterface.createTable(
      'OrderProducts',
      {
        orderId: { type: Sequelize.DataTypes.INTEGER, allowNull: false, references: { model: 'Orders', key: 'id' }, onDelete: 'CASCADE' },
        productId: { type: Sequelize.DataTypes.INTEGER, allowNull: false, references: { model: 'Products', key: 'id' }, onDelete: 'RESTRICT' },
        quantity: { type: Sequelize.DataTypes.FLOAT, defaultValue: 1 },
      })

    await queryInterface.createTable(
      'Shipments',
      {
        id: { type: Sequelize.DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
        orderId: { type: Sequelize.DataTypes.INTEGER, allowNull: false, references: { model: 'Orders', key: 'id' }, onDelete: 'CASCADE' },
        carrier: { type: Sequelize.DataTypes.STRING, allowNull: false },
        tracking: { type: Sequelize.DataTypes.STRING, allowNull: false },
        createdOn: { type: Sequelize.DataTypes.DATEONLY, defaultValue: Sequelize.DataTypes.NOW },
      })
  },

  async down( queryInterface )
  {
    await queryInterface.dropTable( 'Shipments' )
    await queryInterface.dropTable( 'OrderProducts' )
    await queryInterface.dropTable( 'Orders' )
    await queryInterface.dropTable( 'SupplierProducts' )
    await queryInterface.dropTable( 'TileInfos' )
    await queryInterface.dropTable( 'SubstrateInfos' )
    await queryInterface.dropTable( 'MirrorInfos' )
    await queryInterface.dropTable( 'MillefioriInfos' )
    await queryInterface.dropTable( 'FrameInfos' )
    await queryInterface.dropTable( 'BeadInfos' )
    await queryInterface.dropTable( 'BillOfMaterials' )
    await queryInterface.dropTable( 'Products' )
    await queryInterface.dropTable( 'Suppliers' )
    await queryInterface.dropTable( 'Contours' )
    await queryInterface.dropTable( 'Users' )
  }
}
