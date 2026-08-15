import { DataTypes } from 'sequelize'
import sequelize from '@/db/sequelize.js'
import Customer from '@/db/models/Customer'
import LiveClass from '@/db/models/LiveClass'

// A single class seat - deliberately NOT called "Student". `customerId`
// is nullable: a seat need not belong to a Customer record at all (e.g.
// a Customer pays for their spouse to attend alongside them - the spouse
// gets their own LiveClassAttendee with no `customerId`, distinct from
// the paying Customer's own row for that same class). A Customer "is a
// student" precisely when they have one or more of these rows pointing
// at them - computed by counting, never a stored flag. See the
// 20260807040000-live-class-attendees.js migration for the full
// rationale, including why firstName/lastName are captured here directly
// (a historical snapshot, independent of the linked Customer's own name
// changing later) and how discountPercent here (locked-in per class)
// differs from Customer.discountPercent (a current, still-adjustable
// standing rate).
const LiveClassAttendee = sequelize.define(
  'LiveClassAttendee',
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },

    // liveClassId/customerId declared explicitly (rather than left to the
    // belongsTo() calls below to create implicitly) so they match the
    // 20260807040000-live-class-attendees.js migration's columns exactly,
    // and so query results built from a raw `attributes`/`group`
    // aggregate (e.g. readCustomers()'s classCount, readLiveClasses()'s
    // attendeeCount) expose them as normal instance properties instead of
    // silently returning undefined - see that fix's commit for the full
    // story. Same pattern SupplierProduct.js already uses for
    // supplierId/productId.
    liveClassId: { type: DataTypes.INTEGER, allowNull: false, references: { model: LiveClass, key: 'id' } },
    customerId: { type: DataTypes.INTEGER, allowNull: true, references: { model: Customer, key: 'id' } },
    firstName: { type: DataTypes.STRING },
    lastName: { type: DataTypes.STRING },

    // Same "historical snapshot, independent of the linked Customer"
    // reasoning as firstName/lastName above - captured directly on the
    // row (even when customerId is set) so this attendance record still
    // shows a contact email on its own, and so a walk-in with no Customer
    // record at all still has one.
    email: { type: DataTypes.STRING },
    status: {
      type: DataTypes.ENUM( 'enrolled', 'waitlisted', 'cancelled', 'completed' ),
      allowNull: false,
      defaultValue: 'enrolled',
    },
    discountPercent: { type: DataTypes.FLOAT },
    upgradeNotes: { type: DataTypes.TEXT },
    notes: { type: DataTypes.TEXT },
    enrolledOn: { type: DataTypes.DATEONLY, allowNull: false, defaultValue: DataTypes.NOW },
  },
  {
    timestamps: false,
  })

LiveClass.hasMany( LiveClassAttendee, {onDelete: 'CASCADE', foreignKey: 'liveClassId'} )
LiveClassAttendee.belongsTo( LiveClass, {foreignKey: 'liveClassId'} )

Customer.hasMany( LiveClassAttendee, {foreignKey: 'customerId'} )
LiveClassAttendee.belongsTo( Customer, {foreignKey: 'customerId'} )

export default LiveClassAttendee
