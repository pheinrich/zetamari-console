// MUI Imports
import { useTheme } from '@mui/material/styles'
import Chip from '@mui/material/Chip'

// Third-party Imports
import PerfectScrollbar from 'react-perfect-scrollbar'

// Component Imports
import { Menu, MenuItem, MenuSection } from '@menu/vertical-menu'

// Hook Imports
import useVerticalNav from '@menu/hooks/useVerticalNav'

// Styled Component Imports
import StyledVerticalNavExpandIcon from '@menu/styles/vertical/StyledVerticalNavExpandIcon'

// Style Imports
import menuItemStyles from '@core/styles/vertical/menuItemStyles'
import menuSectionStyles from '@core/styles/vertical/menuSectionStyles'
import useNavCounts from '@/hooks/useNavCounts'

const RenderExpandIcon = ({ open, transitionDuration }) => (
  <StyledVerticalNavExpandIcon open={open} transitionDuration={transitionDuration}>
    <i className='ri-arrow-right-s-line' />
  </StyledVerticalNavExpandIcon>
)

const VerticalMenu = ({ scrollMenu }) => {
  // Hooks
  const theme = useTheme()
  const { receivedEmails, newChannelOrders, openShipments } = useNavCounts()
  const verticalNavOptions = useVerticalNav()

  // Vars
  const { isBreakpointReached, transitionDuration } = verticalNavOptions

  const ScrollWrapper = isBreakpointReached ? 'div' : PerfectScrollbar

  return (
    // eslint-disable-next-line lines-around-comment
    /* Custom scrollbar instead of browser scroll, remove if you want browser scroll only */
    <ScrollWrapper
      {...(isBreakpointReached
        ? {
            className: 'bs-full overflow-y-auto overflow-x-hidden',
            onScroll: container => scrollMenu(container, false)
          }
        : {
            options: { wheelPropagation: false, suppressScrollX: true },
            onScrollY: container => scrollMenu(container, true)
          })}
    >
      {/* Incase you also want to scroll NavHeader to scroll with Vertical Menu, remove NavHeader from above and paste it below this comment */}
      {/* Vertical Menu */}
      <Menu
        popoutMenuOffset={{ mainAxis: 10 }}
        menuItemStyles={menuItemStyles(verticalNavOptions, theme)}
        renderExpandIcon={({ open }) => <RenderExpandIcon open={open} transitionDuration={transitionDuration} />}
        renderExpandedMenuItemIcon={{ icon: <i className='ri-circle-line' /> }}
        menuSectionStyles={menuSectionStyles(verticalNavOptions, theme)}
      >
        <MenuSection label='tools'>
          <MenuItem href='/calculator' icon={<i className='ri-ruler-2-line' />}>
            visualizer
          </MenuItem>
        </MenuSection>
        <MenuSection label='production'>
          <MenuItem
            href='/channel-orders'
            icon={<i className='ri-inbox-line' />}
            suffix={newChannelOrders > 0 && <Chip size='small' color='error' label={newChannelOrders} />}
          >
            inbound
          </MenuItem>
          <MenuItem href='/production' icon={<i className='ri-layout-grid-line' />}>
            in progress
          </MenuItem>
          <MenuItem
            href='/shipments'
            icon={<i className='ri-box-3-line' />}
            suffix={openShipments > 0 && <Chip size='small' color='error' label={openShipments} />}
          >
            outbound
          </MenuItem>
        </MenuSection>
        <MenuSection label='orders'>
          <MenuItem href='/orders' icon={<i className='ri-shopping-bag-3-line' />}>
            accepted
          </MenuItem>
          <MenuItem
            href='/channels'
            icon={<i className='ri-mail-line' />}
            suffix={receivedEmails > 0 && <Chip size='small' color='error' label={receivedEmails} />}
          >
            channels
          </MenuItem>
        </MenuSection>
        <MenuSection label='events'>
          <MenuItem href='/calendar' icon={<i className='ri-calendar-check-line' />}>
            calendar
          </MenuItem>
          <MenuItem href='/live-classes' icon={<i className='ri-graduation-cap-line' />}>
            classes
          </MenuItem>
          <MenuItem href='/events' icon={<i className='ri-calendar-event-line' />}>
            shows
          </MenuItem>
        </MenuSection>
        <MenuSection label='inventory'>
          <MenuItem href='/products' icon={<i className='ri-shapes-line' />}>
            products
          </MenuItem>
          <MenuItem href='/stock' icon={<i className='ri-archive-line' />}>
            stock
          </MenuItem>
          <MenuItem href='/suppliers' icon={<i className='ri-truck-line' />}>
            suppliers
          </MenuItem>
          <MenuItem href='/images' icon={<i className='ri-image-line' />}>
            images
          </MenuItem>
        </MenuSection>
        <MenuSection label='config'>
          <MenuItem href='/customers' icon={<i className='ri-contacts-book-line' />}>
            address book
          </MenuItem>
          <MenuItem href='/users' icon={<i className='ri-team-line' />}>
            users
          </MenuItem>
          <MenuItem href='/contours' icon={<i className='ri-shape-2-line' />}>
            contours
          </MenuItem>
          <MenuItem href='/settings' icon={<i className='ri-settings-3-line' />}>
            settings
          </MenuItem>
        </MenuSection>
      </Menu>
    </ScrollWrapper>
  )
}

export default VerticalMenu
