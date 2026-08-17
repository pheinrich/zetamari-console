'use strict'

/*
 * First step of the manufacturing-scheduling feature (see CONTEXT.md's
 * Capacity/Weekly Budget entries and docs/adr/0004-*): Capacity is
 * tracked per named person, not as a shop-wide Owner/Assistant pool like
 * CostFactor.defaultOwnerSharePercent is - the two owner-operators can
 * have different day-to-day schedules. Rather than invent a new identity
 * table, this reuses Users (already exactly the business's staff logins -
 * see the 20250311033359-users.js seeder) and adds:
 *
 * - `role`: which of CONTEXT.md's Owner/Assistant a user is, for
 *   scheduling purposes. Nullable, since a login with no production role
 *   (were one ever added) shouldn't be forced into one.
 * - `defaultWeeklyHours`: the standing recurring default a Weekly Budget
 *   falls back to when no week-specific value has been set (CONTEXT.md:
 *   "an unset week is never treated as zero Capacity"). Left null for
 *   now rather than guessing a number - a Settings UI to configure it is
 *   a follow-up.
 *
 * Backfills the two existing seeded users (peter@zetamari.com,
 * angie@zetamari.com) to role='owner', matching CONTEXT.md's Owner
 * definition: "one of the business's two owner-operators."
 */
module.exports = {
  async up( queryInterface, Sequelize )
  {
    await queryInterface.addColumn( 'Users', 'role', {
      type: Sequelize.DataTypes.ENUM( 'owner', 'assistant' ),
      allowNull: true,
    } )

    await queryInterface.addColumn( 'Users', 'defaultWeeklyHours', {
      type: Sequelize.DataTypes.FLOAT,
      allowNull: true,
    } )

    await queryInterface.sequelize.query(
      "UPDATE `Users` SET `role` = 'owner' WHERE `email` IN ('peter@zetamari.com', 'angie@zetamari.com')"
    )
  },

  async down( queryInterface )
  {
    await queryInterface.removeColumn( 'Users', 'defaultWeeklyHours' )
    await queryInterface.removeColumn( 'Users', 'role' )
  },
}
