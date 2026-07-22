import Image from "next/image";
import Link from "next/link";
import Loading from "../loading/Loading";
import StarRating from "./StarRating";
import FavoriteButton from "./FavoriteButton";
import { HiLocationMarker } from "react-icons/hi";
import { useTranslation } from "../../lib/i18n/LanguageContext";

const Place = ({ place, index = 0, onFavoriteToggle }) => {
  const { t } = useTranslation();

  if (!place) {
    return <Loading />;
  }

  const avgRating =
    place.Review && place.Review.length > 0
      ? place.Review.reduce((acc, r) => acc + r.rating, 0) / place.Review.length
      : 0;

  const categoryColors = {
    Beach: "bg-[#4ECDC4]/15 text-[#3BADA6]",
    Mountain: "bg-[#6C5CE7]/15 text-[#6C5CE7]",
    City: "bg-[#636E72]/15 text-[#636E72]",
    Countryside: "bg-[#00B894]/15 text-[#00B894]",
    Luxury: "bg-[#FDCB6E]/20 text-[#C9A227]",
    Tropical: "bg-[#E17055]/15 text-[#E17055]",
    Lakefront: "bg-[#0984E3]/15 text-[#0984E3]",
    Ski: "bg-[#74B9FF]/20 text-[#2980B9]",
    Desert: "bg-[#FAB1A0]/20 text-[#D35400]",
    Historic: "bg-[#A29BFE]/15 text-[#7C73E6]",
  };

  const categoryName =
    t(`categories.${place.category}`) !== `categories.${place.category}`
      ? t(`categories.${place.category}`)
      : place.category || "Place";

  return (
    <div
      key={place.place_id}
      className="card-cartoon animate-fade-in-up opacity-0 group relative overflow-hidden"
      style={{
        animationDelay: `${index * 0.07}s`,
        animationFillMode: "forwards",
      }}
    >
      <Link href={`/place/${place.place_id}`} className="absolute inset-0 z-10">
        <span className="sr-only">View {place.name}</span>
      </Link>

      <div className="relative aspect-[4/3] overflow-hidden">
        <Image
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          src={place.image}
          alt={place.name}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />

        <div className="absolute top-3 left-3 z-20 pointer-events-none">
          <span
            className={`px-3 py-1 rounded-full text-xs font-bold ${categoryColors[place.category] || "bg-[#636E72]/15 text-[#636E72]"}`}
          >
            {categoryName}
          </span>
        </div>

        <div className="absolute top-3 right-3 z-20 relative">
          <FavoriteButton
            placeId={place.place_id}
            onToggle={onFavoriteToggle}
          />
        </div>

        <div className="absolute bottom-3 left-3 z-20 pointer-events-none">
          {avgRating > 0 && (
            <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-white/90 dark:bg-[#232340]/90 backdrop-blur-sm shadow-sm">
              <StarRating rating={avgRating} size="xs" showValue={true} />
            </div>
          )}
        </div>
      </div>

      <div className="p-4 relative z-20 pointer-events-none">
        <h3 className="text-base font-extrabold text-[#2D3436] dark:text-white truncate mb-1">
          {place.name}
        </h3>
        <div className="flex items-center gap-1 text-sm text-[#636E72] dark:text-[#B2BEC3] mb-2">
          <HiLocationMarker className="text-[#FF6B6B] flex-shrink-0" />
          <span className="truncate">{place.city.name}</span>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-baseline gap-1">
            <span className="text-lg font-extrabold text-[#2D3436] dark:text-white">
              {place.priceByNight}€
            </span>
            <span className="text-xs text-[#B2BEC3] font-medium">
              {t("place_card.perNight")}
            </span>
          </div>
          <div className="flex items-center gap-2 text-xs text-[#B2BEC3] font-medium">
            <span>
              {place.numberOfRooms}{" "}
              {place.numberOfRooms !== 1
                ? t("place_card.beds")
                : t("place_card.bed")}
            </span>
            <span>·</span>
            <span>
              {place.maxGuests}{" "}
              {place.maxGuests !== 1
                ? t("place_card.guests")
                : t("place_card.guest")}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Place;
