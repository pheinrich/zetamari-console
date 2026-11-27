'use client'

import Grid from '@mui/material/Grid2'
import TextField from '@mui/material/TextField'

import { z } from 'zod'

// An Address's fields for a <form> (see db/models/Address.js), submitted
// as address[street1] ... - which formDataToDeepJSON() nests under
// `address` - for libs/addresses.js's saveOwnedAddress(). `address` is
// the saved one, to start from. Lay it out inside a Grid container.

const optionalString = z.preprocess( (val) => (val === '' ? undefined : val), z.string().optional() )

// For a form's zod schema - which drops keys it doesn't list
export const addressSchema = z.object( {
  street1: optionalString,
  street2: optionalString,
  city: optionalString,
  state: optionalString,
  postalCode: optionalString,
  country: optionalString,
} ).optional()

const FIELDS = [
  ['street1', 'Street 1', {xs: 12}],
  ['street2', 'Street 2', {xs: 12}],
  ['city', 'City', {xs: 12, sm: 6}],
  ['state', 'State / Province', {xs: 12, sm: 3}],
  ['postalCode', 'Zip / Postal Code', {xs: 12, sm: 3}],
  ['country', 'Country', {xs: 12, sm: 6}],
]

export default function AddressFields( {address, name = 'address'} )
{
  return FIELDS.map( ([field, label, size]) => (
    <Grid key={field} size={size}>
      <TextField fullWidth label={label} name={`${name}[${field}]`} defaultValue={address?.[field] || ''} />
    </Grid>
  ) )
}
