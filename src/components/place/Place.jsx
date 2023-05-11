import Image from "next/image";
import Link from "next/link";
import Loading from "../loading/Loading";

const Place = ({ place }) => {
    
  if (!place) {
    return( <><Loading />;
    
    </>
    
    )
  }

  return (
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
  );
};

export default Place;
