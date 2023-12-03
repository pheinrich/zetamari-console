module.exports = {
  async up(queryInterface, Sequelize)
  {
    await queryInterface.createTable( 'stores', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      name: {
        allowNull: false,
        type: Sequelize.STRING
      },
      url: {
        type: Sequelize.STRING,
        validate: {
          isUrl: true,
        },
      },
      email: {
        type: Sequelize.STRING,
        validate: {
          isEmail: true,
        },
      },
      phone: {
        type: Sequelize.STRING
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal( 'CURRENT_TIMESTAMP' ),
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal( 'CURRENT_TIMESTAMP' ),
      }
    });
  },
  async down( queryInterface )
  {
    await queryInterface.dropTable( 'stores' );
  }
};
