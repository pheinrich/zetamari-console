'use client'

import { useId } from 'react'

import { NumberField as BaseNumberField } from '@base-ui/react/number-field'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import FormControl from '@mui/material/FormControl'
import FormLabel from '@mui/material/FormLabel'
import OutlinedInput from '@mui/material/OutlinedInput'

// A number field with its decrement and increment buttons either side of
// the input - MUI's "spinner field" (mui.com/material-ui/react-number-field
// /#spinner-field), which Material UI doesn't ship: its demo, composed on
// Base UI's NumberField (press-and-hold repeat, arrow keys, min/max
// clamping, dragging the label to scrub), adapted to MUI 6 and this app's
// Remix icons, without the scrub cursor.
//
// Base UI's NumberField.Root props pass through - value / onValueChange
// (called with a number, or null when the input is cleared), min, max,
// step, disabled, and the rest. `color` ('success', 'warning', 'error',
// ...) tints the outline and value - e.g. to show a state, not only on
// focus. `label` is optional.
export default function NumberSpinner( {id: idProp, label, error, color, size = 'medium', inputWidth, ...other} )
{
  const generatedId = useId()
  const id = idProp ?? generatedId
  const tint = color ? `${color}.main` : undefined

  return (
    <BaseNumberField.Root
      {...other}
      render={(props, state) => (
        <FormControl
          size={size}
          ref={props.ref}
          disabled={state.disabled}
          required={state.required}
          error={error}
          variant='outlined'
          sx={{
            '& .MuiButton-root': {
              borderColor: tint ?? 'divider',
              minWidth: 0,
              px: size === 'small' ? 1 : 1.5,
              bgcolor: 'action.hover',
              '&:not(.Mui-disabled)': {
                color: 'text.primary',
              },
            },
            ...(tint && {
              '& .MuiOutlinedInput-notchedOutline, & .Mui-disabled .MuiOutlinedInput-notchedOutline': {borderColor: tint},
              '& .MuiOutlinedInput-input': {color: tint, WebkitTextFillColor: 'currentColor', fontWeight: 500},
            }),
          }}
        >
          {props.children}
        </FormControl>
      )}
    >
      {label && (
        <BaseNumberField.ScrubArea render={<Box component='span' sx={{userSelect: 'none', width: 'max-content'}} />}>
          <FormLabel
            htmlFor={id}
            sx={{display: 'inline-block', cursor: 'ew-resize', fontSize: '0.875rem', color: 'text.primary', fontWeight: 500, lineHeight: 1.5, mb: 0.5}}
          >
            {label}
          </FormLabel>
        </BaseNumberField.ScrubArea>
      )}
      <Box sx={{display: 'flex'}}>
        <BaseNumberField.Decrement
          render={(
            <Button
              variant='outlined'
              aria-label='Decrease'
              size={size}
              sx={{
                borderTopRightRadius: 0,
                borderBottomRightRadius: 0,
                borderRight: '0px',
                '&.Mui-disabled': {borderRight: '0px'},
              }}
            />
          )}
        >
          <i className={`ri-subtract-line ${size === 'small' ? 'text-[18px]' : 'text-[22px]'}`} />
        </BaseNumberField.Decrement>

        <BaseNumberField.Input
          id={id}
          render={(props, state) => (
            <OutlinedInput
              inputRef={props.ref}
              value={state.inputValue}
              onBlur={props.onBlur}
              onChange={props.onChange}
              onKeyUp={props.onKeyUp}
              onKeyDown={props.onKeyDown}
              onFocus={props.onFocus}
              size={size}
              slotProps={{
                input: {
                  ...props,
                  size: Math.max( (other.max?.toString() || '').length, state.inputValue.length || 1 ) + 1,
                  style: {textAlign: 'center', ...(inputWidth && {inlineSize: inputWidth})},
                },
              }}
              sx={{pr: 0, borderRadius: 0, flex: 1}}
            />
          )}
        />

        <BaseNumberField.Increment
          render={(
            <Button
              variant='outlined'
              aria-label='Increase'
              size={size}
              sx={{
                borderTopLeftRadius: 0,
                borderBottomLeftRadius: 0,
                borderLeft: '0px',
                '&.Mui-disabled': {borderLeft: '0px'},
              }}
            />
          )}
        >
          <i className={`ri-add-line ${size === 'small' ? 'text-[18px]' : 'text-[22px]'}`} />
        </BaseNumberField.Increment>
      </Box>
    </BaseNumberField.Root>
  )
}
