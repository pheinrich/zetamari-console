import { useEffect, useState } from 'react'

import Typography from '@mui/material/Typography'
import InputBase from '@mui/material/InputBase'
import IconButton from '@mui/material/IconButton'

import { useDragAndDrop } from '@formkit/drag-and-drop/react'
import { animations } from '@formkit/drag-and-drop'
import classnames from 'classnames'

import { addItem, editLightbox, deleteLightbox, updateLightboxItemIds } from '@/redux-store/slices/calculator'

import OptionMenu from '@core/components/option-menu'
import ItemCard from './ItemCard'
import NewItem from './NewItem'

import styles from './styles.module.css'

const Lightbox = props => {
  const {lightbox, items, dispatch, store, setDrawerOpen, lightboxes, setLightboxes, currentItem} = props
  const [editDisplay, setEditDisplay] = useState( false )
  const [title, setTitle] = useState( lightbox.title )

  const [itemsListRef, itemsList, setItemsList] = useDragAndDrop( items, {
    group: 'itemsList',
    plugins: [animations()],
    draggable: el => el.classList.contains( 'item-draggable' )
  })

  const addNewItem = title => {
    const maxId = Math.max( 0, ...store.items.map( item => item.id ) )
    dispatch( addItem( {lightboxId: lightbox.id, title: title} ) )
    setItemsList( [...itemsList, {id:maxId + 1, title}] )

    const newLightboxes = lightboxes.map( lbox => {
      if( lbox.id === lightbox.id )
        return {...lbox, itemIds: [...lbox.itemIds, maxId + 1 ]}
      return lbox
    })

    setLightboxes( newLightboxes )
  }

  const handleSubmitEdit = e => {
    e.preventDefault()
    setEditDisplay( !editDisplay )
    dispatch( editLightbox( {id: lightbox.id, title} ) )

    const newLightboxes = lightboxes.map( lbox => {
      if( lbox.id === lightbox.id )
        return {...lbox, title}
      return lbox
    })

    setLightboxes( newLightboxes )
  }

  const cancelEdit = () => {
    setEditDisplay( !editDisplay )
    setTitle( lightbox.title )
  }

  const handleDeleteLightbox = () => {
    dispatch( deleteLightbox( {lightboxId: lightbox.id} ) )
    setLightboxes( lightboxes.filter( lbox => lbox.id !== lightbox.id ) )
  }

  useEffect( () => {
    if( itemsList !== items )
      console.log( 'itemsList !== items' )
      console.log( JSON.stringify(itemsList) )
      console.log( JSON.stringify( items ) )
      dispatch( updateLightboxItemIds( {id: lightbox.id, itemsList: JSON.stringify(itemsList)} ) )
  }, [itemsList] )

  useEffect( () => {
    const newItems = itemsList.map( item => {
      if( item?.id === currentItem?.id )
        return currentItem
      return item
    })

    if( currentItem !== itemsList.find( item => item?.id === currentItem?.id ) )
      setItemsList( newItems )
  }, [currentItem] )

  useEffect( () => {
    let itemIds = []

    lightboxes.map( lbox => {
      itemIds = [...itemIds, ...lbox.itemIds]
    })
    const newItemsList = itemsList.filter( item => item && itemIds.includes( item.id ) )

    setItemsList( newItemsList )
  }, [lightboxes] )

  return (
    <div ref={itemsListRef} className='flex flex-col is-[16.5rem]'>
      {editDisplay ? (
        <form
          className='flex items-center mbe-4'
          onSubmit={handleSubmitEdit}
          onKeyDown={e => {
            if( e.key === 'Escape' )
              cancelEdit()
          }}
        >
          <InputBase value={title} autoFocus onChange={e => setTitle( e.target.value )} required />
          <IconButton color='success' size='small' type='submit'>
            <i className='ri-check-line' />
          </IconButton>
          <IconButton color='error' size='small' type='reset' onClick={cancelEdit}>
            <i className='ri-close-line' />
          </IconButton>
        </form>
      ) : (
        <div
          id='no-drag'
          className={classnames(
            'flex items-center justify-between is-[16.5rem] bs-[2.125rem] mbe-4',
            styles.calculatorLightbox
          )}
        >
          <Typography variant='h5' noWrap className='max-is-[80%]'>
            {lightbox.title}
          </Typography>
          <div className='flex items-center'>
            <i className={classnames( 'ri-drag-move-fill text-textSecondary list-handle', styles.drag )} />
            <OptionMenu
              iconClassName='text-xl text-actionActive'
              options={[
                {
                  text: 'Edit',
                  icon: 'ri-pencil-line',
                  menuItemProps: {
                    className: 'flex items-center gap-2',
                    onClick: () => setEditDisplay( !editDisplay )
                  }
                },
                {
                  text: 'Delete',
                  icon: 'ri-delete-bin-line',
                  menuItemProps: {
                    className: 'flex items-center gap-2',
                    onClick: handleDeleteLightbox
                  }
                }
              ]}
            />
          </div>
        </div>
      )}
      {itemsList.map(
        item =>
          item && (
            <ItemCard
              key={item.id}
              item={item}
              dispatch={dispatch}
              lightbox={lightbox}
              setLightboxes={setLightboxes}
              setDrawerOpen={setDrawerOpen}
              itemsList={itemsList}
              setItemsList={setItemsList}
            />
          )
      )}
      <NewItem addItem={addNewItem} />
    </div>
  )
}

export default Lightbox
