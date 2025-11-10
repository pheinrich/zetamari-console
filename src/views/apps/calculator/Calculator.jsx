'use client'
import { useEffect, useState } from 'react'

import { useDragAndDrop } from '@formkit/drag-and-drop/react'
import { animations } from '@formkit/drag-and-drop'
import { useDispatch, useSelector } from 'react-redux'

import { addLightbox, updateLightboxes } from '@/redux-store/slices/calculator'

import Lightbox from './Lightbox'
import NewLightbox from './NewLightbox'
import CalculatorDrawer from './CalculatorDrawer'

const Calculator = () => {
  const [drawerOpen, setDrawerOpen] = useState( false )

  const calculatorStore = useSelector( state => state.calculatorReducer )
  const dispatch = useDispatch()

  const [calculatorRef, lightboxes, setLightboxes] = useDragAndDrop( calculatorStore.lightboxes, {
    plugins: [animations()],
    dragHandle: '.list-handle'
  })

  const addNewLightbox = title => {
    const maxId = Math.max( 0, ...calculatorStore.lightboxes.map( lightbox => lightbox.id ) )

    dispatch( addLightbox( title ) )
    setLightboxes( [...lightboxes, {id: maxId + 1, title, itemIds: []}] )
  }

  const currentItem = calculatorStore.items.find( item => item.id === calculatorStore.currentItemId )

  useEffect( () => {
    if( lightboxes != calculatorStore.lightboxes )
      dispatch( updateLightboxes( lightboxes ) )
  }, [lightboxes] )

  return (
    <div className='flex items-start gap-6'>
      <div ref={calculatorRef} className='flex gap-6'>
        {lightboxes.map( lightbox => (
          <Lightbox
            key={lightbox.id}
            dispatch={dispatch}
            lightbox={lightbox}
            store={calculatorStore}
            setDrawerOpen={setDrawerOpen}
            lightboxes={lightboxes}
            setLightboxes={setLightboxes}
            currentItem={currentItem}
            items={lightbox.itemIds.map( itemId => calculatorStore.items.find( item => item.id === itemId ) )}
          />
        ))}
      </div>
      <NewLightbox addNewLightbox={addNewLightbox} />
      {currentItem && (
        <CalculatorDrawer
          item={currentItem}
          drawerOpen={drawerOpen}
          setDrawerOpen={setDrawerOpen}
          dispatch={dispatch}
          lightboxes={lightboxes}
          setLightboxes={setLightboxes}
        />
      )}
    </div>
  )
}

export default Calculator
