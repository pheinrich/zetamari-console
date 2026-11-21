'use client'

import { forwardRef, useState } from 'react'

import IconButton from '@mui/material/IconButton'
import InputAdornment from '@mui/material/InputAdornment'
import TextField from '@mui/material/TextField'

import { format, isValid, parseISO } from 'date-fns'

import AppReactDatepicker from '@/libs/styles/AppReactDatepicker'

// A date-only field: react-datepicker's calendar behind a plain MUI
// TextField, in place of the browser's native `type='date'` input (which
// this app never uses). It speaks the same 'YYYY-MM-DD' strings a native
// date input does - value in, onChange( 'YYYY-MM-DD' | '' ) out - so it
// drops in where one was. Pass `name` to have it submit with a <form>
// (through a hidden input), `clearable` for a clear button once there's
// a value, and either `value` (controlled) or `defaultValue`.

const DATE_FORMAT = 'yyyy-MM-dd'

function toDate( value )
{
  if( !value )
    return null

  // parseISO() reads a bare date as local midnight, where new Date()
  // would read it as UTC and could land on the day before.
  const date = parseISO( value )

  return isValid( date ) ? date : null
}

const PickerInput = forwardRef( ( {clearable, onClear, hasValue, slotProps, ...props}, ref ) => (
  <TextField
    inputRef={ref}
    {...props}
    slotProps={{
      ...slotProps,
      input: {
        ...slotProps?.input,
        endAdornment: clearable && hasValue && !props.disabled && (
          <InputAdornment position='end'>
            <IconButton
              size='small'
              aria-label={`Clear ${props.label || 'date'}`}
              onClick={e => { e.stopPropagation(); onClear() }}
            >
              <i className='ri-close-line' />
            </IconButton>
          </InputAdornment>
        ),
      },
    }}
  />
) )

PickerInput.displayName = 'PickerInput'

export default function DateField( {
  value,
  defaultValue = '',
  onChange,
  name,
  clearable = false,
  disabled,
  minDate,
  maxDate,
  boxProps,
  ...textFieldProps
} )
{
  const [internal, setInternal] = useState( defaultValue || '' )
  const current = undefined === value ? internal : ( value || '' )

  function emit( next )
  {
    if( undefined === value )
      setInternal( next )
    onChange?.( next )
  }

  return (
    <>
      <AppReactDatepicker
        boxProps={boxProps}
        selected={toDate( current )}
        dateFormat={DATE_FORMAT}
        placeholderText='YYYY-MM-DD'
        disabled={disabled}
        minDate={toDate( minDate )}
        maxDate={toDate( maxDate )}

        // Fixed positioning keeps the calendar from being clipped by a
        // scrolling Dialog or table cell.
        popperProps={{strategy: 'fixed'}}
        onChange={date => emit( date ? format( date, DATE_FORMAT ) : '' )}
        customInput={
          <PickerInput
            {...textFieldProps}
            disabled={disabled}
            clearable={clearable}
            hasValue={Boolean( current )}
            onClear={() => emit( '' )}
          />
        }
      />
      {name && <input type='hidden' name={name} value={current} />}
    </>
  )
}
