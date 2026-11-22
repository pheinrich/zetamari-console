'use client'

import { useRef, useState } from 'react'

import { toast } from 'react-toastify'

import Button from '@mui/material/Button'
import LinearProgress from '@mui/material/LinearProgress'
import Typography from '@mui/material/Typography'

import { createImages, prepareImageUploads } from '@/db/actions/productImage'

const isFileDrag = e => Array.from( e.dataTransfer?.types ?? [] ).includes( 'Files' )

// Dashed drop target (plus an Upload button) for image files. Each file
// goes straight from the browser to S3 on a presigned PUT, then gets an
// Image row; onUploaded( images ) receives the new Images, in
// readImages()'s shape.
export default function ImageDropZone( {onUploaded} )
{
  const [active, setActive] = useState( false )
  const [uploading, setUploading] = useState( null )   // {done, total}
  const fileInput = useRef( null )
  const depth = useRef( 0 )

  async function upload( fileList )
  {
    const files = Array.from( fileList ).filter( f => f.type.startsWith( 'image/' ) )

    if( !files.length )
      return toast.error( 'Only image files can be uploaded' )

    setUploading( {done: 0, total: files.length} )

    try
    {
      const prepared = await prepareImageUploads( files.map( f => ({name: f.name, type: f.type, size: f.size}) ) )

      if( prepared.error )
        return toast.error( prepared.error )

      const done = []

      for( const [i, up] of prepared.uploads.entries() )
      {
        const response = await fetch( up.uploadUrl, {method: 'PUT', headers: {'Content-Type': up.contentType}, body: files[i]} )

        if( !response.ok )
        {
          toast.error( `Upload of ${up.name} failed (${response.status})` )
          continue
        }

        done.push( up.url )
        setUploading( {done: done.length, total: files.length} )
      }

      if( !done.length )
        return

      const result = await createImages( done )

      if( result.error )
        return toast.error( result.error )

      toast.success( `Uploaded ${done.length} image${done.length === 1 ? '' : 's'}` )
      await onUploaded?.( result.images )
    }
    catch( error )
    {
      // A browser PUT blocked by the bucket's CORS lands here
      toast.error( `Upload failed: ${error.message}` )
    }
    finally
    {
      setUploading( null )
    }
  }

  function enter( e )
  {
    if( !isFileDrag( e ) )
      return

    e.preventDefault()
    depth.current++
    setActive( true )
  }

  function leave()
  {
    if( --depth.current <= 0 )
    {
      depth.current = 0
      setActive( false )
    }
  }

  function drop( e )
  {
    e.preventDefault()
    depth.current = 0
    setActive( false )

    if( e.dataTransfer.files?.length )
      upload( e.dataTransfer.files )
  }

  return (
    <div
      onDragEnter={enter}
      onDragOver={e => isFileDrag( e ) && e.preventDefault()}
      onDragLeave={leave}
      onDrop={drop}
      className='flex flex-col items-center justify-center gap-3 rounded p-6 transition-colors'
      style={{
        border: `2px dashed var(--mui-palette-${active ? 'primary-main' : 'divider'})`,
        backgroundColor: active ? 'var(--mui-palette-primary-lightOpacity)' : 'transparent',
      }}
    >
      <i className={`ri-upload-cloud-2-line text-4xl ${active ? 'text-primary' : 'text-textSecondary'}`} />
      <Typography color={active ? 'primary' : 'text.secondary'}>
        {active ? 'Release to upload' : 'Drop image file(s) here'}
      </Typography>
      <Button variant='outlined' onClick={() => fileInput.current?.click()} disabled={Boolean( uploading )}>Upload</Button>
      <input
        ref={fileInput}
        type='file'
        accept='image/*'
        multiple
        hidden
        onChange={e => {
          upload( e.target.files )
          e.target.value = ''
        }}
      />
      {uploading && (
        <div className='is-full max-is-[320px]'>
          <LinearProgress variant='determinate' value={(uploading.done / uploading.total) * 100} />
          <Typography variant='caption' color='text.secondary'>Uploading {uploading.done} of {uploading.total}…</Typography>
        </div>
      )}
    </div>
  )
}
