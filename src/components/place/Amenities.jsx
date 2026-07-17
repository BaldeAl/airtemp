import { BsWifi, BsSnow, BsFire, BsTv, BsWater } from "react-icons/bs";
import { FaCar } from "react-icons/fa";
import { MdKitchen, MdLocalLaundryService, MdIron, MdOutlineWorkspaces, MdHotTub, MdOutdoorGrill, MdFitnessCenter, MdElevator, MdFireplace, MdYard, MdBalcony, MdBeachAccess, MdLandscape, MdPets, MdSmokeFree, MdMedicalServices, MdFireExtinguisher, MdWater } from "react-icons/md";
import { useTranslation } from "../../lib/i18n/LanguageContext";

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

// Map original English amenity names to their translation keys
const AMENITY_KEYS = {
  "WiFi": "amenities_list.wifi",
  "Kitchen": "amenities_list.kitchen",
  "Parking": "amenities_list.parking",
  "Pool": "amenities_list.pool",
  "Air conditioning": "amenities_list.airConditioning",
  "Heating": "amenities_list.heating",
  "Washer": "amenities_list.washer",
  "Dryer": "amenities_list.dryer",
  "TV": "amenities_list.tv",
  "Iron": "amenities_list.iron",
  "Workspace": "amenities_list.workspace",
  "Hot tub": "amenities_list.hotTub",
  "BBQ grill": "amenities_list.bbqGrill",
  "Gym": "amenities_list.gym",
  "Elevator": "amenities_list.elevator",
  "Fireplace": "amenities_list.fireplace",
  "Garden": "amenities_list.garden",
  "Balcony": "amenities_list.balcony",
  "Beach access": "amenities_list.beachAccess",
  "Mountain view": "amenities_list.mountainView",
  "Lake view": "amenities_list.lakeView",
  "City view": "amenities_list.cityView",
  "Pet friendly": "amenities_list.petFriendly",
  "Smoke alarm": "amenities_list.smokeAlarm",
  "First aid kit": "amenities_list.firstAidKit",
  "Fire extinguisher": "amenities_list.fireExtinguisher",
};

const Amenities = ({ amenities }) => {
  const { t } = useTranslation();

  if (!amenities || amenities.length === 0) return null;

  return (
    <div className="py-6">
      <h3 className="text-xl font-extrabold text-[#2D3436] dark:text-white mb-5">{t("place.amenities")}</h3>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {amenities.map((amenity, index) => {
          const Icon = AMENITY_ICONS[amenity] || BsWifi;
          // Use translation key if it exists, otherwise fallback to the raw amenity string
          const translationKey = AMENITY_KEYS[amenity];
          const displayName = translationKey ? t(translationKey) : amenity;
          
          return (
            <div
              key={amenity}
              className="flex items-center gap-3 p-3 rounded-2xl bg-white dark:bg-[#232340] border border-[#E8E8E4] dark:border-[#3D3D5C] transition-all duration-300 hover:shadow-cartoon hover:border-[#4ECDC4]/30 animate-fade-in-up"
              style={{ animationDelay: `${index * 0.03}s` }}
            >
              <div className="p-2 rounded-xl bg-[#4ECDC4]/10">
                <Icon className="text-lg text-[#4ECDC4]" />
              </div>
              <span className="text-sm text-[#636E72] dark:text-[#B2BEC3] font-medium">{displayName}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Amenities;
