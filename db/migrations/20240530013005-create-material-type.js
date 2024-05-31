module.exports =
{
  async up( queryInterface, Sequelize )
  {
    await queryInterface.createTable(
      'materialTypes',
      {
        id: { allowNull: false, autoIncrement: true, primaryKey: true, type: Sequelize.INTEGER },
        name: { type: Sequelize.STRING },
      })
  },

  async down( queryInterface, Sequelize )
  {
    await queryInterface.dropTable( 'materialTypes' )
  }
}
