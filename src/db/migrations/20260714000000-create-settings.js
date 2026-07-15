'use strict'

// A single-row table for organization-wide preferences. Currently just
// the company name/logo used to brand printed calculator reports (see
// src/db/actions/settings.js) - always read/written as the one existing
// row rather than modeled as a key-value store, since there's only ever
// one of these.
module.exports = {
  async up( queryInterface, Sequelize )
  {
    await queryInterface.createTable( 'Settings', {
      id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
      companyName: { type: Sequelize.STRING, allowNull: true },
      logoUrl: { type: Sequelize.STRING, allowNull: true },
    })
  },

  async down( queryInterface )
  {
    await queryInterface.dropTable( 'Settings' )
  },
}
