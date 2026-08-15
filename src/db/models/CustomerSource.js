import { DataTypes } from 'sequelize'
import sequelize from '@/db/sequelize.js'
import Customer from '@/db/models/Customer'
import Event from '@/db/models/Event'

// One row per channel a Customer has been sourced from - a Customer
// hasMany of these, so a customer sourced from both Etsy and the mailing
// list gets two rows, rather than trying to cram multiple channels into
// one field. See the 20260807020000-customer-sources.js migration for
// the full rationale, including why `sourceType` is an enum (the
// channel's category) paired with a free-form `sourceName` (the specific
// platform within that category), and why art_show/conference sources
// link to a real Event record instead of a name.
const CustomerSource = sequelize.define(
  'CustomerSource',
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },

    // customerId/eventId declared explicitly (rather than left to the
    // belongsTo() calls below to create implicitly) so they match the
    // 20260807020000-customer-sources.js migration's columns exactly and
    // expose correctly on any future raw `attributes`/`group` aggregate
    // query - see Order.js/LiveClassAttendee.js for the bug this pattern
    // fixes. Same approach SupplierProduct.js already uses for
    // supplierId/productId.
    customerId: { type: DataTypes.INTEGER, allowNull: false, references: { model: Customer, key: 'id' } },
    sourceType: {
      type: DataTypes.ENUM( 'website', 'software', 'online_learning', 'art_show', 'conference', 'retail' ),
      allowNull: false,
    },
    sourceName: { type: DataTypes.STRING },
    eventId: { type: DataTypes.INTEGER, allowNull: true, references: { model: Event, key: 'id' } },
    externalId: { type: DataTypes.STRING },
    notes: { type: DataTypes.TEXT },
    firstSeenOn: { type: DataTypes.DATEONLY, allowNull: false, defaultValue: DataTypes.NOW },
  },
  {
    timestamps: false,
  })

Customer.hasMany( CustomerSource, {onDelete: 'CASCADE', foreignKey: 'customerId'} )
CustomerSource.belongsTo( Customer, {foreignKey: 'customerId'} )

Event.hasMany( CustomerSource, {foreignKey: 'eventId'} )
CustomerSource.belongsTo( Event, {foreignKey: 'eventId'} )

export default CustomerSource
