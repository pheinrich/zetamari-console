'use strict'

/*
 * CustomerSources is how a Customer's data-supplying channels (website,
 * accounting/marketing software, online learning platform, an art show
 * or conference, a wholesale/consignment retailer) get attributed -
 * deliberately a separate table (one Customer hasMany CustomerSource)
 * rather than a single field or a set of boolean flags on Customer
 * itself, since a real customer is very often sourced from more than one
 * channel at once (e.g. an Etsy buyer who later also signs up for the
 * mailing list) - a single-value field can't represent that.
 *
 * `sourceType` is a curated enum (the channel *category*) - `sourceName`
 * is a free-form field for the specific platform/vendor within that
 * category (e.g. sourceType='website', sourceName='Shopify'; sourceType
 * ='software', sourceName='QuickBooks'). Per the 2026-08-07 discussion:
 * enum for the category (cleaner data, matches how Product.type is
 * modeled - adding a wholly new category later is a small migration, the
 * same tradeoff already accepted there), free text for the specific name
 * (no migration needed every time a new platform/vendor shows up within
 * an existing category).
 *
 * 'online_learning' deliberately avoids the word "student" - that's a
 * distinct concept in this app (a Customer linked to a LiveClass via
 * LiveClassAttendee - see that migration); a Customer who only ever
 * bought a self-guided online course is explicitly NOT a student, so
 * naming this source category "student" would collide with that.
 *
 * art_show/conference sources link to a real Event record (`eventId`)
 * instead of a free-form name, since those recur (the same show/
 * conference year over year) and are being modeled as their own entity
 * (see 20260807010000-events.js) - `sourceName` is left unused for these
 * two source types; the linked Event's own name is the display name.
 *
 * `externalId` is that source system's own identifier for this record,
 * when known (an Etsy customer id, a mailing-list subscriber id) - the
 * "SourceInfo" richness beyond a bare tag, for future
 * import/reconciliation tooling. `notes` is per-source-link context
 * (e.g. "met at booth 42"), distinct from Customer.notes.
 */
module.exports = {
  async up( queryInterface, Sequelize )
  {
    await queryInterface.createTable( 'CustomerSources', {
      id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
      customerId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'Customers', key: 'id' },
        onDelete: 'CASCADE',
      },
      sourceType: {
        type: Sequelize.ENUM( 'website', 'software', 'online_learning', 'art_show', 'conference', 'retail' ),
        allowNull: false,
      },
      sourceName: { type: Sequelize.STRING },
      eventId: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: { model: 'Events', key: 'id' },
        onDelete: 'SET NULL',
      },
      externalId: { type: Sequelize.STRING },
      notes: { type: Sequelize.TEXT },
      firstSeenOn: { type: Sequelize.DATEONLY, allowNull: false, defaultValue: Sequelize.NOW },
    } )

    await queryInterface.addIndex( 'CustomerSources', ['customerId'] )
  },

  async down( queryInterface )
  {
    await queryInterface.dropTable( 'CustomerSources' )
  },
}
