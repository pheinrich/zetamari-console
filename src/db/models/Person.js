import { DataTypes } from 'sequelize'
import bcrypt from 'bcryptjs'
import sequelize from '@/db/sequelize.js'

// The unified person record - what used to be split across User (staff
// logins) and Customer (the customer/contact/student master list) until
// the 20260917010000-merge-people.js migration merged them. A Person is
// just a person; which capacities they act in (Owner, Assistant, Admin,
// Retail Customer, Wholesale Customer, Student, ...) are Role
// assignments via PersonRole, not columns here - the same person can be
// an Owner *and* a Student *and* an Admin at once.
//
// `password` is nullable and only ever set for a Person who can log in
// (see db/actions/person.js's readUsers()/readCustomers() split, which
// distinguishes the two by presence/absence of a password rather than a
// stored flag). Every other field is deliberately nullable - real
// records are often wildly incomplete, same as the old Customer table.
const Person = sequelize.define(
  'Person',
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    firstName: { type: DataTypes.STRING },
    lastName: { type: DataTypes.STRING },
    company: { type: DataTypes.STRING },
    email: { type: DataTypes.STRING },
    password: { type: DataTypes.STRING, allowNull: true },
    phone: { type: DataTypes.STRING },
    street1: { type: DataTypes.STRING },
    street2: { type: DataTypes.STRING },
    city: { type: DataTypes.STRING },
    state: { type: DataTypes.STRING },
    postalCode: { type: DataTypes.STRING },
    country: { type: DataTypes.STRING },
    website: { type: DataTypes.STRING },
    notes: { type: DataTypes.TEXT },
    createdOn: { type: DataTypes.DATEONLY, allowNull: false, defaultValue: DataTypes.NOW },

    // Tri-state - see the old Customer model's doc comment on this same
    // field for why (true/false is an explicit opt-in/opt-out, null is
    // "unknown", a real and different case for imported records).
    acceptsEmailMarketing: { type: DataTypes.BOOLEAN, allowNull: true },
    discountPercent: { type: DataTypes.FLOAT, allowNull: true },
  },
  {
    timestamps: false,
  })

// Same hook User.js had - only fires when a password is actually being
// set, so plain contacts created with no password go through untouched.
Person.beforeCreate( async (person) => {
  if( person.password )
    person.password = await bcrypt.hash( person.password, 10 )
})

export default Person
