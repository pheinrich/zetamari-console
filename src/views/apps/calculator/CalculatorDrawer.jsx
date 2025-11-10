import { useEffect, useState, useRef } from 'react'

import Drawer from '@mui/material/Drawer'
import Typography from '@mui/material/Typography'
import TextField from '@mui/material/TextField'
import FormControl from '@mui/material/FormControl'
import InputLabel from '@mui/material/InputLabel'
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import Checkbox from '@mui/material/Checkbox'
import ListItemText from '@mui/material/ListItemText'
import Chip from '@mui/material/Chip'
import IconButton from '@mui/material/IconButton'
import Button from '@mui/material/Button'
import Tooltip from '@mui/material/Tooltip'
import InputAdornment from '@mui/material/InputAdornment'

import { useForm, Controller } from 'react-hook-form'
import { valibotResolver } from '@hookform/resolvers/valibot'
import { minLength, nonEmpty, object, pipe, string } from 'valibot'

import { editItem, deleteItem } from '@/redux-store/slices/calculator'
import CustomAvator from '@core/components/mui/Avatar'
import AppReactDatepicker from '@/libs/styles/AppReactDatepicker'
import { chipColor } from './ItemCard'

const schema = object({
  title: pipe( string(), nonEmpty( 'Title is required' ), minLength( 1 ) )
})

const CalculatorDrawer = props => {
  const {drawerOpen, dispatch, setDrawerOpen, item, lightboxes, setLightboxes} = props

  const [date, setDate] = useState( /*item.dueDate ||*/ Date.now() )
  const [badgeText, setBadgeText] = useState( item.badgeText || [] )
  const [fileName, setFileName] = useState( '' )
  const [comment, setComment] = useState( '' )

  const fileInputRef = useRef( null )

  const {
    control,
    handleSubmit,
    reset,
    formState: {errors}
  } = useForm({
    defaultValues: {
      title: item.title
    },
    resolver: valibotResolver( schema )
  })

  const handleFileUpload = event => {
    const {files} = event.target

    if( files && files.length !== 0 )
      setFileName( files[0].name )
  }

  const handleClose = () => {
    setDrawerOpen( false )
    reset( {title: item.title} )
    setBadgeText( item.badgeText || [] )
    setDate( /*item.dueDate ||*/ Date.now() )
    setFileName( '' )
    setComment( '' )

    if( fileInputRef.current )
      fileInputRef.current.value = ''
  }

  const updateItem = data => {
    dispatch( editItem( {id: item.id, title: data.title, badgeText/*, dueDate: date*/} ) )
    handleClose()
  }

  const handleReset = () => {
    setDrawerOpen( false )
    dispatch( deleteItem( item.id ) )

    const updatedLightboxes = lightboxes.map( lightbox => {
      return {
        ...lightbox,
        itemIds: lightbox.itemIds.filter( itemId => itemId !== item.id )
      }
    })

    setLightboxes( updatedLightboxes )
  }

  useEffect( () => {
    reset( {title: item.title} )
    setBadgeText( item.badgeText || [] )
    setDate( /*item.dueDate ||*/ Date.now() )
  }, [item, reset] )

  return (
    <div>
      <Drawer
        open={drawerOpen}
        anchor='right'
        variant='temporary'
        ModalProps={{keepMounted: true}}
        sx={{'& .MuiDrawer-paper': {width: {xs: 300, sm:400}}}}
        onClose={handleClose}
      >
        <div className='flex justify-between items-center pli-5 plb-4 border-be'>
          <Typography variant='h5'>Edit Item</Typography>
          <IconButton size='small' onClick={handleClose}>
            <i className='ri-close-line text-2xl' />
          </IconButton>
        </div>
        <div className='p-6'>
          <form className='flex flex-col gap-y-5' onSubmit={handleSubmit( updateItem )}>
            <Controller
              name='title'
              control={control}
              render={({field}) => (
                <TextField
                  fullWidth
                  label='Title'
                  {...field}
                  error={Boolean( errors.title )}
                  helperText={errors.title?.message}
                />
              )}
            />

            <AppReactDatepicker
              selected={date ? new Date( date ) : new Date()}
              id='basic-input'
              onChange={date => {
                date !== null && setDate( date )
              }}
              placeholderText='Click to select date'
              customInput={<TextField label='Due Date' fullWidth />}
            />
            <FormControl fullWidth>
              <InputLabel id='demo-multiple-chip-label'>Label</InputLabel>
              <Select
                multiple
                label='label'
                value={badgeText || []}
                onChange={e => setBadgeText( e.target.value )}
                renderValue={selected => (
                  <div className='flex flex-wrap gap-1'>
                    {selected.map( value => (
                      <Chip
                        variant='tonal'
                        label={value}
                        key={value}
                        onMouseDown={e => e.stopPropagation()}
                        size='small'
                        onDelete={() => setBadgeText( current => current.filter( it => it !== value ) )}
                        color={chipColor[value]?.color}
                      />
                    ))}
                  </div>
                )}
              >
                {Object.keys( chipColor ).map( chip => (
                  <MenuItem key={chip} value={chip}>
                    <Checkbox checked={badgeText && badgeText.indexOf( chip ) > -1} />
                    <ListItemText primary={chip} />
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <div className='flex flex-col gap-y-1'>
              <Typography variant='body2'>Assigned</Typography>
              <div className='flex gap-1'>
                {item.assigned?.map( (avatar, index) => (
                  <ToolTip title={avatar.name} key={index}>
                    <CustomAvatar key={index} src={avatar.src} size={26} className='cursor-pointer' />
                  </ToolTip>
                ))}
                <CustomAvator size={26} className='cursor-pointer'>
                  <i className='ri-add-line text-base text-textSecondary' />
                </CustomAvator>
              </div>
            </div>
            <div className='flex items-center gap-4'>
              <TextField
                fullWidth
                size='small'
                label='Choose File'
                variant='outlined'
                value={fileName}
                slotProps={{
                  input: {
                    readOnly: true,
                    endAdornment: fileName ? (
                      <InputAdornment position='end'>
                        <IconButton size='small' edge='end' onClick={() => setFileName( '' )}>
                          <i className='ri-close-line' />
                        </IconButton>
                      </InputAdornment>
                    ) : null
                  }
                }}
              />
              <Button component='label' variant='outlined' htmlFor='contained-button-file'>
                Choose
                <input hidden id='contained-button-file' type='file' onChange={handleFileUpload} ref={fileInputRef} />
              </Button>
            </div>
            <TextField
              fullWidth
              label='comment'
              value={comment}
              onChange={e => setComment( e.target.value )}
              multiline
              rows={4}
              placeholder='Write a Comment...'
            />
            <div className='flex gap-4'>
              <Button variant='contained' color='primary' type='submit'>
                Update
              </Button>
              <Button variant='outlined' color='error' type='reset' onClick={handleReset}>
                Delete
              </Button>
            </div>
          </form>
        </div>
      </Drawer>
    </div>
  )
}

export default CalculatorDrawer
