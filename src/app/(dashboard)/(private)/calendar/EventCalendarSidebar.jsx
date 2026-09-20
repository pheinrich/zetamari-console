'use client'

// MUI Imports
import Button from '@mui/material/Button'
import Drawer from '@mui/material/Drawer'
import Divider from '@mui/material/Divider'
import Checkbox from '@mui/material/Checkbox'
import Typography from '@mui/material/Typography'
import FormControlLabel from '@mui/material/FormControlLabel'

// Third-party imports
import classnames from 'classnames'

// Styled Component Imports
import AppReactDatepicker from '@/libs/styles/AppReactDatepicker'

// The color-keyed "calendars" a Basic Event can be tagged with (see
// EVENT_COLORS in EventCalendar.jsx) - same mini-calendar + "Event
// Filters" checkbox-per-calendar layout as the reference apps/calendar
// demo (src/views/apps/calendar/SidebarLeft.jsx), just filtering by
// BasicEvent.color instead of a Redux-store "calendar" category, since
// that's the closest thing we have to one.
export default function EventCalendarSidebar( {
  mdAbove,
  leftSidebarOpen,
  handleLeftSidebarToggle,
  calendarApi,
  colorOptions,
  selectedColors,
  onToggleColor,
  onToggleAllColors,
  onAddEvent,
} )
{
  return (
    <Drawer
      open={leftSidebarOpen}
      onClose={handleLeftSidebarToggle}
      variant={mdAbove ? 'permanent' : 'temporary'}
      ModalProps={{
        disablePortal: true,
        disableAutoFocus: true,
        disableScrollLock: true,
        keepMounted: true,
      }}
      className={classnames( 'block', {static: mdAbove, absolute: !mdAbove} )}
      PaperProps={{
        className: classnames( 'items-start is-[280px] shadow-none rounded rounded-se-none rounded-ee-none', {
          static: mdAbove,
          absolute: !mdAbove,
        } ),
      }}
      sx={{
        zIndex: 3,
        '& .MuiDrawer-paper': {zIndex: mdAbove ? 2 : 'drawer'},
        '& .MuiBackdrop-root': {borderRadius: 1, position: 'absolute'},
      }}
    >
      <div className='is-full p-5'>
        <Button fullWidth variant='contained' onClick={onAddEvent} startIcon={<i className='ri-add-line' />}>
          Add Event
        </Button>
      </div>
      <Divider className='is-full' />
      <AppReactDatepicker
        inline
        onChange={date => calendarApi?.gotoDate( date )}
        boxProps={{
          className: 'flex justify-center is-full',
          sx: {'& .react-datepicker': {boxShadow: 'none !important', border: 'none !important'}},
        }}
      />
      <Divider className='is-full' />

      <div className='flex flex-col p-5 is-full'>
        <Typography variant='h5' className='mbe-4'>
          Event Filters
        </Typography>
        <FormControlLabel
          className='mbe-1'
          label='View All'
          control={
            <Checkbox
              color='secondary'
              checked={selectedColors.length === colorOptions.length}
              onChange={e => onToggleAllColors( e.target.checked )}
            />
          }
        />
        {colorOptions.map( color => (
          <FormControlLabel
            className='mbe-1'
            key={color}
            label={color[0].toUpperCase() + color.slice( 1 )}
            control={
              <Checkbox
                color={color}
                checked={selectedColors.includes( color )}
                onChange={() => onToggleColor( color )}
              />
            }
          />
        ) )}
      </div>
    </Drawer>
  )
}
