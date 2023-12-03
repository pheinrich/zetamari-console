'use strict';
module.exports = {
  async up(queryInterface, Sequelize)
  {
    await queryInterface.createTable( 'addresses', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      name: {
        type: Sequelize.STRING
      },
      company: {
        type: Sequelize.STRING
      },
      country: {
        allowNull: false,
        type: Sequelize.STRING
      },
      line1: {
        allowNull: false,
        type: Sequelize.STRING
      },
      line2: {
        type: Sequelize.STRING
      },
      line3: {
        type: Sequelize.STRING
      },
      city: {
        allowNull: false,
        type: Sequelize.STRING
      },
      state: {
        type: Sequelize.STRING
      },
      postal_code: {
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
    await queryInterface.dropTable( 'addresses' );
  }
};
