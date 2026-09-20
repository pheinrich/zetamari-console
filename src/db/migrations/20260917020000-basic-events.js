'use strict'

/*
 * Introduces BasicEvent - the simplified calendar entry (Title, Start
 * Datetime, End Datetime, Color, Description) that replaces the old
 * Capacity-tracking calendar for good - see docs/adr/0008 and
 * CONTEXT.md's Basic Event entry. Events (art shows/conferences) and
 * LiveClasses now express their schedule entirely as one-or-more
 * BasicEvent occurrences instead of a single startDate/endDate pair, so
 * a multi-day show can carry different hours per day.
 *
 * Backfills one BasicEvent per existing Event/LiveClass row from its
 * current startDate/endDate before dropping those columns, so no
 * existing show/class schedule is silently lost.
 */
module.exports = {
  async up( queryInterface, Sequelize )
  {
    await queryInterface.createTable( 'BasicEvents', {
      id: { type: Sequelize.DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
      title: { type: Sequelize.DataTypes.STRING, allowNull: false },
      startDatetime: { type: Sequelize.DataTypes.DATE, allowNull: false },
      endDatetime: { type: Sequelize.DataTypes.DATE, allowNull: false },
      color: { type: Sequelize.DataTypes.STRING, allowNull: false, defaultValue: 'primary' },
      description: { type: Sequelize.DataTypes.TEXT },
      eventId: {
        type: Sequelize.DataTypes.INTEGER,
        allowNull: true,
        references: { model: 'Events', key: 'id' },
        onDelete: 'CASCADE',
      },
      liveClassId: {
        type: Sequelize.DataTypes.INTEGER,
        allowNull: true,
        references: { model: 'LiveClasses', key: 'id' },
        onDelete: 'CASCADE',
      },
    } )

    await queryInterface.addIndex( 'BasicEvents', ['startDatetime', 'endDatetime'] )
    await queryInterface.addIndex( 'BasicEvents', ['eventId'] )
    await queryInterface.addIndex( 'BasicEvents', ['liveClassId'] )

    await queryInterface.sequelize.query(
      'ALTER TABLE `BasicEvents` ADD CONSTRAINT `basic_events_at_most_one_parent` ' +
      'CHECK (NOT (`eventId` IS NOT NULL AND `liveClassId` IS NOT NULL))'
    )

    await queryInterface.createTable( 'BasicEventParticipants', {
      id: { type: Sequelize.DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
      basicEventId: {
        type: Sequelize.DataTypes.INTEGER,
        allowNull: false,
        references: { model: 'BasicEvents', key: 'id' },
        onDelete: 'CASCADE',
      },
      personId: {
        type: Sequelize.DataTypes.INTEGER,
        allowNull: false,
        references: { model: 'People', key: 'id' },
        onDelete: 'CASCADE',
      },
    } )

    await queryInterface.addIndex( 'BasicEventParticipants', ['basicEventId', 'personId'], {unique: true} )

    // --- Backfill one BasicEvent per existing Event/LiveClass row -------
    const [events] = await queryInterface.sequelize.query( 'SELECT id, name, startDate, endDate FROM Events' )
    const [liveClasses] = await queryInterface.sequelize.query( 'SELECT id, name, startDate, endDate FROM LiveClasses' )

    const backfill = []

    for( const e of events )
    {
      if( !e.startDate )
        continue

      backfill.push( {
        title: e.name,
        startDatetime: `${e.startDate} 00:00:00`,
        endDatetime: `${e.endDate || e.startDate} 23:59:59`,
        color: 'primary',
        eventId: e.id,
      } )
    }

    for( const c of liveClasses )
    {
      backfill.push( {
        title: c.name,
        startDatetime: `${c.startDate} 00:00:00`,
        endDatetime: `${c.endDate || c.startDate} 23:59:59`,
        color: 'primary',
        liveClassId: c.id,
      } )
    }

    if( backfill.length )
      await queryInterface.bulkInsert( 'BasicEvents', backfill )

    await queryInterface.removeColumn( 'Events', 'startDate' )
    await queryInterface.removeColumn( 'Events', 'endDate' )
    await queryInterface.removeColumn( 'LiveClasses', 'startDate' )
    await queryInterface.removeColumn( 'LiveClasses', 'endDate' )
  },

  async down( queryInterface, Sequelize )
  {
    await queryInterface.addColumn( 'Events', 'startDate', { type: Sequelize.DataTypes.DATEONLY } )
    await queryInterface.addColumn( 'Events', 'endDate', { type: Sequelize.DataTypes.DATEONLY } )
    await queryInterface.addColumn( 'LiveClasses', 'startDate', { type: Sequelize.DataTypes.DATEONLY } )
    await queryInterface.addColumn( 'LiveClasses', 'endDate', { type: Sequelize.DataTypes.DATEONLY } )

    // Best-effort - restores each parent's dates from its earliest/latest
    // BasicEvent, not necessarily its original values.
    await queryInterface.sequelize.query(
      'UPDATE Events e JOIN (SELECT eventId, MIN(DATE(startDatetime)) s, MAX(DATE(endDatetime)) f ' +
      'FROM BasicEvents WHERE eventId IS NOT NULL GROUP BY eventId) b ON b.eventId = e.id ' +
      'SET e.startDate = b.s, e.endDate = b.f'
    )
    await queryInterface.sequelize.query(
      'UPDATE LiveClasses c JOIN (SELECT liveClassId, MIN(DATE(startDatetime)) s, MAX(DATE(endDatetime)) f ' +
      'FROM BasicEvents WHERE liveClassId IS NOT NULL GROUP BY liveClassId) b ON b.liveClassId = c.id ' +
      'SET c.startDate = b.s, c.endDate = b.f'
    )

    await queryInterface.dropTable( 'BasicEventParticipants' )
    await queryInterface.dropTable( 'BasicEvents' )
  },
}
