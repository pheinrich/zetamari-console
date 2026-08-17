'use strict'

/*
 * Two small Order additions needed to actually run the recalculation
 * engine (src/db/actions/scheduling.js), settled in the grill-with-docs
 * follow-up session:
 *
 * `groutingDayId` - nullable FK to the new GroutingDays table
 * (20260817010000-grouting-days.js). Set once an order's "finished"
 * -type Pieces become Grouting-ready; left null for orders made
 * entirely of 'kit'-type Pieces, which never enter Grouting (see
 * CONTEXT.md's Production Phase entry).
 *
 * `scheduleStale` - the recompute-trigger flag for projectedCompletionDate
 * /promisedDate/groutingDayId, same lazily-recomputed-cache shape as
 * Product.cogsCostCacheStale (see docs/adr/0005-projected-completion-
 * date-is-a-lazily-recomputed-cache.md). Defaults true so any order
 * created before this column existed is picked up by the first
 * recompute pass rather than silently treated as already fresh.
 */
module.exports = {
  async up( queryInterface, Sequelize )
  {
    await queryInterface.addColumn( 'Orders', 'groutingDayId', {
      type: Sequelize.DataTypes.INTEGER,
      allowNull: true,
      references: { model: 'GroutingDays', key: 'id' },
    } )

    await queryInterface.addColumn( 'Orders', 'scheduleStale', {
      type: Sequelize.DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    } )
  },

  async down( queryInterface )
  {
    await queryInterface.removeColumn( 'Orders', 'scheduleStale' )
    await queryInterface.removeColumn( 'Orders', 'groutingDayId' )
  },
}
