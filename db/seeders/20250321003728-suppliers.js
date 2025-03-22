'use strict';

module.exports =
{
  async up( queryInterface, Sequelize )
  {
    return queryInterface.bulkInsert(
      'Suppliers',
      [
        {
          id: 1,
          name: 'Shipwreck Beads',
          email: 'info@shipwreckbeads.com',
          address: '8535 Commerce Pl Dr NE Ste A, Lacey, WA 98516, USA',
          phone: '(800) 950-4232',
          url: 'https://www.shipwreckbeads.com/',
          notes: 'Member#: NL0036297',
        },
      ])
  },

  async down( queryInterface, Sequelize )
  {
    return queryInterface.bulkDelete( 'Suppliers', null, {} )
  }
}
