import {useState, useEffect} from 'react'
import ContourForm from 'src/pages/components/models/ContourForm'

export default function ContourList()
{
  const [contours, setContours] = useState( [] )
  const [editingContour, setEditingContour] = useState( null )

  useEffect( () =>
  {
    fetch( '/api/contours' )
      .then( (res) => res.json() )
      .then( setContours )
  }, [] );

  function handleDelete( id )
  {
    fetch( `/api/contours/${id}`, {method: 'DELETE'} )
      .then( () => setContours( contours.filter( p => p.id !== id ) ) )
  }

  function handleAddOrUpdate( contour )
  {
    const method = contour.id ? 'PUT' : 'POST'
    const url = contour.id ? `/api/contours/${contour.id}` : '/api/contours'
    
    fetch( url,
      {
        method,
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify( contour ),
      }
    )
    .then( res => res.json() )
    .then( data =>
      {
        if( 'POST' === method )
          setContours( [...contours, data] )
        else
          setContours( contours.map( p => p.id === data.id ? data : p ) )

        setEditingContour( null )
      }
    )
  }

  return (
    <div>
      {editingContour ? (
        <ContourForm contourData={editingContour} onSubmit={handleAddOrUpdate} />
      ) : (
        <button onClick={() => setEditingContour({})}>Add Contour</button>
      )}
      <ul>
        {contours.map( contour => (
          <li key={contour.id}>
            {contour.name} - SVG Data: {contour.svgData}
            <button onClick={() => setEditingContour( contour )}>Edit</button>
            <button onClick={() => handleDelete( contour.id )}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
