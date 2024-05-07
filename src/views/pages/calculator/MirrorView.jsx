import Dimensions from 'src/views/pages/calculator/Dimensions'

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

export default function MirrorView( {mirror, settings} )
{
  if( 'undefined' === typeof mirror.outside )
    return <></>

  const center = mirror.outside.dims.center
  const zoom = 110 - settings.zoom
  const viewBox = `${center.x - zoom/2} ${center.y - zoom/2} ${zoom} ${zoom}`
  const substrate = `${mirror.outside.data} ${mirror.inside.data}`

  return (
    <div
      style={{
        position: 'relative',
        top: 0,
        left: 0,
        border: '1px solid black',
        width: 500,
        height: 500}}
    >
      <svg
        style={{
          position: 'absolute',
          top: 0,
          bottom: 0,
          left: 0,
          right: 0
        }}
        version='1.1'
        xmlns='http://www.w3.org/2000/svg'
        xmlnsXlink='http://www.w3.org/1999/xlink'
        width='500'
        height='500'
        viewBox={viewBox}
        transform={settings.showBack ? 'scale(-1 1)' : ''}
      >
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

        { settings.showBack && <Path
          fill='#eda'
          stroke='0.125'
          color='#666'
          data={substrate}
        />}
        { settings.showGlass && <Path
          fill={settings.showBack ? 'url(#mirrorBackGrad)' : 'url(#mirrorFrontGrad)'}
          stroke='0.05'
          color='#888'
          data={mirror.glass.data}
        />}
        { settings.showBack ?
          <Path fill='none' stroke='0.075' color='#ba7' data={mirror.rabbet.data} />
          :
          <Path fill='#eda' stroke='0.125' color='#666' data={substrate} />
        }
      </svg>

      { (settings.showDims & 1) === 1 && <Dimensions
        dims={mirror.outside.dims}
        origin={center}
        zoom={settings.zoom}
        isFlipped={settings.showBack}
      />}
      { (settings.showDims & 2) === 2 && <Dimensions
        dims={settings.showBack && settings.showGlass ? mirror.glass.dims : mirror.inside.dims}
        origin={center}
        zoom={settings.zoom}
        isFlipped={settings.showBack}
        color='blue'
      />}
    </div>
  )
}