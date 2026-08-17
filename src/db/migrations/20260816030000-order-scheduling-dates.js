'use strict'

/*
 * CONTEXT.md's Promised Date / Projected Completion Date split
 * (docs/adr/0003-*): the customer-facing commitment, fixed once given,
 * kept separate from a continuously recalculated estimate, so the
 * console can flag "at risk" orders before the ship date arrives rather
 * than only after.
 *
 * `promisedDateOrigin` tracks which of CONTEXT.md's two Promised Date
 * origins applies - 'explicit' (the customer's own requested date) or
 * 'computed' (derived from the backlog) - since that origin decides
 * scheduling priority when Capacity is scarce. Null until a Promised
 * Date has actually been given.
 *
 * `projectedCompletionDate` is nullable and expected to be written by
 * the (not-yet-built) scheduling engine, not entered by staff.
 */
module.exports = {
  async up( queryInterface, Sequelize )
  {
    await queryInterface.addColumn( 'Orders', 'promisedDate', {
      type: Sequelize.DataTypes.DATEONLY,
      allowNull: true,
    } )

    await queryInterface.addColumn( 'Orders', 'promisedDateOrigin', {
      type: Sequelize.DataTypes.ENUM( 'explicit', 'computed' ),
      allowNull: true,
    } )

    await queryInterface.addColumn( 'Orders', 'projectedCompletionDate', {
      type: Sequelize.DataTypes.DATEONLY,
      allowNull: true,
    } )
  },

  async down( queryInterface )
  {
    await queryInterface.removeColumn( 'Orders', 'projectedCompletionDate' )
    await queryInterface.removeColumn( 'Orders', 'promisedDateOrigin' )
    await queryInterface.removeColumn( 'Orders', 'promisedDate' )
  },
}
