import { DataTypes } from 'sequelize'
import sequelize from '@/db/sequelize.js'
import BasicEvent from '@/db/models/BasicEvent'
import Person from '@/db/models/Person'

// Who's attending/working a Basic Event - a plain many-to-many, on
// purpose: a Basic Event can have zero or more Participants and a
// Person can be a Participant on zero or more Basic Events. Deliberately
// simpler than LiveClassAttendee (no status/discount/snapshot fields) -
// that richer, class-specific roster stays separate for now (see
// docs/adr/0008); this is the generic case.
const BasicEventParticipant = sequelize.define(
  'BasicEventParticipant',
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    basicEventId: { type: DataTypes.INTEGER, allowNull: false, references: { model: BasicEvent, key: 'id' } },
    personId: { type: DataTypes.INTEGER, allowNull: false, references: { model: Person, key: 'id' } },
  },
  {
    timestamps: false,
  })

BasicEvent.belongsToMany( Person, {through: BasicEventParticipant, foreignKey: 'basicEventId', otherKey: 'personId', as: 'Participants'} )
Person.belongsToMany( BasicEvent, {through: BasicEventParticipant, foreignKey: 'personId', otherKey: 'basicEventId', as: 'BasicEvents'} )

export default BasicEventParticipant
