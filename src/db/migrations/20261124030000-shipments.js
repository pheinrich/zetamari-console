'use strict'

/*
 * Shipments - see CONTEXT.md's Shipment entry and docs/adr/0009.
 *
 * Shipments (Order has many, since 2025) were a stub: a required carrier
 * and tracking number. They become an Order's physical hand-offs:
 *   transportMode   'carrier pickup' | 'drop-off' | 'will call' | 'delivery'
 *   carrier, service, tracking   now optional - only carrier modes use them
 *   shipTo (JSON, as ChannelOrders.shipTo), notes
 *   pickedAt, packedAt, documentedAt, handedOffAt   when each step was done;
 *                   the current step is the first one not yet done
 * ShipmentLines: what a Shipment carries, {productId, quantity} each.
 * Pieces.shipmentId: the built Pieces a Shipment claimed (no longer
 * fungible once claimed); Pieces.phase gains 'Ready', after Finishing.
 *
 * Orders.packedOn/completedOn are now derived from Shipments, so each
 * Order that had either becomes one Shipment carrying all its lines
 * (with its existing Shipment, if it had one), dated from them, its
 * Pieces claimed and Ready. Then the columns go.
 */
const PHASES = ['Design', 'CNC', 'Sanding', 'Assembly', 'Gluing', 'Grouting', 'Glass', 'Finishing']

const phaseColumn = (DataTypes, phases) => ({type: DataTypes.ENUM( ...phases ), allowNull: false, defaultValue: 'Design'})

module.exports = {
  async up( queryInterface, Sequelize )
  {
    const { DataTypes } = Sequelize
    const query = (sql, replacements) => queryInterface.sequelize.query( sql, {replacements} )

    await queryInterface.changeColumn( 'Shipments', 'carrier', {type: DataTypes.STRING, allowNull: true} )
    await queryInterface.changeColumn( 'Shipments', 'tracking', {type: DataTypes.STRING, allowNull: true} )
    await queryInterface.addColumn( 'Shipments', 'service', {type: DataTypes.STRING, allowNull: true, after: 'carrier'} )
    await queryInterface.addColumn( 'Shipments', 'transportMode', {type: DataTypes.ENUM( 'carrier pickup', 'drop-off', 'will call', 'delivery' ), allowNull: true, after: 'orderId'} )
    await queryInterface.addColumn( 'Shipments', 'shipTo', {type: DataTypes.JSON, allowNull: true} )
    await queryInterface.addColumn( 'Shipments', 'notes', {type: DataTypes.TEXT, allowNull: true} )

    for( const column of ['pickedAt', 'packedAt', 'documentedAt', 'handedOffAt'] )
      await queryInterface.addColumn( 'Shipments', column, {type: DataTypes.DATE, allowNull: true} )

    // The app's sequelize.sync() creates this table if the new code runs
    // first - replace that (empty) one with this, which has the cascades.
    await queryInterface.dropTable( 'ShipmentLines', {} ).catch( () => {} )

    await queryInterface.createTable( 'ShipmentLines', {
      id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
      shipmentId: { type: DataTypes.INTEGER, allowNull: false, references: { model: 'Shipments', key: 'id' }, onDelete: 'CASCADE' },
      productId: { type: DataTypes.INTEGER, allowNull: false, references: { model: 'Products', key: 'id' }, onDelete: 'CASCADE' },
      quantity: { type: DataTypes.DECIMAL( 12, 3 ), allowNull: false },
    } )

    await queryInterface.addIndex( 'ShipmentLines', ['shipmentId', 'productId'], {unique: true} )

    await queryInterface.changeColumn( 'Pieces', 'phase', phaseColumn( DataTypes, [...PHASES, 'Ready'] ) )
    await queryInterface.addColumn( 'Pieces', 'shipmentId', {type: DataTypes.INTEGER, allowNull: true, references: { model: 'Shipments', key: 'id' }, onDelete: 'SET NULL'} )

    // Orders already packed or shipped: one Shipment each, from their dates
    const [orders] = await query( 'SELECT id, packedOn, completedOn FROM Orders WHERE packedOn IS NOT NULL OR completedOn IS NOT NULL' )

    for( const order of orders )
    {
      const packed = order.packedOn ?? order.completedOn
      const [[existing]] = await query( 'SELECT id FROM Shipments WHERE orderId = ? ORDER BY id LIMIT 1', [order.id] )
      let shipmentId = existing?.id

      // A raw INSERT's result is [insertId, affectedRows] on MySQL
      if( !shipmentId )
        [shipmentId] = await query( 'INSERT INTO Shipments (orderId, createdOn) VALUES (?, ?)', [order.id, packed] )

      await query(
        'UPDATE Shipments SET pickedAt = ?, packedAt = ?, documentedAt = ?, handedOffAt = ? WHERE id = ?',
        [packed, packed, order.completedOn, order.completedOn, shipmentId]
      )

      await query(
        'INSERT INTO ShipmentLines (shipmentId, productId, quantity) SELECT ?, productId, SUM(quantity) FROM OrderProducts WHERE orderId = ? GROUP BY productId',
        [shipmentId, order.id]
      )

      await query( "UPDATE Pieces SET shipmentId = ?, phase = 'Ready' WHERE orderId = ?", [shipmentId, order.id] )
    }

    await queryInterface.removeColumn( 'Orders', 'packedOn' )
    await queryInterface.removeColumn( 'Orders', 'completedOn' )
  },

  async down( queryInterface, Sequelize )
  {
    const { DataTypes } = Sequelize
    const query = sql => queryInterface.sequelize.query( sql )

    await queryInterface.addColumn( 'Orders', 'completedOn', {type: DataTypes.DATEONLY, allowNull: true, after: 'createdOn'} )
    await queryInterface.addColumn( 'Orders', 'packedOn', {type: DataTypes.DATEONLY, allowNull: true, after: 'completedOn'} )

    // Lossy: an Order counts as packed/shipped when any Shipment of it was
    await query( 'UPDATE Orders o SET packedOn = (SELECT DATE(MAX(s.packedAt)) FROM Shipments s WHERE s.orderId = o.id)' )
    await query( 'UPDATE Orders o SET completedOn = (SELECT DATE(MAX(s.handedOffAt)) FROM Shipments s WHERE s.orderId = o.id)' )

    for( const ref of await queryInterface.getForeignKeyReferencesForTable( 'Pieces' ) )
      if( ref.columnName === 'shipmentId' )
        await queryInterface.removeConstraint( 'Pieces', ref.constraintName )

    await queryInterface.removeColumn( 'Pieces', 'shipmentId' )
    await query( "UPDATE Pieces SET phase = 'Finishing' WHERE phase = 'Ready'" )
    await queryInterface.changeColumn( 'Pieces', 'phase', phaseColumn( DataTypes, PHASES ) )

    await queryInterface.dropTable( 'ShipmentLines' )

    for( const column of ['handedOffAt', 'documentedAt', 'packedAt', 'pickedAt', 'notes', 'shipTo', 'transportMode', 'service'] )
      await queryInterface.removeColumn( 'Shipments', column )

    // carrier/tracking stay nullable: rows made since can't be forced back
  },
}
