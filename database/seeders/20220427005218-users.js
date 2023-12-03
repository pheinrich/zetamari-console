module.exports = {
  async up( queryInterface, Sequelize )
  {
    await queryInterface.bulkInsert( 'users', [
      {
        email: 'peter.heinrich@gmail.com',
        first_name: 'Peter',
        last_name: 'Heinrich',
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        email: 'angie@zetamari.com',
        first_name: 'Angie',
        last_name: 'Heinrich',
        created_at: new Date(),
        updated_at: new Date(),
      }
    ] );
  },

  async down( queryInterface )
  {
    await queryInterface.bulkDelete( 'users', null, {} );
  },
};
