'use strict'

// Adds a nullable prototypeWoodenBaseId to ShapeTypes - replaces the
// Visualizer's New-shape dropdown's old "scan every Wooden Base product
// for the lowest id matching this shape family" heuristic
// (MirrorCalculator.jsx's handleNewShape) with an explicit, shop-chosen
// product per shape family. Set via a "Set as Prototype" button on that
// product's own page (WoodenBaseInfoView.jsx) - there's no dedicated
// ShapeType admin UI, so this is the only place the column is written.
// SET NULL on delete: if the prototype product is ever deleted, the
// shape family just goes back to having no prototype (New falls back to
// generic 6x6/1 dimensions) rather than blocking the delete or cascading.
module.exports = {
  async up( queryInterface, Sequelize ) {
    await queryInterface.addColumn( 'ShapeTypes', 'prototypeWoodenBaseId', {
      type: Sequelize.DataTypes.INTEGER,
      allowNull: true,
      references: { model: 'Products', key: 'id' },
      onDelete: 'SET NULL',
    } )
  },

  async down( queryInterface ) {
    await queryInterface.removeColumn( 'ShapeTypes', 'prototypeWoodenBaseId' )
  },
}
