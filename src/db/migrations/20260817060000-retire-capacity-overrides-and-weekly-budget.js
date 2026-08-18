'use strict'

/*
 * Retires the fallback chain CapacityEvents replaces (see the previous
 * migration and CONTEXT.md's Capacity/Capacity Event entries): the
 * per-day Capacity override, the per-week WeeklyBudget, the freeform
 * per-day AssistantAvailability list, and Users.defaultWeeklyHours (the
 * last, standing-default tier of the old fallback chain). Capacity is
 * now explicit-only - a day with no CapacityEvent covering a person is
 * simply 0 hours for them, never a computed default.
 *
 * Down migrations recreate the original tables/column (see
 * 20260816000000-user-role-and-weekly-hours.js, 20260816010000-
 * capacities.js, 20260816020000-weekly-budgets.js, and 20260817030000-
 * assistant-availabilities.js for the originals) but obviously can't
 * restore dropped data.
 */
module.exports = {
  async up( queryInterface )
  {
    await queryInterface.dropTable( 'Capacities' )
    await queryInterface.dropTable( 'WeeklyBudgets' )
    await queryInterface.dropTable( 'AssistantAvailabilities' )
    await queryInterface.removeColumn( 'Users', 'defaultWeeklyHours' )
  },

  async down( queryInterface, Sequelize )
  {
    await queryInterface.addColumn( 'Users', 'defaultWeeklyHours', {
      type: Sequelize.DataTypes.FLOAT,
      allowNull: true,
    } )

    await queryInterface.createTable( 'AssistantAvailabilities', {
      id: { type: Sequelize.DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
      date: { type: Sequelize.DataTypes.DATEONLY, allowNull: false },
      name: { type: Sequelize.DataTypes.STRING, allowNull: false },
      hours: { type: Sequelize.DataTypes.FLOAT, allowNull: false },
    } )
    await queryInterface.addIndex( 'AssistantAvailabilities', ['date', 'name'], {unique: true} )

    await queryInterface.createTable( 'WeeklyBudgets', {
      id: { type: Sequelize.DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
      userId: { type: Sequelize.DataTypes.INTEGER, allowNull: false, references: { model: 'Users', key: 'id' } },
      weekStartDate: { type: Sequelize.DataTypes.DATEONLY, allowNull: false },
      hours: { type: Sequelize.DataTypes.FLOAT, allowNull: false },
    } )
    await queryInterface.addIndex( 'WeeklyBudgets', ['userId', 'weekStartDate'], { unique: true } )

    await queryInterface.createTable( 'Capacities', {
      id: { type: Sequelize.DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
      userId: { type: Sequelize.DataTypes.INTEGER, allowNull: false, references: { model: 'Users', key: 'id' } },
      date: { type: Sequelize.DataTypes.DATEONLY, allowNull: false },
      hours: { type: Sequelize.DataTypes.FLOAT, allowNull: false },
    } )
    await queryInterface.addIndex( 'Capacities', ['userId', 'date'], { unique: true } )
  },
}
