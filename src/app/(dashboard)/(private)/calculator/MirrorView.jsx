'use client'

import { useEffect, useRef } from 'react'

import BorderSize from './BorderSize'
import Dimensions from './Dimensions'

// How much settings.zoom (0-100, same range as MirrorToolbar's Slider)
// moves per wheel "tick". A fixed step rather than scaling off
// e.deltaY directly - deltaY's magnitude varies wildly between a mouse
// wheel and a trackpad, so scaling off it makes the zoom speed
// inconsistent across input devices.
const WHEEL_ZOOM_STEP = 2

// Renders the assembled mirror's SVG preview (frame/substrate, glass,
// rabbet) plus optional dimension callouts. Ported from the old console
// app - the two front/back variants (MirrorView.jsx/MirrorView2.jsx) were
// consolidated into this single component with a `settings.showBack` flag,
// since that was the only real difference between them.
function Path( {fill, color, stroke, data, transform} )
{
  return (
    <path
      fill={fill}
      stroke={color}
      strokeWidth={stroke}
      strokeLinecap='round'
      strokeLinejoin='round'
      strokeOpacity='1'
      transform={transform}
      d={data}
    />
  )
}

export default function MirrorView( {mirror, settings, onSettingsChange, imageRef, size = 500} )
{
  // Separate from imageRef (which SnapshotDialog reads for PNG export) -
  // this one's just for attaching the wheel listener below, on the same
  // outer element regardless of what imageRef happens to be pointed at
  // by a given caller (some pass a real ref, some a dummy one - see
  // WorkingPanelReport.jsx).
  const containerRef = useRef( null )

  // Wheel-to-zoom is opt-in via onSettingsChange - callers that only
  // ever render a static preview (report pages, lightbox thumbnails)
  // don't pass it, so this just never attaches anything for them.
  //
  // Added as a native, non-passive listener via a ref rather than
  // React's onWheel prop: React registers wheel handlers as passive by
  // default (matching the browser's own scroll-performance default),
  // which silently ignores preventDefault() - without it, scrolling to
  // zoom the preview would also scroll the whole page underneath it.
  useEffect( () => {
    const el = containerRef.current
    if( !el || !onSettingsChange )
      return undefined

    function handleWheel( e )
    {
      e.preventDefault()

      const current = typeof settings.zoom === 'number' ? settings.zoom : 65
      const direction = e.deltaY < 0 ? 1 : -1
      const next = Math.min( 100, Math.max( 0, current + direction * WHEEL_ZOOM_STEP ) )

      if( next !== current )
        onSettingsChange( {...settings, zoom: next} )
    }

    el.addEventListener( 'wheel', handleWheel, {passive: false} )
    return () => el.removeEventListener( 'wheel', handleWheel )
    // `mirror` is included even though the handler doesn't read it -
    // containerRef.current is null while the "Loading..." branch below
    // is rendered (no element for the ref to attach to yet), so the
    // effect needs to re-run once mirror actually resolves, not just
    // when settings/onSettingsChange happen to change.
  }, [settings, onSettingsChange, mirror] )

  if( !(mirror && mirror.outside) )
    return <div>Loading...</div>

  const center = mirror.outside.dims.center
  const zoom = 110 - settings.zoom
  const viewBox = `${center.x - zoom/2} ${center.y - zoom/2} ${zoom} ${zoom}`
  const subSVG = `${mirror.outside.data} ${mirror.inside.data}`

  return (
    <div ref={containerRef} style={{border: '1px solid var(--mui-palette-divider)', padding: 0, width: size, maxWidth: '100%'}}>
      <div
        ref={imageRef}
        style={{
          position: 'relative',
          boxSizing: 'content-box',
          top: 0,
          left: 0,
          width: '100%',
          aspectRatio: '1 / 1'
        }}
      >
        <svg
          style={{position: 'absolute', top: 0, bottom: 0, left: 0, right: 0}}
          version='1.1'
          xmlns='http://www.w3.org/2000/svg'
          xmlnsXlink='http://www.w3.org/1999/xlink'
          width='100%'
          height='100%'
          viewBox={viewBox}
        >
          {/* This <g> element is necessary because the transform property is
              not officially supported on the root <svg> element. */}
          <g transform={settings.showBack ? `scale(-1 1) translate(${-2*center.x} 0)` : ''}>
            <defs>
              <linearGradient id='mirrorBackGrad' x1='0%' y1='0%' x2='100%' y2='100%'>
                <stop offset='0%' stopColor='#bbb' stopOpacity='1' />
                <stop offset='100%' stopColor='#aaa' stopOpacity='1' />
              </linearGradient>

              <linearGradient id='mirrorFrontGrad' x1='0%' y1='10%' x2='100%' y2='90%'>
                <stop offset='0%' stopColor='#aaa' stopOpacity='1' />
                <stop offset='55%' stopColor='#eee' stopOpacity='1' />
                <stop offset='60%' stopColor='#eee' stopOpacity='1' />
                <stop offset='100%' stopColor='#bbb' stopOpacity='1' />
              </linearGradient>
            </defs>

            { settings.showBack && <Path fill='#eda' stroke='0.125' color='#666' data={subSVG} />}
            { settings.showGlass && <Path
              fill={settings.showBack ? 'url(#mirrorBackGrad)' : 'url(#mirrorFrontGrad)'}
              stroke='0.05'
              color='#888'
              data={mirror.glass.data}
            />}
            { settings.showBack ?
              <Path fill='none' stroke='0.075' color='#ba7' data={mirror.rabbet.data} />
              :
              <Path fill='#eda' stroke='0.125' color='#666' data={subSVG} />
            }
          </g>
        </svg>

        { /* mirror.outside/inside/glass.dims can be undefined for a degenerate
             shape (e.g. a border wide enough to buffer the inside contour
             down to nothing) - skip the overlay rather than crash. */ }
        { (settings.showDims & 1) === 1 && mirror.outside.dims && <Dimensions
          labelAnchor={{x: mirror.outside.dims.left.x, y: mirror.outside.dims.bottom.y}}
          dims={mirror.outside.dims}
          origin={center}
          zoom={settings.zoom}
          isFlipped={settings.showBack}
          width={size}
          height={size}
        />}
        { (settings.showDims & 2) === 2 && mirror.outside.dims && (settings.showBack && settings.showGlass ? mirror.glass.dims : mirror.inside.dims) && <Dimensions
          labelAnchor={{x: mirror.outside.dims.right.x, y: mirror.outside.dims.top.y}}
          dims={settings.showBack && settings.showGlass ? mirror.glass.dims : mirror.inside.dims}
          origin={center}
          zoom={settings.zoom}
          isFlipped={settings.showBack}
          color='blue'
          width={size}
          height={size}
        />}
        { (settings.showDims & 4) === 4 && mirror.outside.dims && <BorderSize
          fixed={mirror.border.fixed}
          max={mirror.border.max.distance}
          min={mirror.border.min.distance}
          width={size}
          height={size}
        />}
      </div>
    </div>
  )
}
