import { BsWifi, BsSnow, BsFire, BsTv, BsWater } from "react-icons/bs";
import { FaCar } from "react-icons/fa";
import { MdKitchen, MdLocalLaundryService, MdIron, MdOutlineWorkspaces, MdHotTub, MdOutdoorGrill, MdFitnessCenter, MdElevator, MdFireplace, MdYard, MdBalcony, MdBeachAccess, MdLandscape, MdPets, MdSmokeFree, MdMedicalServices, MdFireExtinguisher, MdWater } from "react-icons/md";

const AMENITY_ICONS = {
  "WiFi": BsWifi,
  "Kitchen": MdKitchen,
  "Parking": FaCar,
  "Pool": BsWater,
  "Air conditioning": BsSnow,
  "Heating": BsFire,
  "Washer": MdLocalLaundryService,
  "Dryer": MdLocalLaundryService,
  "TV": BsTv,
  "Iron": MdIron,
  "Workspace": MdOutlineWorkspaces,
  "Hot tub": MdHotTub,
  "BBQ grill": MdOutdoorGrill,
  "Gym": MdFitnessCenter,
  "Elevator": MdElevator,
  "Fireplace": MdFireplace,
  "Garden": MdYard,
  "Balcony": MdBalcony,
  "Beach access": MdBeachAccess,
  "Mountain view": MdLandscape,
  "Lake view": MdWater,
  "City view": MdLandscape,
  "Pet friendly": MdPets,
  "Smoke alarm": MdSmokeFree,
  "First aid kit": MdMedicalServices,
  "Fire extinguisher": MdFireExtinguisher,
};

const Amenities = ({ amenities }) => {
  if (!amenities || amenities.length === 0) return null;

  return (
    <div className="py-6">
      <h3 className="text-xl font-extrabold text-[#2D3436] dark:text-white mb-5">What this place offers</h3>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {amenities.map((amenity, index) => {
          const Icon = AMENITY_ICONS[amenity] || BsWifi;
          return (
            <div
              key={amenity}
              className="flex items-center gap-3 p-3 rounded-2xl bg-white dark:bg-[#232340] border border-[#E8E8E4] dark:border-[#3D3D5C] transition-all duration-300 hover:shadow-cartoon hover:border-[#4ECDC4]/30 animate-fade-in-up"
              style={{ animationDelay: `${index * 0.03}s` }}
            >
              <div className="p-2 rounded-xl bg-[#4ECDC4]/10">
                <Icon className="text-lg text-[#4ECDC4]" />
              </div>
              <span className="text-sm text-[#636E72] dark:text-[#B2BEC3] font-medium">{amenity}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Amenities;
