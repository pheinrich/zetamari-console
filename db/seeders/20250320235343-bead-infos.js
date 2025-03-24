'use strict';

module.exports =
{
  async up( queryInterface, Sequelize )
  {
    return queryInterface.bulkInsert(
      'BeadInfos',
      [
        { materialId: 50, type: 'glass', finish: 'opaque luster', shape: 'round', color: 'white', length: 4, width: 4, height: 4 },
      ])
  },

  async down( queryInterface, Sequelize )
  {
    return queryInterface.bulkDelete( 'BeadInfos', null, {} )
  }
}
