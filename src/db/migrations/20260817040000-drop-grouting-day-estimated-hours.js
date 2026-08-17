'use strict'

/*
 * GroutingDays.estimatedAssistantHours (added by 20260817010000-
 * grouting-days.js) never got a UI to write it - confirmed unused
 * anywhere in the codebase before dropping. Replaced by
 * AssistantAvailabilities (20260817030000-assistant-availabilities.js):
 * a Grouting Day's expected assistant hours are now just the sum of
 * that table's rows for its date, computed on demand rather than
 * stored - see src/libs/pieceScheduling.js's simulateBacklog().
 */
module.exports = {
  async up( queryInterface )
  {
    await queryInterface.removeColumn( 'GroutingDays', 'estimatedAssistantHours' )
  },

  async down( queryInterface, Sequelize )
  {
    await queryInterface.addColumn( 'GroutingDays', 'estimatedAssistantHours', {
      type: Sequelize.DataTypes.FLOAT,
    } )
  },
}
