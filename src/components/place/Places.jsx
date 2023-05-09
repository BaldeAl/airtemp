import Image from "next/image";


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

    useEffect(() => {
        fetch('http://localhost:3000/api/places')
            .then(res => res.json())
            .then(data => setPlaces(data));
    }, []);

    if (!places) {
        return <div>Loading...</div>;
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {places.map(place => (
                
                <a key={place.id} href={`/place/${place.id}`}>
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
            ))}
        </div>
    );
}

export default Places;


