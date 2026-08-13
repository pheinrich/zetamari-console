import { DataTypes } from 'sequelize'
import sequelize from '@/db/sequelize.js'

// The unified customer/contact/student master list (see the
// 20260807000000-customers.js migration for the full rationale) - one
// record per person/entity Angie sells to or teaches, however many of
// her various channels (website, accounting software, online learning
// platforms, conferences/art shows, Etsy/Faire/Artful Home, mailing
// lists, etc.) they've come through - see CustomerSource.js for how
// those channels get attributed, potentially several at once, to one
// Customer here.
//
// Almost everything is nullable - real records are often wildly
// incomplete (sometimes just an email, sometimes everything but one).
// `email` is deliberately not unique - see the migration.
//
// A Customer "is a student" precisely when they have one or more
// LiveClassAttendee rows (see that model) - not a stored flag here.
// `discountPercent` is their current standing class-discount rate
// (auto-seeded to 20 on their 4th class, independently adjustable from
// then on); apron eligibility (3rd class) is computed live, not stored.
const Customer = sequelize.define(
  'Customer',
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    firstName: { type: DataTypes.STRING },
    lastName: { type: DataTypes.STRING },
    email: { type: DataTypes.STRING },
    phone: { type: DataTypes.STRING },
    street1: { type: DataTypes.STRING },
    street2: { type: DataTypes.STRING },
    city: { type: DataTypes.STRING },
    state: { type: DataTypes.STRING },
    postalCode: { type: DataTypes.STRING },
    country: { type: DataTypes.STRING },
    createdOn: { type: DataTypes.DATEONLY, allowNull: false, defaultValue: DataTypes.NOW },
    notes: { type: DataTypes.TEXT },
    type: { type: DataTypes.ENUM( 'wholesale', 'retail' ), allowNull: true },
    website: { type: DataTypes.STRING },
    acceptsEmailMarketing: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
    discountPercent: { type: DataTypes.FLOAT, allowNull: true },
  },
  {
    timestamps: false,
  })

export default Customer
