import {
  BsFillHouseFill,
  BsSnow,
  BsSunFill,
  BsTree,
  BsWater,
  BsBuildingFill,
  BsGem,
  BsGlobeAmericas,
} from "react-icons/bs";
import { GiPalmTree, GiDesert, GiCastle } from "react-icons/gi";
import { FaMountain } from "react-icons/fa";
import { useTranslation } from "../../lib/i18n/LanguageContext";

const CATEGORIES = [
  { name: "All", icon: BsGlobeAmericas, color: "#FF6B6B" },
  { name: "Beach", icon: BsWater, color: "#4ECDC4" },
  { name: "Mountain", icon: FaMountain, color: "#6C5CE7" },
  { name: "City", icon: BsBuildingFill, color: "#636E72" },
  { name: "Countryside", icon: BsTree, color: "#00B894" },
  { name: "Luxury", icon: BsGem, color: "#FDCB6E" },
  { name: "Tropical", icon: GiPalmTree, color: "#E17055" },
  { name: "Lakefront", icon: BsWater, color: "#0984E3" },
  { name: "Ski", icon: BsSnow, color: "#74B9FF" },
  { name: "Desert", icon: GiDesert, color: "#FAB1A0" },
  { name: "Historic", icon: GiCastle, color: "#A29BFE" },
];

const Categories = ({ activeCategory, onCategoryChange }) => {
  const { t } = useTranslation();

  return (
    <div className="w-full overflow-x-auto py-3 px-2 scrollbar-hide">
      <div className="flex items-center gap-2 sm:gap-3 min-w-max sm:min-w-full sm:justify-center mx-auto max-w-6xl">
        {CATEGORIES.map((cat) => {
          const Icon = cat.icon;
          const isActive = activeCategory === cat.name;

          return (
            <button
              key={cat.name}
              onClick={() => onCategoryChange(cat.name)}
              className={`flex flex-col items-center gap-1.5 px-3 sm:px-4 py-2.5 sm:py-3 rounded-2xl text-xs font-bold transition-all duration-300 min-w-[64px] sm:min-w-[72px] cursor-pointer
                ${
                  isActive
                    ? "text-white shadow-cartoon scale-105"
                    : "bg-white dark:bg-[#232340] text-[#636E72] dark:text-[#B2BEC3] hover:bg-[#F0F0EC] dark:hover:bg-[#2D2D4A] border border-[#E8E8E4] dark:border-[#3D3D5C]"
                }
              `}
              style={isActive ? { backgroundColor: cat.color } : {}}
            >
              <Icon className="text-base sm:text-lg" />
              <span>{t(`categories.${cat.name}`)}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default Categories;
