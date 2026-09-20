'use strict'

/*
 * Foundation for the Person/Role/Permission refactor (see CONTEXT.md's
 * Role/Permission entries and docs/adr/0008). Roles replace the old
 * single-valued User.role ('owner'/'assistant') and Customer.type
 * ('wholesale'/'retail') enums - a Person can hold any number of Roles.
 * Permissions are seeded empty for now; nothing enforces them yet, this
 * is just the data model a later access-control pass will build on.
 *
 * Seeds the starter Role set Angie asked for. Roles/Permissions
 * themselves have no FK to Person yet - that comes with the
 * PersonRole join table in the next migration, once Person exists.
 */
module.exports = {
  async up( queryInterface, Sequelize )
  {
    await queryInterface.createTable( 'Roles', {
      id: { type: Sequelize.DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
      name: { type: Sequelize.DataTypes.STRING, allowNull: false, unique: true },
      description: { type: Sequelize.DataTypes.TEXT },
    } )

    await queryInterface.createTable( 'Permissions', {
      id: { type: Sequelize.DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
      name: { type: Sequelize.DataTypes.STRING, allowNull: false, unique: true },
      description: { type: Sequelize.DataTypes.TEXT },
    } )

    await queryInterface.createTable( 'RolePermissions', {
      id: { type: Sequelize.DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
      roleId: {
        type: Sequelize.DataTypes.INTEGER,
        allowNull: false,
        references: { model: 'Roles', key: 'id' },
        onDelete: 'CASCADE',
      },
      permissionId: {
        type: Sequelize.DataTypes.INTEGER,
        allowNull: false,
        references: { model: 'Permissions', key: 'id' },
        onDelete: 'CASCADE',
      },
    } )

    await queryInterface.addIndex( 'RolePermissions', ['roleId', 'permissionId'], {unique: true} )

    await queryInterface.bulkInsert( 'Roles', [
      {name: 'Admin', description: 'Full administrative access.'},
      {name: 'User', description: 'A staff member with a console login.'},
      {name: 'Owner', description: 'One of the two business owner-operators.'},
      {name: 'Assistant', description: 'Hired production help.'},
      {name: 'Retail Customer', description: 'Buys at retail pricing.'},
      {name: 'Wholesale Customer', description: 'Buys at wholesale pricing.'},
      {name: 'Student', description: 'Has attended one or more live classes.'},
    ] )
  },

  async down( queryInterface )
  {
    await queryInterface.dropTable( 'RolePermissions' )
    await queryInterface.dropTable( 'Permissions' )
    await queryInterface.dropTable( 'Roles' )
  },
}
