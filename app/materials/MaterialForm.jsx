'use client'

import { redirect } from 'next/navigation'
import { useState } from 'react'
import { z } from 'zod'
import { useFormSubmit } from '@/util/formSubmitHook'
import { createMaterial, updateMaterial } from '@/db/actions/material'

const optionalPositiveNumber = z.preprocess(
  (val) => (val === '' || val == null ? undefined : val),
  z.coerce.number().optional()
)

const schema = z.object({
  id: optionalPositiveNumber,
  name: z.string().min( 1 ),
  type: z.enum( ['bead', 'birdhouse', 'frame', 'grout', 'millefiori', 'mirror', 'substrate', 'tile', 'other'] ),
  sku: z.string().min( 1 ),
  units: z.string().optional(),
  weight: optionalPositiveNumber,
  description: z.string().optional(),

  beadInfo: z.object({
    category: z.enum( ['glass', 'plastic', 'ceramic', 'shell', 'metal', 'rhinestone', 'cabochon', 'other'] ).optional(),
    finish: z.enum( ['fire-polished', 'silvered', 'opaque', 'opaque luster', 'transparent', 'aurora borealis', 'plain'] ).optional(),
    shape: z.enum( ['round', 'faceted round', 'bicone', 'drop', 'rondelle', 'rivoli', 'chaton', 'other'] ).optional(),
    color: z.string().min( 1 ),
    length: optionalPositiveNumber,
    height: optionalPositiveNumber,
    thickness: optionalPositiveNumber
  }).optional(),

  frameInfo: z.object({
    width: optionalPositiveNumber,
    height: optionalPositiveNumber,
    thickness: optionalPositiveNumber,
    channel: optionalPositiveNumber,
    border: optionalPositiveNumber,
    photoWidth: optionalPositiveNumber,
    photoHeight: optionalPositiveNumber,
  }).optional(),

  millefioriInfo: z.object({
    shape: z.enum( ['round', 'square'] ).optional(),
    color: z.string().min( 1 ),
    length: optionalPositiveNumber,
    width: optionalPositiveNumber,
    height: optionalPositiveNumber,
  }).optional(),

  mirrorInfo: z.object({
    shape: z.enum( ['chapel arch', 'circle', 'gothic arch', 'oval', 'rectangle', 'square', 'vesica picscis', 'other'] ).optional(),
    width: optionalPositiveNumber,
    height: optionalPositiveNumber,
    thickness: optionalPositiveNumber,
    bevel: optionalPositiveNumber,
  }).optional(),

  substrateInfo: z.object({
    outsideId: z.coerce.number().int(),
    insideId: z.coerce.number().int().optional(),
    rabbetId: z.coerce.number().int().optional(),
    width: optionalPositiveNumber,
    height: optionalPositiveNumber,
    thickness: optionalPositiveNumber,
    border: optionalPositiveNumber,
  }).optional(),

  tileInfo: z.object({
    color: z.string().min( 1 ),
    width: optionalPositiveNumber,
    height: optionalPositiveNumber,
    thickness: optionalPositiveNumber,
  }).optional(),
})

