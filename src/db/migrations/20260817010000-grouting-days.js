'use strict'

/*
 * CONTEXT.md's Grouting Day: the periodic shop event when Grouting and
 * Finishing work happens for "finished" (non-kit) orders, run by a
 * temporary crew beyond the two Owners - a call goes out to a pool of
 * occasional volunteer Assistants whose turnout is unknown until they
 * respond. Volunteers aren't tracked as named Users/Capacity rows (see
 * docs/adr/0006-grouting-day-is-a-sticky-first-come-first-served-
 * reservation.md) - instead this table carries one row per calendar
 * date a Grouting Day happens on, with a manually-entered, adjustable
 * estimate of available volunteer hours. Owners' own extended hours on
 * that date reuse the existing per-day Capacity override; no column for
 * that here.
 *
 * `origin` mirrors Promised Date's Explicit/Computed split (ADR-0006):
 * 'computed' means the scheduling engine's own suggestion
 * (src/libs/pieceScheduling.js's assignGroutingDay()), 'explicit' means
 * staff have manually committed to the date, which then stops moving
 * even if the engine would otherwise reassign it.
 *
 * `date` is unique - one Grouting Day per calendar date, shared by
 * however many Orders' Pieces are ready for it (see
 * 20260817020000-order-scheduling-followups.js's Orders.groutingDayId).
 */
module.exports = {
  async up( queryInterface, Sequelize )
  {
    await queryInterface.createTable( 'GroutingDays', {
      id: { type: Sequelize.DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
      date: { type: Sequelize.DataTypes.DATEONLY, allowNull: false, unique: true },
      origin: { type: Sequelize.DataTypes.ENUM( 'explicit', 'computed' ), allowNull: false, defaultValue: 'computed' },
      estimatedAssistantHours: { type: Sequelize.DataTypes.FLOAT },
    } )
  },

  async down( queryInterface )
  {
    await queryInterface.dropTable( 'GroutingDays' )
  },
}
