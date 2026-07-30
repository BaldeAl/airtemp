import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import Head from "next/head";
import Loading from "../loading/Loading";
import ImageGallery from "./ImageGallery";
import PlaceInfo from "./PlaceInfo";
import Amenities from "./Amenities";
import ReviewSection from "./ReviewSection";
import BookingForm from "./BookingForm";
import HostCard from "./HostCard";
import StarRating from "./StarRating";
import FavoriteButton from "./FavoriteButton";
import { HiLocationMarker, HiArrowLeft, HiShare } from "react-icons/hi";
import Link from "next/link";
import { useTranslation } from "../../lib/i18n/LanguageContext";
import { toast } from "react-toastify";

const PlaceDetails = () => {
  const router = useRouter();
  const { id } = router.query;
  const [place, setPlace] = useState(null);
  const [fetchError, setFetchError] = useState(false);
  const { t } = useTranslation();

  useEffect(() => {
    if (id) {
      fetch(`/api/places/${id}`)
        .then((res) => {
          if (!res.ok) throw new Error("Failed to fetch");
          return res.json();
        })
        .then((data) => setPlace(data))
        .catch(() => {
          setFetchError(true);
          toast.error(t("toast.placeFetchError"));
        });
    }
  }, [id, t]);

  if (fetchError) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] px-4 animate-fade-in">
        <div className="text-6xl mb-4">😕</div>
        <h2 className="text-xl font-extrabold text-[#2D3436] dark:text-white mb-2">
          {t("errors.somethingWentWrong")}
        </h2>
        <p className="text-[#636E72] dark:text-[#B2BEC3] text-sm mb-6 text-center max-w-md">
          {t("toast.placeFetchError")}
        </p>
        <button
          onClick={() => router.back()}
          className="btn-pill px-8 py-3"
        >
          {t("place.back")}
        </button>
      </div>
    );
  }

  if (!place) {
    return <Loading />;
  }

  const avgRating =
    place.Review && place.Review.length > 0
      ? place.Review.reduce((acc, r) => acc + r.rating, 0) / place.Review.length
      : 0;

  return (
    <>
      <Head>
        <title>{place.name} – AirAl</title>
        <meta
          name="description"
          content={place.description?.substring(0, 160)}
        />
      </Head>

      <div className="max-w-6xl mx-auto px-4 py-6 animate-fade-in">
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-[#636E72] dark:text-[#B2BEC3] hover:text-[#2D3436] dark:hover:text-white transition-colors font-semibold"
          >
            <HiArrowLeft />
            <span className="text-sm">{t("place.back")}</span>
          </button>
          <div className="flex items-center gap-2">
            <button className="flex items-center gap-2 px-3 py-2 rounded-full hover:bg-[#F0F0EC] dark:hover:bg-[#232340] text-[#636E72] dark:text-[#B2BEC3] hover:text-[#2D3436] dark:hover:text-white transition-all text-sm font-semibold">
              <HiShare />
              {t("place.share")}
            </button>
            <FavoriteButton
              placeId={place.place_id}
              className="hover:bg-[#F0F0EC] dark:hover:bg-[#232340] rounded-full"
            />
          </div>
        </div>

        <ImageGallery
          images={place.images?.length > 0 ? place.images : [place.image]}
          name={place.name}
        />

        <div className="flex flex-col lg:flex-row gap-8 lg:gap-10 mt-8">
          <div className="flex-1 min-w-0">
            <div className="mb-2">
              <span className="badge-coral">
                {t(`categories.${place.category}`) !==
                `categories.${place.category}`
                  ? t(`categories.${place.category}`)
                  : place.category || "Place"}
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#2D3436] dark:text-white mb-3">
              {place.name}
            </h1>

            <div className="flex flex-wrap items-center gap-4 mb-6">
              <div className="flex items-center gap-1.5 text-[#636E72] dark:text-[#B2BEC3] font-medium">
                <HiLocationMarker className="text-[#FF6B6B]" />
                <span>{place.city.name}</span>
              </div>
              {avgRating > 0 && (
                <StarRating
                  rating={avgRating}
                  size="sm"
                  reviewCount={place.Review?.length || 0}
                />
              )}
            </div>

            <PlaceInfo
              rooms={place.numberOfRooms}
              bathrooms={place.numberOfBathrooms}
              guests={place.maxGuests}
            />

            <div className="py-6 border-t border-[#E8E8E4] dark:border-[#2D2D4A] mt-4">
              <h3 className="text-xl font-extrabold text-[#2D3436] dark:text-white mb-4">
                {t("place.aboutThisPlace")}
              </h3>
              <p className="text-[#636E72] dark:text-[#B2BEC3] leading-relaxed whitespace-pre-line">
                {place.description}
              </p>
            </div>

            <div className="border-t border-[#E8E8E4] dark:border-[#2D2D4A]">
              <Amenities amenities={place.amenities} />
            </div>

            <div className="border-t border-[#E8E8E4] dark:border-[#2D2D4A]">
              <ReviewSection
                placeId={place.place_id}
                hostId={place.hostId}
                reviews={place.Review}
              />
            </div>
          </div>

          <div className="w-full lg:w-[380px] flex-shrink-0 space-y-6">
            <BookingForm place={place} />
            <HostCard host={place.host} placeId={place.place_id} />
          </div>
        </div>
      </div>
    </>
  );
};

export default PlaceDetails;
