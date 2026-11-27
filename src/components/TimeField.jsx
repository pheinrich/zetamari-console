'use client'

import { forwardRef } from 'react'

import TextField from '@mui/material/TextField'

import { format, isValid, parse } from 'date-fns'

import AppReactDatepicker from '@/libs/styles/AppReactDatepicker'

// A time-of-day field: react-datepicker's time list behind a plain MUI
// TextField, the time counterpart of DateField. Speaks 'HH:mm' strings -
// value in, onChange( 'HH:mm' | '' ) out. Times can be typed as well as
// picked: "9:30 AM", "9:30am", "9 am", "13:30".

// The first is how a time is shown; all are accepted when typed.
const TIME_FORMATS = ['h:mm aa', 'h:mmaa', 'h aa', 'haa', 'H:mm']

function toDate( value )
{
  if( !value )
    return null

  const date = parse( value, 'HH:mm', new Date() )

  return isValid( date ) ? date : null
}

const PickerInput = forwardRef( (props, ref) => <TextField inputRef={ref} {...props} /> )

PickerInput.displayName = 'TimePickerInput'

export default function TimeField( {value, onChange, disabled, boxProps, timeIntervals = 15, placeholder = '9:30 AM', ...textFieldProps} )
{
  return (
    <AppReactDatepicker
      boxProps={boxProps}
      selected={toDate( value )}
      onChange={date => onChange?.( date ? format( date, 'HH:mm' ) : '' )}
      showTimeSelect
      showTimeSelectOnly
      timeIntervals={timeIntervals}
      timeCaption='Time'
      dateFormat={TIME_FORMATS}
      placeholderText={placeholder}
      disabled={disabled}
      popperProps={{strategy: 'fixed'}}
      customInput={<PickerInput {...textFieldProps} disabled={disabled} />}
    />
  )
}
