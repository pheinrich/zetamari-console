'use strict'

module.exports =
{
  async up( queryInterface, Sequelize )
  {
    return queryInterface.bulkInsert(
      'Users',
      [
        { name: 'Peter Heinrich', email: 'peter@zetamari.com', password: '$2b$10$SYi0UkPdk9NNyUSl.njdwOpZZOuuF2Gi53dZQvjr/AkRRFuil2/oS' },
      ])
  },

  async down( queryInterface, Sequelize )
  {
    return queryInterface.bulkDelete( 'Users', null, {} )
  }
}
