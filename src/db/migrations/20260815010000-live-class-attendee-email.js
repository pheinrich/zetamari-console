'use strict'

/*
 * Adds `email` to LiveClassAttendee, captured directly on the row the
 * same way firstName/lastName already are - a historical snapshot
 * independent of any linked Customer record (which may not exist at all
 * for a walk-in attendee, or may change its own email later without
 * rewriting past class rosters). Backfilled from the attendance
 * spreadsheet's own Email column for existing seeded rows - see
 * 20260814030000-live-class-attendees.js.
 */
module.exports = {
  async up( queryInterface, Sequelize )
  {
    await queryInterface.addColumn( 'LiveClassAttendees', 'email', { type: Sequelize.STRING } )
  },

  async down( queryInterface )
  {
    await queryInterface.removeColumn( 'LiveClassAttendees', 'email' )
  },
}
