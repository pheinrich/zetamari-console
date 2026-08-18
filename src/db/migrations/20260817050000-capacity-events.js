'use strict'

/*
 * Replaces the Capacity-override/AssistantAvailability tables (see the
 * next migration) as the *only* way explicit hours get entered - see
 * CONTEXT.md's Capacity Event entry. A CapacityEvent is a named,
 * colored, date-spanning entry (title/startDate/endDate/notes, plus a
 * `color` the UI renders its calendar bar in) with one CapacityEventPerson
 * row per assigned Owner (`userId`) or Assistant (`assistantName` -
 * freeform, matching AssistantAvailability's old convention: assistants
 * were never real named Users).
 *
 * `capacity` is a JSON array of per-day hours, one entry per day of the
 * event's span, with a "last value repeats" shorthand: an array shorter
 * than the span holds its last value for every remaining day (so `[8]`
 * on a 6-day event means 8 hours every day, `[8,1,5]` means 8 the first
 * day, 1 the second, 5 the third and every day after). See
 * src/libs/pieceScheduling.js's expandCapacityEvents().
 *
 * Exactly one of userId/assistantName is set per row - enforced by the
 * CHECK constraint below, not just application logic, since a stray row
 * with both/neither would silently vanish from both the Owner and
 * Assistant capacity pools.
 *
 * No two CapacityEvents may assign overlapping days to the same person
 * (Owner or Assistant) - see db/actions/capacity.js's upsertCapacityEvent()
 * for that validation; deliberately not enforced at the DB level (would
 * need a range-overlap constraint MySQL doesn't support declaratively).
 */
module.exports = {
  async up( queryInterface, Sequelize )
  {
    await queryInterface.createTable( 'CapacityEvents', {
      id: { type: Sequelize.DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
      title: { type: Sequelize.DataTypes.STRING, allowNull: false },
      startDate: { type: Sequelize.DataTypes.DATEONLY, allowNull: false },
      endDate: { type: Sequelize.DataTypes.DATEONLY, allowNull: false },
      color: { type: Sequelize.DataTypes.STRING, allowNull: false, defaultValue: 'primary' },
      notes: { type: Sequelize.DataTypes.TEXT },
    } )

    await queryInterface.addIndex( 'CapacityEvents', ['startDate', 'endDate'] )

    await queryInterface.createTable( 'CapacityEventPeople', {
      id: { type: Sequelize.DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
      capacityEventId: {
        type: Sequelize.DataTypes.INTEGER,
        allowNull: false,
        references: { model: 'CapacityEvents', key: 'id' },
        onDelete: 'CASCADE',
      },
      userId: { type: Sequelize.DataTypes.INTEGER, allowNull: true, references: { model: 'Users', key: 'id' } },
      assistantName: { type: Sequelize.DataTypes.STRING, allowNull: true },
      capacity: { type: Sequelize.DataTypes.JSON, allowNull: false },
    } )

    await queryInterface.addIndex( 'CapacityEventPeople', ['userId'] )
    await queryInterface.addIndex( 'CapacityEventPeople', ['assistantName'] )

    await queryInterface.sequelize.query(
      'ALTER TABLE `CapacityEventPeople` ADD CONSTRAINT `capacity_event_people_person_xor` ' +
      'CHECK ((`userId` IS NULL) <> (`assistantName` IS NULL))'
    )
  },

  async down( queryInterface )
  {
    await queryInterface.dropTable( 'CapacityEventPeople' )
    await queryInterface.dropTable( 'CapacityEvents' )
  },
}
