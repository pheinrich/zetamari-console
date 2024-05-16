module.exports =
{
  async up( queryInterface, Sequelize )
  {
    return queryInterface.bulkInsert( 'substrates',
      [
        {},
      ])
  },

  async down( queryInterface, Sequelize )
  {
    return queryInterface.bulkDelete( 'substrates', null, {} )
  }
}
