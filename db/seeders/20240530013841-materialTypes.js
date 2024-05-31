module.exports =
{
  async up( queryInterface, Sequelize )
  {
    return queryInterface.bulkInsert( 'materialTypes',
      [
        { id: 1, name: 'Wood' },
        { id: 2, name: 'Mirror Glass' },
        { id: 3, name: 'Bead' },
        { id: 4, name: 'Tile' },
        { id: 5, name: 'Cabochon' },
        { id: 6, name: 'Millefiori' }
      ])
  },

  async down( queryInterface, Sequelize )
  {
    return queryInterface.bulkDelete( 'materialTypes', null, {} )
  }
}
