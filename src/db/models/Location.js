import { DataTypes } from 'sequelize'

import sequelize from '@/db/sequelize.js'
import Address from '@/db/models/Address'

// A named place classes are taught at - "Angie's Studio", "Angie's
// Studio (Zoom)", a partner studio - with its Address. Live Classes point
// at one (LiveClass.locationId); renaming or re-addressing it changes it
// for every class held there. Can't be deleted while a class uses it.
const Location = sequelize.define(
  'Location',
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    name: { type: DataTypes.STRING, allowNull: false, unique: true },
    addressId: { type: DataTypes.INTEGER, allowNull: true, references: { model: Address, key: 'id' } },
  },
  {
    timestamps: false,
  })

Location.belongsTo( Address, {foreignKey: 'addressId'} )

export default Location
