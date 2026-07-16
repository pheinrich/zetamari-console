'use strict'

/*
 * Introduces a configurable pricing system for the calculator's per-unit
 * production factors (material-by-area, machine time, utilities, labor
 * stages) - separate from the existing BillOfMaterials/SupplierProducts
 * COGS system, which tracks actual acquisition cost for discrete
 * purchased materials and is untouched by this migration.
 *
 * CostFactors is a lookup table (one row per pricing input - tesserae,
 * glass, substrate, machineWear, utilities, and the five labor stages),
 * mirroring how ShapeTypes replaced a hardcoded ENUM: adding a new cost
 * factor later is a data insert, not a schema change.
 *
 * RateProfiles holds named pricing tiers - the two system defaults
 * (kind='wholesale'/'retail', exactly one row each) plus any number of
 * custom named profiles (kind='custom', e.g. "Special Pieces") a product
 * can opt into for one or both tiers (see the follow-up migration that
 * adds Products.wholesaleRateProfileId/retailRateProfileId).
 *
 * ProfileRates is the RateProfile x CostFactor join, holding the $-per-
 * unit rate - seeded here for the two default profiles using today's
 * calculatorStats.js retail constants (converted from $/ft^2 to $/in^2)
 * as the Retail rates, and a first-guess 50%-of-retail as the Wholesale
 * rates, matching the ratio in the tesserae example that motivated this
 * feature ($0.30 wholesale / $0.60 retail per sq-in). machineWear/
 * utilities/labor-stage rates have no prior basis in this app, so they
 * seed at 0 - placeholders to be set via the new CRUD UI.
 *
 * ProductCostOverrides is deliberately sparse: a row only exists where a
 * product's computed quantity (area from its geometry, cut distance from
 * its border, labor hours from area/distance-based heuristics - all
 * derived live in application code, not stored) has been manually
 * overridden. No row = "use the computed default." This is why there's
 * no separate "isOverridden" flag or fallback column here.
 */

const COST_FACTORS = [
  { key: 'tesserae', label: 'Tesserae', unit: 'sqin', category: 'material' },
  { key: 'glass', label: 'Glass', unit: 'sqin', category: 'material' },
  { key: 'substrate', label: 'Substrate', unit: 'sqin', category: 'material' },
  { key: 'machineWear', label: 'Machine Wear', unit: 'in', category: 'machine' },
  { key: 'utilities', label: 'Utilities', unit: 'hr', category: 'machine' },
  { key: 'laborDesign', label: 'Design Labor', unit: 'hr', category: 'labor' },
  { key: 'laborCnc', label: 'CNC Labor', unit: 'hr', category: 'labor' },
  { key: 'laborSanding', label: 'Sanding Labor', unit: 'hr', category: 'labor' },
  { key: 'laborGlueing', label: 'Glueing Labor', unit: 'hr', category: 'labor' },
  { key: 'laborGrouting', label: 'Grouting Labor', unit: 'hr', category: 'labor' },
  { key: 'laborFinishing', label: 'Finishing Labor', unit: 'hr', category: 'labor' },
]

// $/ft^2 (calculatorStats.js) -> $/in^2 (CostFactors.unit for these three).
const SUBSTRATE_RETAIL_DFT2 = 12
const TESSERAE_RETAIL_DFT2 = 87
const GLASS_RETAIL_DFT2 = 22

const RETAIL_RATES = {
  tesserae: TESSERAE_RETAIL_DFT2 / 144,
  glass: GLASS_RETAIL_DFT2 / 144,
  substrate: SUBSTRATE_RETAIL_DFT2 / 144,
  machineWear: 0,
  utilities: 0,
  laborDesign: 0,
  laborCnc: 0,
  laborSanding: 0,
  laborGlueing: 0,
  laborGrouting: 0,
  laborFinishing: 0,
}

// First-guess starting point only (see the tesserae 0.30/0.60 example) -
// meant to be reviewed/adjusted via the RateProfile CRUD UI, not treated
// as authoritative.
const WHOLESALE_RATIO = 0.5

