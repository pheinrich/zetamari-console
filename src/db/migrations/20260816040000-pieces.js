'use strict'

/*
 * CONTEXT.md's Piece: a single physical unit of a product being
 * produced, corresponding to one unit of quantity on an order line,
 * tracked individually through the pre-Grouting Production Phases.
 *
 * `productId` + `orderId` are direct FKs rather than a link through
 * OrderProduct (the order-line join table): Pieces are fungible within
 * a product and may be reassigned to a different order than the one
 * that originally generated them (CONTEXT.md, "rare, e.g. to salvage a
 * deadline"). Modeling that as just updating `orderId` avoids having to
 * keep OrderProduct.quantity in sync with actual Piece counts on both
 * the source and destination order - OrderProduct.quantity stays the
 * nominal figure entered at order intake, while Piece rows are what
 * scheduling actually operates on.
 *
 * `phase` uses the same six stage names as CostFactor's
 * laborDesign/laborCnc/laborSanding/laborGluing/laborGrouting/
 * laborFinishing keys (see 20260725000000-owner-assistant-labor.js,
 * 20260806000000-fix-glueing-spelling.js). Grouting/Finishing are
 * batched per-order rather than tracked per-piece (CONTEXT.md's
 * Production Phase: "An order cannot enter Grouting until *every* one
 * of its Pieces has cleared its pre-Grouting phases") - that gate is
 * application logic, not enforced by this schema.
 */
module.exports = {
  async up( queryInterface, Sequelize )
  {
    await queryInterface.createTable( 'Pieces', {
      id: { type: Sequelize.DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
      productId: { type: Sequelize.DataTypes.INTEGER, allowNull: false, references: { model: 'Products', key: 'id' } },
      orderId: { type: Sequelize.DataTypes.INTEGER, allowNull: false, references: { model: 'Orders', key: 'id' } },
      phase: {
        type: Sequelize.DataTypes.ENUM( 'Design', 'CNC', 'Sanding', 'Gluing', 'Grouting', 'Finishing' ),
        allowNull: false,
        defaultValue: 'Design',
      },
    } )
  },

  async down( queryInterface )
  {
    await queryInterface.dropTable( 'Pieces' )
  },
}
