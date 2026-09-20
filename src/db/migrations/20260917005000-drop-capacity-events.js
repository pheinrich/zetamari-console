'use strict'

/*
 * Retires the Capacity/Grouting-Day auto-assignment engine - see
 * docs/adr/0008-capacity-planning-removed-pending-redesign.md. Drops the
 * CapacityEvent/CapacityEventPerson tables (the only source of explicit
 * Capacity, per the now-superseded docs/adr/0007) and blanks out the two
 * Orders columns that engine used to write. GroutingDays and Orders.
 * promisedDate/promisedDateOrigin/scheduleStale are left alone - the
 * Orders/Production UI keeps showing those columns, they just go
 * blank/stale until a future recompute engine is built.
 *
 * Runs before 20260917010000-merge-people.js on purpose:
 * CapacityEventPeople.userId FK's references Users, which that
 * migration drops - the FK has to be gone first.
 */
module.exports = {
  async up( queryInterface )
  {
    await queryInterface.dropTable( 'CapacityEventPeople' )
    await queryInterface.dropTable( 'CapacityEvents' )

    await queryInterface.bulkUpdate( 'Orders', {projectedCompletionDate: null, groutingDayId: null}, {} )
  },

  async down( queryInterface, Sequelize )
  {
    // Best-effort - the CapacityEvent/CapacityEventPerson data itself
    // isn't recoverable, this just restores the tables' shape.
    await queryInterface.createTable( 'CapacityEvents', {
      id: { type: Sequelize.DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
      title: { type: Sequelize.DataTypes.STRING, allowNull: false },
      startDate: { type: Sequelize.DataTypes.DATEONLY, allowNull: false },
      endDate: { type: Sequelize.DataTypes.DATEONLY, allowNull: false },
      color: { type: Sequelize.DataTypes.STRING, allowNull: false, defaultValue: 'primary' },
      notes: { type: Sequelize.DataTypes.TEXT },
    } )

    await queryInterface.createTable( 'CapacityEventPeople', {
      id: { type: Sequelize.DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
      capacityEventId: {
        type: Sequelize.DataTypes.INTEGER,
        allowNull: false,
        references: { model: 'CapacityEvents', key: 'id' },
        onDelete: 'CASCADE',
      },
      userId: { type: Sequelize.DataTypes.INTEGER, allowNull: true },
      assistantName: { type: Sequelize.DataTypes.STRING, allowNull: true },
      capacity: { type: Sequelize.DataTypes.JSON, allowNull: false },
    } )
  },
}
