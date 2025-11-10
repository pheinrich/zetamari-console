import { useState } from 'react'

import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Chip from '@mui/material/Chip'
import Typography from '@mui/material/Typography'
import AvatarGroup from '@mui/material/AvatarGroup'
import Tooltip from '@mui/material/Tooltip'
import IconButton from '@mui/material/IconButton'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'

import classnames from 'classnames'

import { setCurrentItem, deleteItem } from '@/redux-store/slices/calculator'

import CustomAvatar from '@core/components/mui/Avatar'

import styles from './styles.module.css'

export const chipColor = {
  UX: { color: 'success' },
  'Code Review': { color: 'error' },
  Dashboard: { color: 'info' },
  Images: { color: 'warning' },
  App: { color: 'secondary' },
  'Charts & Map': { color: 'primary' }
}

const ItemCard = props => {
  const { item, dispatch, lightbox, setLightboxes, lightboxes, setDrawerOpen, itemsList, setItemsList } = props

  const [anchorEl, setAnchorEl] = useState( null )
  const [menuOpen, setMenuOpen] = useState( false )

  const handleClick = e => {
    setMenuOpen( true )
    setAnchorEl( e.currentTarget )
  }

  const handleClose = () => {
    setAnchorEl( null )
    setMenuOpen( false )
  }

  const handleItemClick = () => {
    setDrawerOpen( true )
    dispatch( setCurrentItem( item.id ) )
  }

  const handleDeleteItem = () => {
    dispatch( deleteItem( item.id ) )
    setItemsList( itemsList.filter( it => it?.id !== item.id))
    const newItemIds = lightbox.itemIds.filter( itemId => itemId !== item.id )
    const newLightbox = { ...lightbox, itemIds: newItemIds }
    const newLightboxes = lightboxes.map(lbox => (lbox.id === lightbox.id ? newLightbox : lbox ) )

    setLightboxes( newLightboxes )
  }

  const handleDelete = () => {
    handleClose()
    handleDeleteItem()
  }

  return (
    <>
      <Card
        className={classnames(
          'item-draggable is-[16.5rem] cursor-grab active:cursor-grabbing overflow-visible mbe-4',
          styles.card
        )}
        onClick={() => handleItemClick()}
      >
        <CardContent className='flex flex-col gap-y-2 items-start relative overflow-hidden'>
          {item.badgeText && item.badgeText.length > 0 && (
            <div className='flex flex-wrap items-center justify-start gap-2 is-full max-is-[85%]'>
              {item.badgeText.map(
                (badge, index) =>
                  chipColor[badge]?.color && (
                    <Chip variant='tonal' key={index} label={badge} size='small' color={chipColor[badge].color} />
                  )
              )}
            </div>
          )}
          <div className='absolute block-start-4 inline-end-3' onClick={e => e.stopPropagation()}>
            <IconButton
              aria-label='more'
              size='small'
              className={classnames(styles.menu, {
                [styles.menuOpen]: menuOpen
              })}
              aria-controls='long-menu'
              aria-haspopup='true'
              onClick={handleClick}
            >
              <i className='ri-more-2-line text-xl' />
            </IconButton>
            <Menu
              id='long-menu'
              transformOrigin={{ vertical: 'top', horizontal: 'right' }}
              anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
              anchorEl={anchorEl}
              keepMounted
              open={Boolean(anchorEl)}
              onClose={handleClose}
            >
              <MenuItem onClick={handleClose}>Duplicate Item</MenuItem>
              <MenuItem onClick={handleClose}>Copy Item Link</MenuItem>
              <MenuItem
                onClick={() => {
                  handleDelete()
                }}
              >
                Delete
              </MenuItem>
            </Menu>
          </div>

          {item.image && <img src={item.image} alt='item Image' className='is-full rounded' />}
          <Typography color='text.primary' className='max-is-[85%] break-words'>
            {item.title}
          </Typography>
          {(item.attachments !== undefined && item.attachments > 0) ||
          (item.comments !== undefined && item.comments > 0) ||
          (item.assigned !== undefined && item.assigned.length > 0) ? (
            <div className='flex justify-between items-center gap-4 is-full'>
              {(item.attachments !== undefined && item.attachments > 0) ||
              (item.comments !== undefined && item.comments > 0) ? (
                <div className='flex gap-4'>
                  {item.attachments !== undefined && item.attachments > 0 && (
                    <div className='flex items-center gap-1'>
                      <i className='ri-attachment-2 text-xl text-textSecondary' />
                      <Typography color='text.secondary'>{item.attachments}</Typography>
                    </div>
                  )}
                  {item.comments !== undefined && item.comments > 0 && (
                    <div className='flex items-center gap-1'>
                      <i className='ri-wechat-line text-xl text-textSecondary' />
                      <Typography color='text.secondary'>{item.comments}</Typography>
                    </div>
                  )}
                </div>
              ) : null}
              {item.assigned !== undefined && item.assigned.length > 0 && (
                <AvatarGroup max={4} className='pull-up'>
                  {item.assigned?.map((avatar, index) => (
                    <Tooltip title={avatar.name} key={index}>
                      <CustomAvatar
                        key={index}
                        src={avatar.src}
                        alt={avatar.name}
                        size={26}
                        className='cursor-pointer'
                      />
                    </Tooltip>
                  ))}
                </AvatarGroup>
              )}
            </div>
          ) : null}
        </CardContent>
      </Card>
    </>
  )
}

export default ItemCard
