'use strict'

/*
 * LiveClasses tracks Angie's live-taught classes (2026-08-07 discussion)
 * - in-person (her studio, a partner venue, a conference booth) or
 * online (Zoom) - as opposed to her self-guided online learning
 * products, which are just Products, not modeled here at all. Enrollment
 * is tracked separately, via LiveClassAttendee (see the next migration) -
 * this table is just the class itself: what it is, where/when it runs,
 * what it costs.
 *
 * `locationType` distinguishes in-person from online; `locationName`/
 * `locationAddress` are free text (e.g. "Zetamari Studio" / "Bead &
 * Button Conference" / "Zoom") rather than a link to the Events table -
 * Events (art shows/conferences) are about tracking Angie's own presence
 * at a recurring show for customer-sourcing purposes, a different
 * concept from "which specific class ran where," even though a class
 * could incidentally happen to run at the same conference an Event
 * record also tracks. They're allowed to overlap in the data without
 * being formally linked, at least for this first pass.
 */
module.exports = {
  async up( queryInterface, Sequelize )
  {
    await queryInterface.createTable( 'LiveClasses', {
      id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
      name: { type: Sequelize.STRING, allowNull: false },
      locationType: { type: Sequelize.ENUM( 'in_person', 'online' ), allowNull: false, defaultValue: 'in_person' },
      locationName: { type: Sequelize.STRING },
      locationAddress: { type: Sequelize.STRING },
      startDate: { type: Sequelize.DATEONLY, allowNull: false },
      endDate: { type: Sequelize.DATEONLY },
      cost: { type: Sequelize.FLOAT },
      notes: { type: Sequelize.TEXT },
    } )
  },

  async down( queryInterface )
  {
    await queryInterface.dropTable( 'LiveClasses' )
  },
}
