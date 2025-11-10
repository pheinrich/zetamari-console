import { useState } from 'react'

import Button from '@mui/material/Button'
import MuiTextField from '@mui/material/TextField'
import { styled } from '@mui/material/styles'
import Typography from '@mui/material/Typography'

import { useForm, Controller } from 'react-hook-form'
import { valibotResolver } from '@hookform/resolvers/valibot'
import { object, string, minLength, pipe, nonEmpty } from 'valibot'

const TextField = styled(MuiTextField)({
  '& .MuiOutlinedInput-root': {
    backgroundColor: 'var(--mui-palette-background-paper)'
  }
})

const schema = object({
  content: pipe( string(), nonEmpty( 'Content is required' ), minLength( 1 ) )
})

const NewItem = ({ addItem }) => {
  // States
  const [displayNewItem, setDisplayNewItem] = useState( false )

  // Hooks
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm({
    defaultValues: {
      content: ''
    },
    resolver: valibotResolver( schema )
  })

  const toggleDisplay = () => {
    setDisplayNewItem( !displayNewItem )
  }

  const onSubmit = data => {
    addItem( data.content )
    setDisplayNewItem( false )
    reset( {content: ''} )
  }

  const handleReset = () => {
    toggleDisplay()
    reset( {content: ''} )
  }

  return (
    <div className='flex flex-col gap-4 items-start'>
      <Typography onClick={toggleDisplay} color='text.primary' className='flex items-center gap-1 cursor-pointer'>
        <i className='ri-add-line text-base' />
        <span>Add New Item</span>
      </Typography>
      {displayNewItem && (
        <form className='flex flex-col gap-4 min-is-[16.5rem]' onSubmit={handleSubmit( onSubmit )}>
          <Controller
            name='content'
            control={control}
            render={({ field }) => (
              <TextField
                fullWidth
                multiline
                autoFocus
                rows={2}
                onKeyDown={e => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault()
                    handleSubmit( onSubmit )(e)
                  }

                  if (e.key === 'Escape') {
                    handleReset()
                  }
                }}
                label='Add Content'
                size='small'
                variant='outlined'
                {...field}
                error={Boolean(errors.content)}
                helperText={errors.content ? errors.content.message : null}
              />
            )}
          />
          <div className='flex gap-4'>
            <Button variant='contained' size='small' color='primary' type='submit'>
              Add
            </Button>
            <Button
              variant='outlined'
              size='small'
              color='secondary'
              onClick={() => {
                handleReset()
              }}
            >
              Cancel
            </Button>
          </div>
        </form>
      )}
    </div>
  )
}

export default NewItem
