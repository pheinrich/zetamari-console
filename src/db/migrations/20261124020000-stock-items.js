'use strict'

/*
 * StockItems: how much of a Product is on hand (Inventory > Stock) - see
 * CONTEXT.md's Stock entry. One row per tracked Product; untracked
 * Products have none. The quantity is in the Product's own units, so
 * DECIMAL for fractional supplies. Set by hand for now; picking for a
 * Shipment is where it would later be drawn down.
 */
module.exports = {
  async up( queryInterface, Sequelize )
  {
    const { DataTypes } = Sequelize

    // The app's sequelize.sync() creates this same table if the new code
    // runs first - keep it (and any stock already entered) when it has.
    if( await queryInterface.describeTable( 'StockItems' ).then( () => true, () => false ) )
      return

    await queryInterface.createTable( 'StockItems', {
      id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
      productId: { type: DataTypes.INTEGER, allowNull: false, unique: true, references: { model: 'Products', key: 'id' }, onDelete: 'CASCADE' },
      quantity: { type: DataTypes.DECIMAL( 12, 3 ), allowNull: false, defaultValue: 0 },
      updatedAt: { type: DataTypes.DATE, allowNull: false, defaultValue: Sequelize.literal( 'CURRENT_TIMESTAMP' ) },
    } )
  },

  async down( queryInterface )
  {
    await queryInterface.dropTable( 'StockItems' )
  },
}
