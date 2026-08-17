import { DataTypes } from 'sequelize'
import sequelize from '@/db/sequelize.js'
import User from '@/db/models/User'
import Customer from '@/db/models/Customer'
import GroutingDay from '@/db/models/GroutingDay'

const Order = sequelize.define(
  'Order',
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    createdOn: { type: DataTypes.DATEONLY, defaultValue: DataTypes.NOW },
    completedOn: { type: DataTypes.DATEONLY },
    packedOn: { type: DataTypes.DATEONLY },

    // CONTEXT.md's Promised Date / Projected Completion Date split (see
    // docs/adr/0003-* and the 20260816030000-order-scheduling-dates.js
    // migration). promisedDate is fixed once given; promisedDateOrigin
    // records which of CONTEXT.md's two origins it came from ('explicit'
    // = the customer's own requested date, 'computed' = derived from the
    // backlog), since that drives scheduling priority when Capacity is
    // scarce. projectedCompletionDate is written by the scheduling
    // engine, not entered by staff.
    promisedDate: { type: DataTypes.DATEONLY },
    promisedDateOrigin: { type: DataTypes.ENUM( 'explicit', 'computed' ) },
    projectedCompletionDate: { type: DataTypes.DATEONLY },

    // Nullable - set once this order's "finished"-type Pieces become
    // Grouting-ready (src/libs/pieceScheduling.js's assignGroutingDay());
    // stays null for orders made entirely of 'kit'-type Pieces, which
    // never enter Grouting. See CONTEXT.md's Grouting Day entry and
    // docs/adr/0006.
    groutingDayId: { type: DataTypes.INTEGER, allowNull: true, references: { model: GroutingDay, key: 'id' } },

    // The recompute-trigger flag for projectedCompletionDate/promisedDate
    // (when computed)/groutingDayId - same lazily-recomputed-cache shape
    // as Product.cogsCostCacheStale. See docs/adr/0005 and
    // db/actions/scheduling.js's ensureProjectionsFresh().
    scheduleStale: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true },

    // Declared explicitly (rather than left to belongsTo() below to
    // create implicitly) so it matches the 20260807050000-orders-
    // customer.js migration's column exactly and so query results built
    // from a raw `attributes`/`group` aggregate (e.g. readCustomers()'s
    // orderCount) expose it as a normal instance property - see that
    // migration's fix commit for the full story. Same pattern
    // SupplierProduct.js already uses for supplierId/productId.
    customerId: { type: DataTypes.INTEGER, allowNull: true, references: { model: Customer, key: 'id' } },
  },
  {
    timestamps: false,
  })

User.hasMany( Order )
Order.belongsTo( User )

// Nullable - see the 20260807050000-orders-customer.js migration. Lets
// the Customer detail page (Visualizer/products' sibling under the new
// customer/contact/student master list) show a customer's order history.
Customer.hasMany( Order, {foreignKey: 'customerId'} )
Order.belongsTo( Customer, {foreignKey: 'customerId'} )

GroutingDay.hasMany( Order )
Order.belongsTo( GroutingDay )

export default Order
