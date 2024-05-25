module.exports =
{
  async up( queryInterface, Sequelize )
  {
    await queryInterface.createTable(
      'shapes',
      {
        id: { allowNull: false, autoIncrement: true, primaryKey: true, type: Sequelize.INTEGER },
        
        name: { allowNull: false, type: Sequelize.STRING },
        prefix: { allowNull: false, type: Sequelize.STRING },
        isPrimitive: { type: Sequelize.BOOLEAN, defaultValue: false },
    })
  },

  async down( queryInterface, Sequelize )
  {
    await queryInterface.dropTable( 'shapes' )
  }
}
