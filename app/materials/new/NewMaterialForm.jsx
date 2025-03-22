'use client'

import { useActionState, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createMaterial } from '@/db/actions/material'
import { build } from '@/lib/mirror'

const initialState =
{
  success: false,
  error: '',
}

export default function NewMaterialForm( {contourList} )
{
  const [state, formAction] = useActionState( createMaterial, initialState )
  const [type, setType] = useState( 'bead' )
  const [outsideId, setOutsideId] = useState( '' )
  const [insideId, setInsideId] = useState( '' )
  const [rabbetId, setRabbetId] = useState( '' )
  const router = useRouter()

  useEffect( () => {
    if( state.success )
      router.push( '/materials' )
  }, [state.success, router] )

  return(
    <form action={formAction}>
      <h1>New Material</h1>

      {state.error && (
        <div>{state.error}</div>
      )}

      <div>
        <label>Name</label>
        <input name='name' placeholder='Name' required />
      </div>

      <div>
        <label>Type</label>
        <select
          name='type'
          placeholder='Type'
          defaultValue=''
          onChange={(evt) => setType( evt.target.value )}
        >
          <option value='' disabled>Select Type</option>
          <option value='bead'>Bead</option>
          <option value='tile'>Tile</option>
          <option value='substrate'>Substrate</option>
          <option value='millefiori'>Millefiori</option>
          <option value='mirror'>Mirror</option>
          <option value='birdhouse'>Birdhouse</option>
          <option value='frame'>Frame</option>
          <option value='other'>Other</option>
        </select>
      </div>

      <div>
        <label>SKU</label>
        <input name='sku' placeholder='SKU' required />
      </div>

      <div>
        <label>Units</label>
        <input name='units' placeholder='Units' defaultValue='each' />
      </div>

      <div>
        <label>Weight</label>
        <input name='weight' placeholder='Weight' />
      </div>

      <div>
        <label>Description</label>
        <textarea name='description' placeholder='Description' />
      </div>

      <fieldset disabled={type !== 'bead'}>
        <legend>Bead Details</legend>
        <div>
          <div>
            <label>Category</label>
            <select
              name='beadType'
              placeholder='Category'
              defaultValue='plastic'
            >
              <option value='' disabled>Select category</option>
              <option value='glass'>Glass</option>
              <option value='metal'>Metal</option>
              <option value='plastic'>Plastic</option>
              <option value='ceramic'>Ceramic</option>
              <option value='shell'>Shell</option>
              <option value='rhinestone'>Rhinestone</option>
              <option value='other'>Other</option>
            </select>
          </div>
          <div>
            <label>Finish</label>
            <select
              name='beadFinish'
              placeholder='Finish'
              defaultValue='plain'
            >
              <option value='' disabled>Select finish</option>
              <option value='fire-polished'>Fire-Polished</option>
              <option value='silvered'>Silvered</option>
              <option value='opaque'>Opaque</option>
              <option value='opaque luster'>Opaque Luster</option>
              <option value='transparent'>Transparent</option>
              <option value='aurora borealis'>Aurora Borealis</option>
              <option value='plain'>Plain</option>
            </select>
          </div>
          <div>
            <label>Shape</label>
            <select
              name='beadShape'
              placeholder='Shape'
              defaultValue='round'
            >
              <option value='' disabled>Select shape</option>
              <option value='round'>Round</option>
              <option value='faceted round'>Faceted Round</option>
              <option value='rondelle'>Rondelle</option>
              <option value='drop'>Drop</option>
              <option value='bicone'>Bicone/Diamond</option>
              <option value='rivoli'>Rivoli</option>
              <option value='chaton'>Chaton</option>
              <option value='other'>Other</option>
            </select>
          </div>
          <div>
            <label>Color</label>
            <input name='beadColor' placeholder='Color' required />
          </div>
          <div>
            <label>Width</label>
            <input name='beadWidth' placeholder='Width in mm' />
          </div>
          <div>
            <label>Height</label>
            <input name='beadHeight' placeholder='Height in mm' />
          </div>
          <div>
            <label>Depth</label>
            <input name='beadDepth' placeholder='Depth in mm' />
          </div>
        </div>
      </fieldset>

      <fieldset disabled={type !== 'tile'}>
        <legend>Tile Details</legend>
        <div>
          <div>
            <label>Color</label>
            <input name='tileColor' placeholder='Color' required />
          </div>
          <div>
            <label>Width</label>
            <input name='tileWidth' placeholder='Width in mm' />
          </div>
          <div>
            <label>Height</label>
            <input name='tileHeight' placeholder='Height in mm' />
          </div>
          <div>
            <label>Depth</label>
            <input name='tileDepth' placeholder='Depth in mm' />
          </div>
        </div>
      </fieldset>

      <fieldset disabled={type !== 'substrate'}>
        <legend>Substrate Details</legend>
        <div>
          <div>
            <label>Outside Contour</label>
            <select
              name='substrateOutsideId'
              onChange={(evt) => setOutsideId( evt.target.value )}
              required
            >
              <option value='' disabled>Select outside contour</option>
              {contourList.map( (contour) => (
                <option key={`oc-${contour.id}`} value={contour.id}>{contour.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label>Inside Contour</label>
            <select
              name='substrateInsideId'
              onChange={(evt) => setInsideId( evt.target.value )}
              defaultValue=''
            >
              <option value=''>Select inside contour</option>
              {contourList.map( (contour) => (
                <option key={`ic-${contour.id}`} value={contour.id}>{contour.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label>Rabbet Contour</label>
            <select
              name='substrateRabbetId'
              onChange={(evt) => setRabbetId( evt.target.value )}
              defaultValue=''
            >
              <option value=''>Select rabbet contour</option>
              {contourList.map( (contour) => (
                <option key={`rc-${contour.id}`} value={contour.id}>{contour.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label>Width</label>
            <input name='substrateWidth' placeholder='Width in inches' required />
          </div>
          <div>
            <label>Height</label>
            <input name='substrateHeight' placeholder='Height in inches' required />
          </div>
          <div>
            <label>Depth</label>
            <input name='substrateDepth' placeholder='Depth in inches' defaultValue='0.455' />
          </div>
          <div>
            <label>Border</label>
            <input name='substrateBorder' placeholder='Border in inches' defaultValue='1' />
          </div>
        </div>
      </fieldset>

      <button type='submit'>Create</button>
    </form>
  )
}