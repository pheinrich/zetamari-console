'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up( queryInterface, Sequelize )
  {
    return queryInterface.bulkInsert('contourTypes',
      [
        { name: 'Chapel Arch', prefix: 'Ca', createdAt: new Date(), updatedAt: new Date() },
        { name: 'Circle', prefix: 'Ci', createdAt: new Date(), updatedAt: new Date() },
        { name: 'Gothic Arch', prefix: 'Ga', createdAt: new Date(), updatedAt: new Date() },
        { name: 'Oval', prefix: 'Ov', createdAt: new Date(), updatedAt: new Date() },
        { name: 'Rectangle', prefix: 'Re', createdAt: new Date(), updatedAt: new Date() },
        { name: 'Square', prefix: 'Sq', createdAt: new Date(), updatedAt: new Date() },
        { name: 'Vesica Piscis', prefix: 'Vp', createdAt: new Date(), updatedAt: new Date() },
        { name: 'Custom', prefix: 'Uk', createdAt: new Date(), updatedAt: new Date() }
      ])
  },

  async down( queryInterface, Sequelize )
  {
    return queryInterface.bulkDelete( 'contourTypes', null, {} )
  }
}
