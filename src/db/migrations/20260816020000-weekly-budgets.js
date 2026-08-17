'use strict'

/*
 * CONTEXT.md's Weekly Budget: total production hours a specific Owner or
 * Assistant is expected to work in a given calendar week (e.g. 40 hrs
 * for Week 23), evenly divided across that week's business days to
 * produce a default daily Capacity when no day-specific Capacity row
 * exists. `weekStartDate` is that week's Monday, so a week is identified
 * by a plain calendar date rather than a (year, week-number) pair.
 *
 * Falls back to Users.defaultWeeklyHours (see
 * 20260816000000-user-role-and-weekly-hours.js) when no week-specific
 * row exists for a (user, weekStartDate) pair - an unset week is never
 * treated as zero Capacity. Both fallbacks are application logic, not
 * enforced here.
 */
module.exports = {
  async up( queryInterface, Sequelize )
  {
    await queryInterface.createTable( 'WeeklyBudgets', {
      id: { type: Sequelize.DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
      userId: { type: Sequelize.DataTypes.INTEGER, allowNull: false, references: { model: 'Users', key: 'id' } },
      weekStartDate: { type: Sequelize.DataTypes.DATEONLY, allowNull: false },
      hours: { type: Sequelize.DataTypes.FLOAT, allowNull: false },
    } )

    await queryInterface.addIndex( 'WeeklyBudgets', ['userId', 'weekStartDate'], { unique: true } )
  },

  async down( queryInterface )
  {
    await queryInterface.dropTable( 'WeeklyBudgets' )
  },
}
