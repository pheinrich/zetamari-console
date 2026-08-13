import { DataTypes } from 'sequelize'
import sequelize from '@/db/sequelize.js'

// One of Angie's live-taught classes - in-person (her studio, a partner
// venue) or online (Zoom) - as opposed to her self-guided online
// learning products, which stay plain Products and are never modeled
// here. See the 20260807030000-live-classes.js migration for the full
// rationale. Enrollment lives on LiveClassAttendee (see that model), not
// here - this is just the class itself.
const LiveClass = sequelize.define(
  'LiveClass',
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    name: { type: DataTypes.STRING, allowNull: false },
    locationType: { type: DataTypes.ENUM( 'in_person', 'online' ), allowNull: false, defaultValue: 'in_person' },
    locationName: { type: DataTypes.STRING },
    locationAddress: { type: DataTypes.STRING },
    startDate: { type: DataTypes.DATEONLY, allowNull: false },
    endDate: { type: DataTypes.DATEONLY },
    cost: { type: DataTypes.FLOAT },
    notes: { type: DataTypes.TEXT },
  },
  {
    timestamps: false,
  })

export default LiveClass
