import { useState } from 'react'

export default function ContourForm( {contourData, onSubmit} )
{
  const [contour, setContour] = useState( contourData || {name: '', svgData: ''} )

  function handleChange( e )
  {
    setContour( {...contour, [e.target.name]: e.target.value} )
  }

  function handleSubmit( e )
  {
    e.preventDefault();
    onSubmit( contour )
  }

  return (
    <form onSubmit={handleSubmit}>
      <input type='text' name='name' value={contour.name} onChange={handleChange} placeholder='Name' required />
      <textarea name='svgData' value={contour.svgData} onChange={handleChange} placeholder='SVG Data' />
      <button type='submit'>Save Contour</button>
    </form>
  )
}
