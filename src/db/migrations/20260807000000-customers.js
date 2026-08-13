'use strict'

/*
 * Customers is the new unified source of truth for the customer/contact/
 * student master list (2026-08-07 discussion) - a single record per
 * person/entity Angie sells to or teaches, regardless of which of her
 * many sales/enrollment channels they came through (see the
 * 20260807020000-customer-sources.js migration for how multiple
 * channels get attributed to one Customer).
 *
 * Deliberately almost entirely nullable: real-world records are wildly
 * incomplete depending on their source - sometimes literally just an
 * email (a mailing-list signup), sometimes everything but an email (a
 * cash sale at an art show). Only `id`/`createdOn`/`acceptsEmailMarketing`
 * are non-null, since those are either system-assigned or have an
 * unambiguous default. `email` is intentionally NOT unique - two people
 * can legitimately share an inbox (e.g. a couple), and plenty of records
 * will have none at all - just indexed for lookup/future dedup tooling.
 *
 * `type` (wholesale/retail) is a simple two-value classification, not
 * tied to Product.priceWholesale/priceRetail yet - that integration (does
 * a wholesale Customer automatically see wholesale pricing somewhere) is
 * intentionally left for a later pass.
 *
 * `discountPercent` is the "Student" loyalty mechanic from the 2026-08-07
 * discussion: customers linked to LiveClasses (via LiveClassAttendee -
 * see that migration) get a free apron on their 3rd class (computed live
 * from attendance count, not stored here) and a discount starting their
 * 4th - this column holds that discount as a real, independently
 * editable value (auto-seeded to 20 the first time a 4th-class
 * enrollment is recorded, but adjustable per-customer from then on, per
 * the requirement that the rate itself may need tuning over time). Stays
 * null for every customer who's never taken a class.
 *
 * Order count/class count/apron eligibility are all computed on read
 * (COUNT queries against Orders/LiveClassAttendees), not stored here -
 * same "don't cache what a live query can answer" approach as everywhere
 * else the derived vs. persisted line gets drawn in this app.
 */
module.exports = {
  async up( queryInterface, Sequelize )
  {
    await queryInterface.createTable( 'Customers', {
      id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
      firstName: { type: Sequelize.STRING },
      lastName: { type: Sequelize.STRING },
      email: { type: Sequelize.STRING },
      phone: { type: Sequelize.STRING },
      street1: { type: Sequelize.STRING },
      street2: { type: Sequelize.STRING },
      city: { type: Sequelize.STRING },
      state: { type: Sequelize.STRING },
      postalCode: { type: Sequelize.STRING },
      country: { type: Sequelize.STRING },
      createdOn: { type: Sequelize.DATEONLY, allowNull: false, defaultValue: Sequelize.NOW },
      notes: { type: Sequelize.TEXT },
      type: { type: Sequelize.ENUM( 'wholesale', 'retail' ), allowNull: true },
      website: { type: Sequelize.STRING },
      acceptsEmailMarketing: { type: Sequelize.BOOLEAN, allowNull: false, defaultValue: false },
      discountPercent: { type: Sequelize.FLOAT, allowNull: true },
    } )

    await queryInterface.addIndex( 'Customers', ['email'] )
  },

  async down( queryInterface )
  {
    await queryInterface.dropTable( 'Customers' )
  },
}
