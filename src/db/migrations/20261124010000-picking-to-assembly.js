'use strict'

/*
 * The kit-only Production Phase and Labor stage "Picking" (sorting and
 * selecting a kit's tesserae) becomes "Assembly", so that "Picking" can
 * take its usual fulfillment meaning: gathering an order's products to
 * ship (see CONTEXT.md's Shipment). Renames, with data kept:
 *
 *   Pieces.phase                    'Picking' -> 'Assembly'
 *   CostFactors (key, label)        laborPicking/Picking -> laborAssembly/Assembly
 *   Settings.pickingRateSqInPerHr   -> assemblyRateSqInPerHr
 *
 * Product cost overrides point at the CostFactor by id, so they follow.
 */
const BOTH = ['Design', 'CNC', 'Sanding', 'Picking', 'Assembly', 'Gluing', 'Grouting', 'Glass', 'Finishing']
const phases = name => BOTH.filter( p => p !== name )

async function renamePhase( queryInterface, DataTypes, from, to )
{
  const column = values => ({type: DataTypes.ENUM( ...values ), allowNull: false, defaultValue: 'Design'})

  await queryInterface.changeColumn( 'Pieces', 'phase', column( BOTH ) )
  await queryInterface.sequelize.query( 'UPDATE Pieces SET phase = ? WHERE phase = ?', {replacements: [to, from]} )
  await queryInterface.changeColumn( 'Pieces', 'phase', column( phases( from ) ) )
}

module.exports = {
  async up( queryInterface, Sequelize )
  {
    await renamePhase( queryInterface, Sequelize.DataTypes, 'Picking', 'Assembly' )
    await queryInterface.sequelize.query( "UPDATE CostFactors SET `key` = 'laborAssembly', label = 'Assembly' WHERE `key` = 'laborPicking'" )
    await queryInterface.renameColumn( 'Settings', 'pickingRateSqInPerHr', 'assemblyRateSqInPerHr' )
  },

  async down( queryInterface, Sequelize )
  {
    await queryInterface.renameColumn( 'Settings', 'assemblyRateSqInPerHr', 'pickingRateSqInPerHr' )
    await queryInterface.sequelize.query( "UPDATE CostFactors SET `key` = 'laborPicking', label = 'Picking' WHERE `key` = 'laborAssembly'" )
    await renamePhase( queryInterface, Sequelize.DataTypes, 'Assembly', 'Picking' )
  },
}
