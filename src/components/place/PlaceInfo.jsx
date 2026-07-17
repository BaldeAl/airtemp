import { BsDoorOpen, BsDroplet, BsPeople } from "react-icons/bs";
import { useTranslation } from "../../lib/i18n/LanguageContext";

const PlaceInfo = ({ rooms, bathrooms, guests }) => {
  const { t } = useTranslation();
  
  const items = [
    { icon: BsDoorOpen, label: t("place_info.bedrooms"), value: rooms, color: "text-[#FF6B6B]", bg: "bg-[#FF6B6B]/10" },
    { icon: BsDroplet, label: t("place_info.bathrooms"), value: bathrooms, color: "text-[#4ECDC4]", bg: "bg-[#4ECDC4]/10" },
    { icon: BsPeople, label: t("place_info.maxGuests"), value: guests, color: "text-[#A29BFE]", bg: "bg-[#A29BFE]/10" },
  ];

  return (
    <div className="flex flex-wrap gap-3 sm:gap-4 py-4">
      {items.map((item) => {
        const Icon = item.icon;
        return (
          <div
            key={item.label}
            className="flex items-center gap-3 px-4 py-3 rounded-2xl bg-white dark:bg-[#232340] border border-[#E8E8E4] dark:border-[#3D3D5C] shadow-cartoon"
          >
            <div className={`p-2 rounded-xl ${item.bg}`}>
              <Icon className={`text-lg ${item.color}`} />
            </div>
            <div>
              <div className="text-lg font-extrabold text-[#2D3436] dark:text-white">{item.value}</div>
              <div className="text-xs text-[#B2BEC3] font-medium">{item.label}</div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default PlaceInfo;
