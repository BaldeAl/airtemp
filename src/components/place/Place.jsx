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

  const categoryName =
    t(`categories.${place.category}`) !== `categories.${place.category}`
      ? t(`categories.${place.category}`)
      : place.category || "Place";

  return (
    <div
      key={place.place_id}
      className="card-cartoon animate-fade-in-up opacity-0 group relative overflow-hidden flex flex-col justify-between"
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

        <div className="absolute top-3 left-3 z-20 pointer-events-none max-w-[calc(100%-60px)]">
          <span className="px-3 py-1 rounded-full text-xs font-extrabold bg-white/90 dark:bg-[#1A1A2E]/90 text-[#2D3436] dark:text-white backdrop-blur-md shadow-cartoon border border-white/20 truncate block">
            {categoryName}
          </span>
        </div>

        <div className="absolute top-3 right-3 z-30">
          <FavoriteButton
            placeId={place.place_id}
            onToggle={onFavoriteToggle}
          />
        </div>

        {avgRating > 0 && (
          <div className="absolute bottom-3 left-3 z-20 pointer-events-none">
            <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-white/90 dark:bg-[#232340]/90 backdrop-blur-sm shadow-sm">
              <StarRating rating={avgRating} size="xs" showValue={true} />
            </div>
          </div>
        )}
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
