module.exports =
{
  async up( queryInterface, Sequelize )
  {
    await queryInterface.createTable(
      'contours',
      {
        id: { allowNull: false, autoIncrement: true, primaryKey: true, type: Sequelize.INTEGER },
        shapeId: { allowNull: false, foreignKey: true, type: Sequelize.INTEGER },

        name: { allowNull: false, type: Sequelize.STRING },
        svgData: { type: Sequelize.TEXT },
    });
  },

  async down( queryInterface, Sequelize )
  {
    await queryInterface.dropTable( 'contours' );
  }
}
