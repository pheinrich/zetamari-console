// Next Imports
import { NextResponse } from 'next/server'

// Mock data for demo purpose
// import { users } from './users'

import bcrypt from 'bcryptjs'
import User from '@/db/models/User.js'
import sequelize from '@/db/sequelize.js'

export async function POST(req) {
  // Vars
  const { email, password } = await req.json()
  const user = await User.findOne( {where: {email: email}} )  
  // const user = users.find(u => u.email === email && u.password === password)
  let response = null

    if( user && await bcrypt.compare( password, user.password ) )
    {
      const { password: _, ...filteredUserData } = user.dataValues
      response = {...filteredUserData}

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