module.exports = {
  async up( queryInterface, Sequelize )
  {
    await queryInterface.createTable( 'CostFactors', {
      id: { type: Sequelize.DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
      key: { type: Sequelize.DataTypes.STRING, allowNull: false, unique: true },
      label: { type: Sequelize.DataTypes.STRING, allowNull: false },
      unit: { type: Sequelize.DataTypes.STRING, allowNull: false },
      category: { type: Sequelize.DataTypes.STRING, allowNull: true },
    })

    await queryInterface.createTable( 'RateProfiles', {
      id: { type: Sequelize.DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
      name: { type: Sequelize.DataTypes.STRING, allowNull: false, unique: true },
      kind: { type: Sequelize.DataTypes.ENUM( 'wholesale', 'retail', 'custom' ), allowNull: false },
    })

    await queryInterface.createTable(
      'ProfileRates',
      {
        id: { type: Sequelize.DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
        rateProfileId: {
          type: Sequelize.DataTypes.INTEGER,
          allowNull: false,
          references: { model: 'RateProfiles', key: 'id' },
          onDelete: 'CASCADE',
        },
        costFactorId: {
          type: Sequelize.DataTypes.INTEGER,
          allowNull: false,
          references: { model: 'CostFactors', key: 'id' },
          onDelete: 'CASCADE',
        },
        rate: { type: Sequelize.DataTypes.FLOAT, allowNull: false, defaultValue: 0 },
      },
      {
        uniqueKeys: [
          { name: 'profile_rate_unique', fields: ['rateProfileId', 'costFactorId'] }
        ]
      })

    await queryInterface.createTable(
      'ProductCostOverrides',
      {
        id: { type: Sequelize.DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
        productId: {
          type: Sequelize.DataTypes.INTEGER,
          allowNull: false,
          references: { model: 'Products', key: 'id' },
          onDelete: 'CASCADE',
        },
        costFactorId: {
          type: Sequelize.DataTypes.INTEGER,
          allowNull: false,
          references: { model: 'CostFactors', key: 'id' },
          onDelete: 'CASCADE',
        },
        quantity: { type: Sequelize.DataTypes.FLOAT, allowNull: false },
      },
      {
        uniqueKeys: [
          { name: 'product_cost_override_unique', fields: ['productId', 'costFactorId'] }
        ]
      })

    for( const factor of COST_FACTORS )
      await queryInterface.sequelize.query(
        'INSERT INTO `CostFactors` (`key`, `label`, `unit`, `category`) VALUES (?, ?, ?, ?)',
        { replacements: [factor.key, factor.label, factor.unit, factor.category] }
      )

    for( const [name, kind] of [['Wholesale', 'wholesale'], ['Retail', 'retail']] )
      await queryInterface.sequelize.query(
        'INSERT INTO `RateProfiles` (`name`, `kind`) VALUES (?, ?)',
        { replacements: [name, kind] }
      )

    const [factorRows, profileRows] = await Promise.all([
      queryInterface.sequelize.query( 'SELECT `id`, `key` FROM `CostFactors`', { type: Sequelize.QueryTypes.SELECT } ),
      queryInterface.sequelize.query( 'SELECT `id`, `kind` FROM `RateProfiles`', { type: Sequelize.QueryTypes.SELECT } ),
    ])

    const retailProfile = profileRows.find( p => 'retail' === p.kind )
    const wholesaleProfile = profileRows.find( p => 'wholesale' === p.kind )

    for( const factor of factorRows )
    {
      const retailRate = RETAIL_RATES[factor.key] ?? 0

      await queryInterface.sequelize.query(
        'INSERT INTO `ProfileRates` (`rateProfileId`, `costFactorId`, `rate`) VALUES (?, ?, ?)',
        { replacements: [retailProfile.id, factor.id, retailRate] }
      )
      await queryInterface.sequelize.query(
        'INSERT INTO `ProfileRates` (`rateProfileId`, `costFactorId`, `rate`) VALUES (?, ?, ?)',
        { replacements: [wholesaleProfile.id, factor.id, retailRate * WHOLESALE_RATIO] }
      )
    }
  },

  async down( queryInterface )
  {
    await queryInterface.dropTable( 'ProductCostOverrides' )
    await queryInterface.dropTable( 'ProfileRates' )
    await queryInterface.dropTable( 'RateProfiles' )
    await queryInterface.dropTable( 'CostFactors' )
  },
}
