import axios from 'axios';
import { useEffect, useState } from 'react';

export default function Stores() {
  const [stores, setStores] = useState( [] );
  const [errorMessage, setErrorMessage] = useState( '' );
  useEffect(() => {
    axios
      .get( '/api/stores' )
      .then( ({ data }) => {
        setStores(data.stores);
      } )
      .catch( (error) => {
        let message;
        if( error.response )
        {
          message = error.response.data.message;
        }
        else
        {
          message = error.message;
        }
        setErrorMessage( message );
      } );
  }, [] );

  return (
    <div className="p-6">
      <div>
        <h1 className="mb-4 text-lg">Stores:</h1>
        {errorMessage && <p className="text-red-500">{errorMessage}</p>}
        {stores.map((store) => (
          <p>
            {store.name} ({store.url}) | {store.email} {store.phone}
          </p>
        ))}
      </div>
    </div>
  );
}
