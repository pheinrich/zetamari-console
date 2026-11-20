'use strict'

/*
 * ProductAliases: channel SKUs known to mean a console Product - see
 * CONTEXT.md's Product Alias entry. Channels send Zetamari's own SKUs,
 * misspelled or out of date (IndieMe's ZMCi7-... for ZMCi07-...), so an
 * alias is keyed on the SKU alone; `channel` only records where it was
 * first seen. A Channel Order Line's SKU matches a Product's SKU first,
 * then an alias. Deleting the Product deletes its aliases.
 */
module.exports = {
  async up( queryInterface, Sequelize )
  {
    const { DataTypes } = Sequelize

    await queryInterface.createTable( 'ProductAliases', {
      id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
      sku: { type: DataTypes.STRING, allowNull: false, unique: true },
      productId: { type: DataTypes.INTEGER, allowNull: false, references: { model: 'Products', key: 'id' }, onDelete: 'CASCADE' },
      channel: { type: DataTypes.STRING( 32 ) },
      createdAt: { type: DataTypes.DATE, allowNull: false, defaultValue: Sequelize.literal( 'CURRENT_TIMESTAMP' ) },
    } )

    await queryInterface.addIndex( 'ProductAliases', ['productId'] )
  },

  async down( queryInterface )
  {
    await queryInterface.dropTable( 'ProductAliases' )
  },
}
