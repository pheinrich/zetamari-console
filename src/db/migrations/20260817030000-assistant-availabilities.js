'use strict'

/*
 * A named daily assistant entry - who showed up (or is expected to),
 * and how many hours, for a specific calendar date. Replaces
 * User.role='assistant' as the source of assistant Capacity entirely
 * (see CONTEXT.md's Manufacturing scheduling section - the Capacity
 * redesign that introduced this table): assistants were always
 * described as an occasional, ad hoc call-out pool, never real named
 * Users - this is the lightweight way to see *who* contributed without
 * turning them into full accounts. `name` is freeform (no FK), matching
 * that reality; the UI offers autocomplete against previously-used
 * names but doesn't enforce a fixed roster.
 *
 * These rows feed src/libs/pieceScheduling.js's simulateBacklog() as
 * one summed pool per date - individual entries aren't tracked
 * separately once they reach the engine, only their total for that
 * day. Also replaces GroutingDays.estimatedAssistantHours (see
 * 20260817040000-drop-grouting-day-estimated-hours.js): a Grouting
 * Day's expected assistant hours are just this same sum for its date,
 * not a separately-entered number.
 *
 * Unique on (date, name) - one row per person per day, edited in place
 * (findOrCreate + update) rather than duplicated.
 */
module.exports = {
  async up( queryInterface, Sequelize )
  {
    await queryInterface.createTable( 'AssistantAvailabilities', {
      id: { type: Sequelize.DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
      date: { type: Sequelize.DataTypes.DATEONLY, allowNull: false },
      name: { type: Sequelize.DataTypes.STRING, allowNull: false },
      hours: { type: Sequelize.DataTypes.FLOAT, allowNull: false },
    } )

    await queryInterface.addIndex( 'AssistantAvailabilities', ['date', 'name'], {unique: true} )
  },

  async down( queryInterface )
  {
    await queryInterface.dropTable( 'AssistantAvailabilities' )
  },
}
