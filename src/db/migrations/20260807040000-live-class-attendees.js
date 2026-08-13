'use strict'

/*
 * LiveClassAttendee, not "Student" - per the 2026-08-07 discussion, a
 * class seat need not belong to a Customer record at all (e.g. a
 * Customer pays for their spouse to attend alongside them; the spouse
 * gets their own LiveClassAttendee row with `customerId` left null,
 * distinct from the paying Customer's own row for the same class). A
 * Customer "is a student" precisely when they have one or more
 * LiveClassAttendee rows pointing at them - that's computed by counting
 * this table, not a stored flag anywhere.
 *
 * `firstName`/`lastName` are captured directly on this row even when
 * `customerId` is set - a historical snapshot of the attendee's name as
 * of that class, so editing the linked Customer's name later doesn't
 * retroactively rewrite past class rosters.
 *
 * `discountPercent` here is what was actually applied *to this specific
 * class* - a locked-in historical record, distinct from
 * Customer.discountPercent (that customer's current standing rate, which
 * can keep changing after the fact without altering what past classes
 * charged). `upgradeNotes` captures paid add-ons/upgrades for this
 * attendance; `notes` is the separate general field for special
 * requests/circumstances, kept apart from upgrades per the discussion.
 */
module.exports = {
  async up( queryInterface, Sequelize )
  {
    await queryInterface.createTable( 'LiveClassAttendees', {
      id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
      liveClassId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'LiveClasses', key: 'id' },
        onDelete: 'CASCADE',
      },
      customerId: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: { model: 'Customers', key: 'id' },
        onDelete: 'SET NULL',
      },
      firstName: { type: Sequelize.STRING },
      lastName: { type: Sequelize.STRING },
      status: {
        type: Sequelize.ENUM( 'enrolled', 'waitlisted', 'cancelled', 'completed' ),
        allowNull: false,
        defaultValue: 'enrolled',
      },
      discountPercent: { type: Sequelize.FLOAT },
      upgradeNotes: { type: Sequelize.TEXT },
      notes: { type: Sequelize.TEXT },
      enrolledOn: { type: Sequelize.DATEONLY, allowNull: false, defaultValue: Sequelize.NOW },
    } )

    await queryInterface.addIndex( 'LiveClassAttendees', ['liveClassId'] )
    await queryInterface.addIndex( 'LiveClassAttendees', ['customerId'] )
  },

  async down( queryInterface )
  {
    await queryInterface.dropTable( 'LiveClassAttendees' )
  },
}
