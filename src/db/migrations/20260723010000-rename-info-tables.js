'use strict'

/*
 * Renames the three Info tables to match their Product.type's new name
 * (see 20260723000000-rename-product-types.js) - SubstrateInfos ->
 * WoodenBaseInfos, MirrorInfos -> MirrorGlassInfos, FrameInfos ->
 * PictureFrameInfos. Pure table renames, no column changes.
 *
 * Also creates BirdhouseBaseInfos - 'birdhouse'/'birdhouse base' never
 * had a type-specific Info table before now (confirmed: no BirdhouseInfo
 * model existed), so this is new rather than a rename. Same shape as
 * FrameInfo (a productId-keyed 1:1 extension table, no Contour/shape
 * reference - birdhouses are boxes, not traced outlines).
 */
module.exports = {
  async up( queryInterface, Sequelize )
  {
    await queryInterface.renameTable( 'SubstrateInfos', 'WoodenBaseInfos' )
    await queryInterface.renameTable( 'MirrorInfos', 'MirrorGlassInfos' )
    await queryInterface.renameTable( 'FrameInfos', 'PictureFrameInfos' )

    await queryInterface.createTable( 'BirdhouseBaseInfos', {
      productId: {
        type: Sequelize.DataTypes.INTEGER,
        primaryKey: true,
        references: { model: 'Products', key: 'id' },
        onDelete: 'CASCADE',
      },
      width: { type: Sequelize.DataTypes.FLOAT, allowNull: true },
      height: { type: Sequelize.DataTypes.FLOAT, allowNull: true },
      depth: { type: Sequelize.DataTypes.FLOAT, allowNull: true },
    } )
  },

  async down( queryInterface )
  {
    await queryInterface.dropTable( 'BirdhouseBaseInfos' )

    await queryInterface.renameTable( 'PictureFrameInfos', 'FrameInfos' )
    await queryInterface.renameTable( 'MirrorGlassInfos', 'MirrorInfos' )
    await queryInterface.renameTable( 'WoodenBaseInfos', 'SubstrateInfos' )
  },
}
