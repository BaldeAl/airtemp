import Image from "next/image";
import Link from "next/link";


import { useState, useEffect } from 'react';

/* 
const Place = ({ id }) => {
    const [place, setPlace] = useState(null);

    useEffect(() => {
        fetch(`http://localhost:3000/api/places/1`)
        .then(res => res.json())
        .then(data => setPlace(data))
        
    }, [id]);

    if (!place) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            <a href={`/api/places/${place.id}`}>
                <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                    <div className="relative pb-48 overflow-hidden">
                        <Image 
                            className="absolute inset-0 h-full w-full object-cover"
                            src={place.image} 
                            alt={place.name}
                            width={500}
                            height={500}
                        />
                    </div>
                    <div className="p-4">
                        <h3>{place.name}</h3>
                        <p>{place.city.name}</p>
                        <p>{place.priceByNight}€/night</p>
                    </div>
                </div>
            </a>
        </div>
    );
}
 
export default Place; */

const Places = () => {
    const [places, setPlaces] = useState([]);
    const [searchValue, setSearchValue] = useState('');


    useEffect(() => {
        fetch('/api/places')
            .then(res => res.json())
            .then(data => setPlaces(data));
    }, []);
//la fonction pour rechercher la valeur
    const handleSearchChange = (event) => {
        setSearchValue(event.target.value);
    };

//fonction pour filtrer les places en fonction de la recherche qu'on effectue
    const filteredPlaces = places.filter(place =>
        place.name.toLowerCase().includes(searchValue.toLowerCase())
    );
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
        

            {filteredPlaces.map(place => (
                
                <Link key={place.id} href={`/place/${place.id}`}>
                    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                        <div className="relative pb-48 overflow-hidden">
                            <Image 
                                className="absolute inset-0 h-full w-full object-cover"
                                src={place.image} 
                                alt={place.name}
                                width={500}
                                height={500}
                            />
                        </div>
                        <div className="p-4">
                            <h3 className="text-lg font-medium text-gray-900 truncate">{place.name}</h3>
                            <p className="text-sm font-medium text-gray-500">{place.city.name}</p>
                            <p className="text-sm font-medium text-gray-500">{place.priceByNight}€/night</p>
                        </div>
                    </div>
                </Link>
            ))}
        </div>
        </div>
    );
}

export default Places;


