'use strict';

/*
 * Adds Images/ProductImages (S3-hosted, referenced by URL, shareable across
 * products) and a Product.status field (visible/hidden for now, more
 * values later). Unlike the earlier recast, this is a NEW migration rather
 * than an edit to 20250311024228-initdb.js - that file has already run
 * against real databases (its filename is recorded in SequelizeMeta), so
 * editing it in place wouldn't actually apply the change via `db:migrate`.
 */
module.exports =
{
  async up( queryInterface, Sequelize )
  {
    await queryInterface.addColumn(
      'Products',
      'status',
      {
        // Only 'visible'/'hidden' for now (per Angie); more values (e.g.
        // 'discontinued') can be added later with an ENUM-altering migration.
        type: Sequelize.DataTypes.ENUM( 'visible', 'hidden' ),
        allowNull: false,
        defaultValue: 'visible',
      })

    // A shared pool of S3-hosted images, referenced by URL. Not owned by
    // any single product - the same image row can be attached to several
    // products via ProductImages, so deleting a product (or unlinking an
    // image from it) never deletes the underlying Image row itself.
    await queryInterface.createTable(
      'Images',
      {
        id: { type: Sequelize.DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
        url: { type: Sequelize.DataTypes.STRING, allowNull: false, unique: true },
        altText: { type: Sequelize.DataTypes.STRING },
      })

    await queryInterface.createTable(
      'ProductImages',
      {
        id: { type: Sequelize.DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
        productId: { type: Sequelize.DataTypes.INTEGER, allowNull: false, references: { model: 'Products', key: 'id' }, onDelete: 'CASCADE' },
        imageId: { type: Sequelize.DataTypes.INTEGER, allowNull: false, references: { model: 'Images', key: 'id' }, onDelete: 'RESTRICT' },
        // Lowest sortOrder is the product's primary/thumbnail image.
        sortOrder: { type: Sequelize.DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
      },
      {
        uniqueKeys: [
          { name: 'product_image_unique', fields: ['productId', 'imageId'] }
        ]
      })
  },

  async down( queryInterface )
  {
    await queryInterface.dropTable( 'ProductImages' )
    await queryInterface.dropTable( 'Images' )
    await queryInterface.removeColumn( 'Products', 'status' )
    // Postgres would also need to drop the enum type here; MySQL's ENUM is
    // inline on the column so removeColumn is sufficient.
  }
}
