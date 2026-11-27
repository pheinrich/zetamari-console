import { DataTypes } from 'sequelize'

import sequelize from '@/db/sequelize.js'

// A postal address, shared in shape by everything that has one: People,
// Events, Suppliers and Locations each point at an Address (one row per
// owner, except a Location's, which every class held there shares). See
// the 20261127000000-addresses-and-locations.js migration and
// libs/addresses.js for saving one from a form. Channel Orders keep their
// ship-to as the channel sent it, a JSON snapshot in the same field names.
const Address = sequelize.define(
  'Address',
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    street1: { type: DataTypes.STRING },
    street2: { type: DataTypes.STRING },
    city: { type: DataTypes.STRING },
    state: { type: DataTypes.STRING },
    postalCode: { type: DataTypes.STRING },
    country: { type: DataTypes.STRING },
  },
  {
    timestamps: false,
  })

export const ADDRESS_FIELDS = ['street1', 'street2', 'city', 'state', 'postalCode', 'country']

export default Address
