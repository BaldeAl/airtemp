// Places.js
import { useState, useEffect } from 'react';
import Place from './Place';


const Places = () => {
  const [places, setPlaces] = useState([]);
  const [searchValue, setSearchValue] = useState('');

  useEffect(() => {
    fetch('/api/places/')
      .then(res => res.json())
      .then(data => setPlaces(data));
  }, []);

  const handleSearchChange = (event) => {
    setSearchValue(event.target.value);
  };

  const filteredPlaces = places.filter(place =>
    place.name.toLowerCase().includes(searchValue.toLowerCase()) ||
    place.city.name.toLowerCase().includes(searchValue.toLowerCase())
  );
console.log(places, filteredPlaces);
  if (!places) {
    return <div>Loading...</div>;
  }

  return (
    <div className='flex min-h-[calc(100vh-100px)] flex-col items-center'>
      <input 
        className="border border-gray-300 rounded-md px-4 py-2 mb-4 w-200
        focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent" 
        type="text" 
        placeholder="Search..." 
        value={searchValue}
        onChange={handleSearchChange} 
      />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredPlaces.map(place => <Place key={place.id} place={place} />)}
        {console.log(Place.id)}
      </div>
    </div>
  );
}

export default Places;

