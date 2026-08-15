'use strict'

/*
 * Two Customer adjustments that came up once real data (the customer
 * master list import) was actually looked at:
 *
 * 1. `company` - a business/organization name, distinct from
 *    firstName/lastName. Many wholesale-type records are really "a
 *    contact person at a business" (e.g. Mike at Artique), and until now
 *    there was nowhere to put the business name itself except stuffed
 *    into `notes` - this gives it a real column, and lets the customers
 *    seeder move that data out of notes and into a proper field.
 *
 * 2. `acceptsEmailMarketing` goes from a NOT NULL boolean (default
 *    false) to a nullable one. The source spreadsheet's "Email Mktg"
 *    column was blank for well over half of all records - genuinely
 *    unknown, not an active opt-out - and the original NOT NULL/default
 *    false design was silently recording all of those as "opted out",
 *    which isn't true. NULL now means "unknown"; true/false remain
 *    explicit opt-in/opt-out.
 */
module.exports = {
  async up( queryInterface, Sequelize )
  {
    await queryInterface.addColumn( 'Customers', 'company', { type: Sequelize.STRING } )

    await queryInterface.changeColumn( 'Customers', 'acceptsEmailMarketing', {
      type: Sequelize.BOOLEAN,
      allowNull: true,
    } )
  },

  async down( queryInterface, Sequelize )
  {
    // Collapse "unknown" back to false before re-tightening the
    // constraint, since NOT NULL can't otherwise be restored - matches
    // the column's original default.
    await queryInterface.sequelize.query( 'UPDATE `Customers` SET `acceptsEmailMarketing` = false WHERE `acceptsEmailMarketing` IS NULL' )

    await queryInterface.changeColumn( 'Customers', 'acceptsEmailMarketing', {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    } )

    await queryInterface.removeColumn( 'Customers', 'company' )
  },
}
