// ** React Imports
import { useState, useEffect } from 'react'

// ** Next Import
import Link from 'next/link'

// ** MUI Imports
import Grid from '@mui/material/Grid'
import Alert from '@mui/material/Alert'

// ** Third Party Components
import axios from 'axios'

const InvoiceEdit = ({ id }) => {
  const value = 'this is the value'

  return (
    <div>InvoiceEdit {typeof id}</div>
  )
}

export default InvoiceEdit
