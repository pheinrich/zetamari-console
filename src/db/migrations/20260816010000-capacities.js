'use strict'

/*
 * CONTEXT.md's Capacity: the hours a specific Owner or Assistant (User -
 * see the 20260816000000-user-role-and-weekly-hours.js migration) can
 * work production on a given calendar day - the scheduling input
 * Projected Completion Date is calculated from (docs/adr/0004-*). A
 * single shared pool per person per day, not per Production Phase.
 *
 * Falls back to WeeklyBudget (see the next migration) when no day-
 * specific row exists for a given (user, date) - that fallback is
 * application logic, not enforced here.
 */
module.exports = {
  async up( queryInterface, Sequelize )
  {
    await queryInterface.createTable( 'Capacities', {
      id: { type: Sequelize.DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
      userId: { type: Sequelize.DataTypes.INTEGER, allowNull: false, references: { model: 'Users', key: 'id' } },
      date: { type: Sequelize.DataTypes.DATEONLY, allowNull: false },
      hours: { type: Sequelize.DataTypes.FLOAT, allowNull: false },
    } )

    await queryInterface.addIndex( 'Capacities', ['userId', 'date'], { unique: true } )
  },

  async down( queryInterface )
  {
    await queryInterface.dropTable( 'Capacities' )
  },
}