export default function MaterialForm( {contourList, initialData={}} )
{
  const isEdit = Boolean( initialData?.id )
  const [type, setType] = useState( initialData?.type )
  const { handleSubmit, loading, errors, success } = useFormSubmit({
    schema,
    onSubmit: isEdit ? updateMaterial : createMaterial
  })

  if( success )
    redirect( '/materials' )

  return(
    <form onSubmit={handleSubmit}>
      <h1>{isEdit ? 'Update' : 'Create'} Material</h1>

      {success && <p>Material {isEdit ? 'updated' : 'created'} successfully</p>}
      {errors && <pre>{JSON.stringify( errors, null, 2 )}</pre>}

      {isEdit && <input type='hidden' name='id' value={initialData?.id} />}

      <div>
        <label>Name</label>
        <input
          name='name'
          defaultValue={initialData?.name || ''}
          required />
      </div>

      <div>
        <label>Type</label>
        <select
          name='type'
          placeholder='Type'
          defaultValue={initialData?.type || ''}
          onChange={(evt) => setType( evt.target.value )}
        >
          <option value='' disabled>Select Type</option>
          <option value='bead'>Bead</option>
          <option value='birdhouse'>Birdhouse</option>
          <option value='frame'>Frame</option>
          <option value='grout'>Grout</option>
          <option value='millefiori'>Millefiori</option>
          <option value='mirror'>Mirror</option>
          <option value='substrate'>Substrate</option>
          <option value='tile'>Tile</option>
          <option value='other'>Other</option>
        </select>
      </div>

      <div>
        <label>SKU</label>
        <input
          name='sku'
          defaultValue={initialData?.sku || ''}
          required />
      </div>

      <div>
        <label>Units</label>
        <input
          name='units'
          defaultValue={initialData?.units || 'each'}
        />
      </div>

      <div>
        <label>Weight</label>
        <input
          name='weight'
          defaultValue={initialData?.weight || ''}
        />
      </div>

      <div>
        <label>Description</label>
        <textarea
          name='description'
          defaultValue={initialData?.description || ''}
        />
      </div>

      { type === 'bead' && (
        <fieldset>
          <legend>Bead Details</legend>
          <div>
            <div>
              <label>Category</label>
              <select
                name='beadInfo.category'
                defaultValue={initialData?.beadInfo?.category || 'plastic'}
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
                name='beadInfo.finish'
                defaultValue={initialData?.beadInfo?.finish || 'plain'}
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
                name='beadInfo.shape'
                defaultValue={initialData?.beadInfo?.shape || 'round'}
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
              <input
                name='beadInfo.color'
                defaultValue={initialData?.beadInfo?.color || ''}
                required />
            </div>
            <div>
              <label>Length</label>
              <input
                name='beadInfo.length'
                defaultValue={initialData?.beadInfo?.length || ''}
              />
            </div>
            <div>
              <label>Height</label>
              <input
                name='beadInfo.height'
                defaultValue={initialData?.beadInfo?.height || ''}
              />
            </div>
            <div>
              <label>Thickness</label>
              <input
                name='beadInfo.thickness'
                defaultValue={initialData?.beadInfo?.thickness || ''}
              />
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
              <input
                name='frameInfo.width'
                defaultValue={initialData?.frameInfo?.width || ''}
              />
            </div>
            <div>
              <label>Height</label>
              <input
                name='frameInfo.height'
                defaultValue={initialData?.frameInfo?.height || ''}
              />
            </div>
            <div>
              <label>Thickness</label>
              <input
                name='frameInfo.thickness'
                defaultValue={initialData?.frameInfo?.thickness || ''}
              />
            </div>
            <div>
              <label>Channel</label>
              <input
                name='frameInfo.channel'
                defaultValue={initialData?.frameInfo?.channel}
              />
            </div>
            <div>
              <label>Border</label>
              <input
                name='frameInfo.border'
                defaultValue={initialData?.frameInfo?.border || '1'}
              />
            </div>
            <div>
              <label>Photo Width</label>
              <input
                name='frameInfo.photoWidth'
                defaultValue={initialData?.frameInfo?.photoWidth || 4}
              />
            </div>
            <div>
              <label>Photo Height</label>
              <input
                name='frameInfo.photoHeight'
                defaultValue={initialData?.frameInfo?.photoHeight || 6}
              />
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
                name='millefioriInfo.shape'
                defaultValue={initialData?.millefioriInfo?.shape || 'round'}
              >
                <option value='' disabled>Select shape</option>
                <option value='round'>Round</option>
                <option value='square'>Square</option>
              </select>
            </div>
            <div>
              <label>Color</label>
              <input
                name='millefioriInfo.color'
                defaultValue={initialData?.millefioriInfo?.color || ''}
              />
            </div>
            <div>
              <label>Length</label>
              <input
                name='millefioriInfo.length'
                defaultValue={initialData?.millefioriInfo?.length || ''}
              />
            </div>
            <div>
              <label>Width</label>
              <input
                name='millefioriInfo.width'
                defaultValue={initialData?.millefioriInfo?.width || ''}
              />
            </div>
            <div>
              <label>Height</label>
              <input
                name='millefioriInfo.height'
                defaultValue={initialData?.millefioriInfo?.height || ''}
              />
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
                name='mirrorInfo.shape'
                defaultValue={initialData?.mirrorInfo?.shape || 'circle'}
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
              <input
                name='mirrorInfo.width'
                defaultValue={initialData?.mirrorInfo?.width || ''}
              />
            </div>
            <div>
              <label>Height</label>
              <input
                name='mirrorInfo.height'
                defaultValue={initialData?.mirrorInfo?.height || ''}
              />
            </div>
            <div>
              <label>Thickness</label>
              <input
                name='mirrorInfo.thickness'
                defaultValue={initialData?.mirrorInfo?.thickness || ''}
              />
            </div>
            <div>
              <label>Bevel</label>
              <input
                name='mirrorInfo.bevel'
                defaultValue={initialData?.mirrorInfo?.bevel || 0}
              />
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
                name='substrateInfo.outsideId'
                defaultValue={initialData?.substrateInfo?.outsideId || ''}
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
                name='substrateInfo.insideId'
                defaultValue={initialData?.substrateInfo?.insideId || ''}
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
                name='substrateInfo.rabbetId'
                defaultValue={initialData?.substrateInfo?.rabbetId || ''}
              >
                <option value=''>Select rabbet contour</option>
                {contourList.map( (contour) => (
                  <option key={`rc-${contour.id}`} value={contour.id}>{contour.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label>Width</label>
              <input
                name='substrateInfo.width'
                defaultValue={initialData?.substrateInfo?.width || ''}
              />
            </div>
            <div>
              <label>Height</label>
              <input
                name='substrateInfo.height'
                defaultValue={initialData?.substrateInfo?.height || ''}
              />
            </div>
            <div>
              <label>Thickness</label>
              <input
                name='substrateInfo.thickness'
                defaultValue={initialData?.substrateInfo?.thickness || '0.455'}
              />
            </div>
            <div>
              <label>Border</label>
              <input
                name='substrateInfo.border'
                defaultValue={initialData?.substrateInfo?.border || '1'}
              />
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
              <input
                name='tileInfo.color'
                defaultValue={initialData?.tileInfo?.color || ''}
                required />
            </div>
            <div>
              <label>Width</label>
              <input
                name='tileInfo.width'
                defaultValue={initialData?.tileInfo?.width || ''}
              />
            </div>
            <div>
              <label>Height</label>
              <input
                name='tileInfo.height'
                defaultValue={initialData?.tileInfo?.height || ''}
              />
            </div>
            <div>
              <label>Thickness</label>
              <input
                name='tileInfo.thickness'
                defaultValue={initialData?.tileInfo?.thickness || ''}
              />
            </div>
          </div>
        </fieldset>
      )}

      <button type='submit' disabled={loading}>
        {isEdit ? 'Update' : 'Create'}
      </button>
    </form>
  )
}