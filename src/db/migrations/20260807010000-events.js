'use strict'

/*
 * Events is a first cut at modeling art shows/conferences as real records
 * (2026-08-07 discussion) - Angie sells/teaches at these repeatedly (the
 * same show or conference year over year), so rather than a free-text
 * "source name" per customer, a shared Event record lets multiple
 * customers/sources point at the exact same show. Both kinds share the
 * same shape (name/address/phone/email/website/booth number/dates), so
 * this is one table with a `type` discriminator rather than two separate
 * tables - same "unified table + type enum" approach as Product.type,
 * rather than per-type extension tables, since there's no field variance
 * between the two types to justify one.
 *
 * This is deliberately a light first pass - just enough structure for
 * CustomerSource to link a source to a specific, reusable event record
 * instead of a loose string. Fuller event-management features (booth
 * cost tracking, sales-per-event reporting, etc.) are explicitly future
 * work, per the discussion that prompted this.
 */
module.exports = {
  async up( queryInterface, Sequelize )
  {
    await queryInterface.createTable( 'Events', {
      id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
      type: { type: Sequelize.ENUM( 'art_show', 'conference' ), allowNull: false },
      name: { type: Sequelize.STRING, allowNull: false },
      address: { type: Sequelize.STRING },
      phone: { type: Sequelize.STRING },
      email: { type: Sequelize.STRING },
      website: { type: Sequelize.STRING },
      boothNumber: { type: Sequelize.STRING },
      startDate: { type: Sequelize.DATEONLY },
      endDate: { type: Sequelize.DATEONLY },
    } )
  },

  async down( queryInterface )
  {
    await queryInterface.dropTable( 'Events' )
  },
}
