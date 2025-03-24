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
  const [type, setType] = useState( '' )
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
        <input name='weight' placeholder='Weight in lbs' />
      </div>

      <div>
        <label>Description</label>
        <textarea name='description' placeholder='Description' />
      </div>

      { type === 'bead' && (
        <fieldset>
          <legend>Bead Details</legend>
          <div>
            <div>
              <label>Category</label>
              <select
                name='category'
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
                name='finish'
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
                name='shape'
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
              <input name='color' placeholder='Color' required />
            </div>
            <div>
              <label>Length</label>
              <input name='length' placeholder='Length in mm' />
            </div>
            <div>
              <label>Height</label>
              <input name='height' placeholder='Width in mm' />
            </div>
            <div>
              <label>Thickness</label>
              <input name='thickness' placeholder='Thickness in mm' />
            </div>
          </div>
        </fieldset>
      )}

      { type === 'tile' && (
        <fieldset>
          <legend>Tile Details</legend>
          <div>
            <div>
              <label>Color</label>
              <input name='color' placeholder='Color' required />
            </div>
            <div>
              <label>Width</label>
              <input name='width' placeholder='Width in mm' />
            </div>
            <div>
              <label>Height</label>
              <input name='height' placeholder='Height in mm' />
            </div>
            <div>
              <label>Thickness</label>
              <input name='thickness' placeholder='Thickness in mm' />
            </div>
          </div>
        </fieldset>
      )}

      { type === 'substrate' && (
        <fieldset>
          <legend>Substrate Details</legend>
          <div>
            <div>
              <label>Outside Contour</label>
              <select
                name='outsideId'
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
                name='insideId'
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
                name='rabbetId'
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
              <input name='width' placeholder='Width in inches' required />
            </div>
            <div>
              <label>Height</label>
              <input name='height' placeholder='Height in inches' required />
            </div>
            <div>
              <label>Thickness</label>
              <input name='thickness' placeholder='Thickness in inches' defaultValue='0.455' />
            </div>
            <div>
              <label>Border</label>
              <input name='border' placeholder='Border in inches' defaultValue='1' />
            </div>
          </div>
        </fieldset>
      )}

      { type === 'millefiori' && (
        <fieldset>
          <legend>Millefiori Details</legend>
          <div>
            <div>
              <label>Shape</label>
              <select
                name='shape'
                placeholder='Shape'
                defaultValue='round'
              >
                <option value='' disabled>Select shape</option>
                <option value='round'>Round</option>
                <option value='square'>Square</option>
              </select>
            </div>
            <div>
              <label>Color</label>
              <input name='color' placeholder='Color' required />
            </div>
            <div>
              <label>Length</label>
              <input name='length' placeholder='Length in mm' />
            </div>
            <div>
              <label>Width</label>
              <input name='width' placeholder='Width in mm' />
            </div>
            <div>
              <label>Height</label>
              <input name='height' placeholder='Height in mm' />
            </div>
          </div>
        </fieldset>
      )}

      { type === 'mirror' && (
        <fieldset>
          <legend>Mirror Details</legend>
          <div>
            <div>
              <label>Shape</label>
              <select
                name='shape'
                placeholder='Shape'
                defaultValue='circle'
              >
                <option value='' disabled>Select shape</option>
                <option value='chapel arch'>Chapel Arch</option>
                <option value='circle'>Circle</option>
                <option value='gothic arch'>Gothic Arch</option>
                <option value='oval'>Oval</option>
                <option value='rectangle'>Rectangle</option>
                <option value='square'>Square</option>
                <option value='vesica piscis'>Vesica Piscis</option>
                <option value='other'>Other</option>
              </select>
            </div>
            <div>
              <label>Width</label>
              <input name='width' placeholder='Width in inches' />
            </div>
            <div>
              <label>Height</label>
              <input name='height' placeholder='Height in inches' />
            </div>
            <div>
              <label>Thickness</label>
              <input name='thickness' placeholder='Thickness in inches' />
            </div>
            <div>
              <label>Bevel</label>
              <input name='bevel' placeholder='Bevel size in inches' required />
            </div>
          </div>
        </fieldset>
      )}

      { type === 'frame' && (
        <fieldset>
          <legend>Frame Details</legend>
          <div>
            <div>
              <label>Width</label>
              <input name='width' placeholder='Width in inches' />
            </div>
            <div>
              <label>Height</label>
              <input name='height' placeholder='Height in inches' />
            </div>
            <div>
              <label>Thickness</label>
              <input name='thickness' placeholder='Thickness in inches' />
            </div>
            <div>
              <label>Channel</label>
              <input name='channel' placeholder='Channel size in inches' />
            </div>
            <div>
              <label>Border</label>
              <input name='border' placeholder='Channel border in inches' />
            </div>
            <div>
              <label>Photo Width</label>
              <input name='photoWidth' placeholder='Photo width in inches' />
            </div>
            <div>
              <label>Photo Height</label>
              <input name='photoHeight' placeholder='Photo height in inches' required />
            </div>
          </div>
        </fieldset>
      )}

      <button type='submit'>Create</button>
    </form>
  )
}