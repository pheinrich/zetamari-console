'use strict'

/*
 * Class registrations bought through a sales channel (Squarespace sells
 * Angie's class seats as products) become LiveClassAttendees when their
 * Channel Order is accepted, rather than Order lines.
 *
 * ChannelOrderLines.liveClassId: the Live Class a class-seat line is
 * for, matched by the class's date and place on arrival or picked by a
 * person - the class-seat counterpart of productId.
 *
 * LiveClassAttendees.channelOrderLineId: the line a seat was enrolled
 * from, so unaccepting the Channel Order removes exactly those seats.
 */
module.exports = {
  async up( queryInterface, Sequelize )
  {
    await queryInterface.addColumn( 'ChannelOrderLines', 'liveClassId', {
      type: Sequelize.DataTypes.INTEGER,
      allowNull: true,
      references: {model: 'LiveClasses', key: 'id'},
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL',
    } )

    await queryInterface.addColumn( 'LiveClassAttendees', 'channelOrderLineId', {
      type: Sequelize.DataTypes.INTEGER,
      allowNull: true,
      references: {model: 'ChannelOrderLines', key: 'id'},
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL',
    } )
  },

  async down( queryInterface )
  {
    await queryInterface.removeColumn( 'LiveClassAttendees', 'channelOrderLineId' )
    await queryInterface.removeColumn( 'ChannelOrderLines', 'liveClassId' )
  },
}
