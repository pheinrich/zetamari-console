module.exports = {
  async up( queryInterface, Sequelize )
  {
    await queryInterface.bulkInsert( 'addresses', [
      {
      }
    ] );
  },

  async down( queryInterface )
  {
    await queryInterface.bulkDelete( 'addresses', null, {} );
  },
};
