// Next Imports
import { NextResponse } from 'next/server'

import bcrypt from 'bcryptjs'
import { Op } from 'sequelize'
import Person from '@/db/models/Person.js'

export async function POST(req) {
  // Vars
  const { email, password } = await req.json()

  // Users and Customers were merged into one People table (see
  // 20260917010000-merge-people.js) - email isn't unique across every
  // Person, but only ever set alongside a password for someone who can
  // actually log in, so scoping to password IS NOT NULL keeps this from
  // matching an unrelated contact who happens to share an email.
  const user = await Person.findOne( {where: {email, password: {[Op.ne]: null}}} )
  let response = null

    if( user && await bcrypt.compare( password, user.password ) )
    {
      const { password: _, ...filteredUserData } = user.dataValues

      // session.user.name (read by e.g. UserDropdown.jsx) expects one
      // combined name - Person only has firstName/lastName.
      const name = [filteredUserData.firstName, filteredUserData.lastName].filter( Boolean ).join( ' ' )

      response = {...filteredUserData, name}

      return NextResponse.json(response)
    }
    else
    {
    // We return 401 status code and error message if user is not found
    return NextResponse.json(
      {
        // We create object here to separate each error message for each field in case of multiple errors
        message: ['Email or Password is invalid']
      },
      {
        status: 401,
        statusText: 'Unauthorized Access'
      }
    )
  }
}
