module.exports =
{
  async up( queryInterface, Sequelize )
  {
    await queryInterface.createTable(
      'contours',
      {
        id: { allowNull: false, autoIncrement: true, primaryKey: true, type: Sequelize.INTEGER },

        name: { type: Sequelize.STRING },
        prefix: { allowNull: false, type: Sequelize.STRING },
        svgData: { type: Sequelize.TEXT },

        createdAt: { allowNull: false, type: Sequelize.DATE },
        updatedAt: { allowNull: false, type: Sequelize.DATE }
    });
  },

  async down( queryInterface, Sequelize )
  {
    await queryInterface.dropTable( 'contours' );
  }
}
