module.exports =
{
  async up( queryInterface, Sequelize )
  {
    await queryInterface.createTable(
      'substrates',
      {
        id: { allowNull: false, autoIncrement: true, primaryKey: true, type: Sequelize.INTEGER },
        outsideId: { allowNull: false, foreignKey: true, type: Sequelize.INTEGER },
        insideId: { foreignKey: true, type: Sequelize.INTEGER },
        rabbetId: { foreignKey: true, type: Sequelize.INTEGER },

        name: { type: Sequelize.STRING },
        sku: { type: Sequelize.STRING },
        width: { type: Sequelize.FLOAT },
        height: { type: Sequelize.FLOAT },
        border: { type: Sequelize.FLOAT },
        isStock: { type: Sequelize.BOOLEAN },
        isPreset: { type: Sequelize.BOOLEAN },

        createdAt: { allowNull: false, type: Sequelize.DATE },
        updatedAt: { allowNull: false, type: Sequelize.DATE }
      })
  },
  
  async down( queryInterface, Sequelize )
  {
    await queryInterface.dropTable( 'substrates' )
  }
}
