'use strict'

// A Live Class's SKU - "CSMirror-20270227": CS, the class, then its
// start date - as the class is sold (e.g. on Squarespace).
module.exports = {
  async up( queryInterface, Sequelize )
  {
    await queryInterface.addColumn( 'LiveClasses', 'sku', {type: Sequelize.STRING, allowNull: true} )
  },

  async down( queryInterface )
  {
    await queryInterface.removeColumn( 'LiveClasses', 'sku' )
  },
}
