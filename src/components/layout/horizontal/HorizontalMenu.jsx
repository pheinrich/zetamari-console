// MUI Imports
import { useTheme } from '@mui/material/styles'

// Component Imports
import HorizontalNav, { Menu, SubMenu, MenuItem } from '@menu/horizontal-menu'
import VerticalNavContent from './VerticalNavContent'

// Hook Imports
import useVerticalNav from '@menu/hooks/useVerticalNav'
import { useSettings } from '@core/hooks/useSettings'

// Styled Component Imports
import StyledHorizontalNavExpandIcon from '@menu/styles/horizontal/StyledHorizontalNavExpandIcon'
import StyledVerticalNavExpandIcon from '@menu/styles/vertical/StyledVerticalNavExpandIcon'

// Style Imports
import menuRootStyles from '@core/styles/horizontal/menuRootStyles'
import menuItemStyles from '@core/styles/horizontal/menuItemStyles'
import verticalNavigationCustomStyles from '@core/styles/vertical/navigationCustomStyles'
import verticalMenuItemStyles from '@core/styles/vertical/menuItemStyles'
import verticalMenuSectionStyles from '@core/styles/vertical/menuSectionStyles'

const RenderExpandIcon = ({ level }) => (
  <StyledHorizontalNavExpandIcon level={level}>
    <i className='ri-arrow-right-s-line' />
  </StyledHorizontalNavExpandIcon>
)

const RenderVerticalExpandIcon = ({ open, transitionDuration }) => (
  <StyledVerticalNavExpandIcon open={open} transitionDuration={transitionDuration}>
    <i className='ri-arrow-right-s-line' />
  </StyledVerticalNavExpandIcon>
)

const HorizontalMenu = ({}) => {
  // Hooks
  const verticalNavOptions = useVerticalNav()
  const theme = useTheme()
  const { settings } = useSettings()

  // Vars
  const { skin } = settings
  const { transitionDuration } = verticalNavOptions

  return (
    <HorizontalNav
      switchToVertical
      verticalNavContent={VerticalNavContent}
      verticalNavProps={{
        customStyles: verticalNavigationCustomStyles(verticalNavOptions, theme),
        backgroundColor:
          skin === 'bordered' ? 'var(--mui-palette-background-paper)' : 'var(--mui-palette-background-default)'
      }}
    >
      <Menu
        rootStyles={menuRootStyles(theme)}
        renderExpandIcon={({ level }) => <RenderExpandIcon level={level} />}
        renderExpandedMenuItemIcon={{ icon: <i className='ri-circle-line' /> }}
        menuItemStyles={menuItemStyles(theme, 'ri-circle-line')}
        popoutMenuOffset={{
          mainAxis: ({ level }) => (level && level > 0 ? 4 : 16),
          alignmentAxis: 0
        }}
        verticalMenuProps={{
          menuItemStyles: verticalMenuItemStyles(verticalNavOptions, theme),
          renderExpandIcon: ({ open }) => (
            <RenderVerticalExpandIcon open={open} transitionDuration={transitionDuration} />
          ),
          renderExpandedMenuItemIcon: { icon: <i className='ri-circle-line' /> },
          menuSectionStyles: verticalMenuSectionStyles(verticalNavOptions, theme)
        }}
      >
        <SubMenu label='tools' icon={<i className='ri-ruler-2-line' />}>
          <MenuItem href='/calculator' icon={<i className='ri-ruler-2-line' />}>
            visualizer
          </MenuItem>
        </SubMenu>

        <SubMenu label='inventory' icon={<i className='ri-shapes-line' />}>
          <MenuItem href='/contours' icon={<i className='ri-shape-2-line' />}>
            contours
          </MenuItem>
          <MenuItem href='/suppliers' icon={<i className='ri-truck-line' />}>
            suppliers
          </MenuItem>
          <MenuItem href='/products' icon={<i className='ri-shapes-line' />}>
            products
          </MenuItem>
          <MenuItem href='/stock' icon={<i className='ri-archive-line' />}>
            stock
          </MenuItem>
          <MenuItem href='/images' icon={<i className='ri-image-line' />}>
            images
          </MenuItem>
        </SubMenu>

        <SubMenu label='customer' icon={<i className='ri-user-line' />}>
          <MenuItem href='/customers' icon={<i className='ri-user-line' />}>
            contacts
          </MenuItem>
          <MenuItem href='/orders' icon={<i className='ri-shopping-bag-3-line' />}>
            orders
          </MenuItem>
          <MenuItem href='/channel-orders' icon={<i className='ri-inbox-line' />}>
            channel orders
          </MenuItem>
          <MenuItem href='/inbound-emails' icon={<i className='ri-mail-line' />}>
            inbound emails
          </MenuItem>
        </SubMenu>

        <SubMenu label='scheduling' icon={<i className='ri-shopping-bag-3-line' />}>
          <MenuItem href='/calendar' icon={<i className='ri-calendar-check-line' />}>
            calendar
          </MenuItem>
          <MenuItem href='/events' icon={<i className='ri-calendar-event-line' />}>
            shows
          </MenuItem>
          <MenuItem href='/live-classes' icon={<i className='ri-graduation-cap-line' />}>
            live classes
          </MenuItem>
          <MenuItem href='/production' icon={<i className='ri-layout-grid-line' />}>
            production
          </MenuItem>
        </SubMenu>

        <SubMenu label='config' icon={<i className='ri-settings-3-line' />}>
          <MenuItem href='/users' icon={<i className='ri-team-line' />}>
            users
          </MenuItem>
          <MenuItem href='/roles' icon={<i className='ri-shield-user-line' />}>
            roles
          </MenuItem>
          <MenuItem href='/permissions' icon={<i className='ri-lock-2-line' />}>
            permissions
          </MenuItem>
          <MenuItem href='/settings' icon={<i className='ri-settings-3-line' />}>
            settings
          </MenuItem>
        </SubMenu>
      </Menu>
    </HorizontalNav>
  )
}

export default HorizontalMenu
