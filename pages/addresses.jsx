import axios from 'axios';
import { useEffect, useState } from 'react';

export default function Addresses() {
  const [addresses, setAddresses] = useState( [] );
  const [errorMessage, setErrorMessage] = useState( '' );
  useEffect(() => {
    axios
      .get( '/api/addresses' )
      .then( ({ data }) => {
        setAddresses(data.addresses);
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
        <h1 className="mb-4 text-lg">Addresses:</h1>
        {errorMessage && <p className="text-red-500">{errorMessage}</p>}
        {addresses.map((address) => (
          <p>
            {address.name} | {address.company} |
            {address.line1} {address.line2} {address.line3} |
            {address.city} {address.state} {address.postal_code} {address.country}
          </p>
        ))}
      </div>
    </div>
  );
}
