import { DataTypes } from 'sequelize'
import sequelize from '@/db/sequelize.js'
import Person from '@/db/models/Person'
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
    // scarce. projectedCompletionDate was written by the scheduling
    // engine - see docs/adr/0008, that engine is retired for now, so
    // this (and groutingDayId below) go stale/blank until it's rebuilt.
    promisedDate: { type: DataTypes.DATEONLY },
    promisedDateOrigin: { type: DataTypes.ENUM( 'explicit', 'computed' ) },
    projectedCompletionDate: { type: DataTypes.DATEONLY },

    // Nullable - see CONTEXT.md's Grouting Day entry and docs/adr/0006.
    // No longer auto-assigned (docs/adr/0008) - kept so existing history
    // and the Orders/Production UI columns that read it still work.
    groutingDayId: { type: DataTypes.INTEGER, allowNull: true, references: { model: GroutingDay, key: 'id' } },

    // The recompute-trigger flag for projectedCompletionDate/promisedDate
    // (when computed)/groutingDayId - same lazily-recomputed-cache shape
    // as Product.cogsCostCacheStale. See docs/adr/0005 and docs/adr/0008
    // (nothing recomputes off this any more, but it's harmless to leave
    // set).
    scheduleStale: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true },

    // Declared explicitly (rather than left to belongsTo() below to
    // create implicitly) so it matches the 20260807050000-orders-
    // customer.js migration's column exactly and so query results built
    // from a raw `attributes`/`group` aggregate (e.g. readCustomers()'s
    // orderCount) expose it as a normal instance property - see that
    // migration's fix commit for the full story. Same pattern
    // SupplierProduct.js already uses for supplierId/productId. Points
    // at Person (not a separate Customer table) since the
    // 20260917010000-merge-people.js migration - `as: 'Customer'` keeps
    // every existing `order.Customer` read working unchanged.
    customerId: { type: DataTypes.INTEGER, allowNull: true, references: { model: Person, key: 'id' } },

    // Which internal staff member handled it - was implicitly created by
    // belongsTo(User) below pre-merge; declared explicitly now that both
    // of Order's Person references need distinct `as` aliases (Sequelize
    // requires that once two associations target the same model).
    userId: { type: DataTypes.INTEGER, allowNull: true, references: { model: Person, key: 'id' } },
  },
  {
    timestamps: false,
  })

Person.hasMany( Order, {foreignKey: 'userId', as: 'OrdersAsStaff'} )
Order.belongsTo( Person, {foreignKey: 'userId', as: 'Staff'} )

// Nullable - see the 20260807050000-orders-customer.js migration. Lets
// the Customer detail page (Visualizer/products' sibling under the new
// customer/contact/student master list) show a customer's order history.
Person.hasMany( Order, {foreignKey: 'customerId', as: 'OrdersAsCustomer'} )
Order.belongsTo( Person, {foreignKey: 'customerId', as: 'Customer'} )

GroutingDay.hasMany( Order )
Order.belongsTo( GroutingDay )

export default Order
