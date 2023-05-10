// PlaceDetails.js
import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import Image from "next/image";
import Loading from "../loading/Loading";

const PlaceDetails = () => {
  const router = useRouter();
  const { id } = router.query;
  const [place, setPlace] = useState(null);

  useEffect(() => {
    if (id) {
      fetch(`/api/places/${id}`)
        .then(res => res.json())
        .then(data => setPlace(data));
    }
  }, [id]);

  if (!place) {
    return <Loading />;
  }

  return (
    <div className="flex min-h-[calc(100vh-100px)] flex-col max-w-7xl mx-auto px-4">
      <div className="relative pb-48 overflow-hidden">
        <Image 
          className="absolute inset-0 h-full w-full object-cover"
          src={place.image} 
          alt={place.name}
          width={500}
          height={500}
        />
      </div>
      <div className="flex flex-col md:flex-row">
                            <div className='flex-1 flex-grow'>
                            <h2 className='text-2xl font-bold'>{place.name}</h2>
                            <p className='text-sm font-medium text-gray-500'>{place.city.name}</p>
                            <p className='text-sm font-medium text-gray-500'>{place.priceByNight}€/night</p>
                            <p className='text-sm font-medium text-gray-500'>{place.description}</p>
                        
                            </div>
                            <div className='w-80'>
                                <div className='bg-white rounded-lg shadow-lg overflow-hidden'>
                                    <div className='flex items-center p-4'>
                                        <Image className='h-10 w-10 rounded-full'
                                        src={place.host.avatar}
                                        alt={place.host.name}
                                        width={60}
                                        height={60}
                                        ></Image>

                                        <h3 className='text-lg font-medium text-gray-900 ml-2 truncate'>{place.host.name}</h3>
                                    </div>
                                </div>
        </div>
      </div>
    </div>
  );
};

export default PlaceDetails;
