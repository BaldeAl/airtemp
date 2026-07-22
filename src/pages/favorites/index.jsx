import Head from "next/head";
import Layout from "../../components/Layout";
import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/router";
import Place from "../../components/place/Place";
import Loading from "../../components/loading/Loading";
import { useTranslation } from "../../lib/i18n/LanguageContext";
import { HiHeart, HiOutlineHeart } from "react-icons/hi";
import Link from "next/link";

export default function FavoritesPage() {
  const [favorites, setFavorites] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(true);
  const router = useRouter();
  const { t } = useTranslation();

  const fetchFavorites = useCallback(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setIsAuthenticated(false);
      setFavorites([]);
      return;
    }

    fetch("/api/favorites", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed");
        return res.json();
      })
      .then((data) => {
        const places = data.map((fav) => fav.place).filter(Boolean);
        setFavorites(places);
        // Sync localStorage with server state, ensuring consistent number types
        const placeIds = places.map((p) => Number(p.place_id));
        localStorage.setItem("favorites", JSON.stringify(placeIds));
      })
      .catch((err) => {
        console.error("Error fetching favorites:", err);
        setFavorites([]);
      });
  }, []);

  useEffect(() => {
    fetchFavorites();
  }, [fetchFavorites]);

  // Handle favorite removal: remove the place from the list with animation
  const handleFavoriteToggle = useCallback((placeId, isFavorite) => {
    if (!isFavorite) {
      // Small delay for the heart animation to play before removing card
      setTimeout(() => {
        setFavorites((prev) =>
          prev ? prev.filter((p) => p.place_id !== placeId) : [],
        );
      }, 300);
    }
  }, []);

  if (favorites === null) {
    return (
      <Layout>
        <Loading />
      </Layout>
    );
  }

  if (!isAuthenticated) {
    return (
      <>
        <Head>
          <title>{t("favorites.title")} – AirAl</title>
          <meta
            name="description"
            content="Sign in to see your favorite places"
          />
        </Head>
        <Layout>
          <div className="flex min-h-[calc(100vh-200px)] items-center justify-center px-4">
            <div className="text-center max-w-md animate-fade-in-up">
              <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-[#FF6B6B]/10 flex items-center justify-center">
                <HiOutlineHeart className="text-4xl text-[#FF6B6B]" />
              </div>
              <h1 className="text-2xl font-extrabold text-[#2D3436] dark:text-white mb-3">
                {t("favorites.signInToView")}
              </h1>
              <p className="text-[#636E72] dark:text-[#B2BEC3] mb-8 text-sm leading-relaxed">
                {t("favorites.signInDescription")}
              </p>
              <Link
                href="/Auth/login/"
                className="btn-pill px-8 py-3 text-base"
              >
                {t("auth.login")}
              </Link>
            </div>
          </div>
        </Layout>
      </>
    );
  }

  return (
    <>
      <Head>
        <title>{t("favorites.myFavorites")} – AirAl</title>
        <meta name="description" content="Your favorite places on AirAl" />
      </Head>
      <Layout>
        <div className="max-w-6xl mx-auto px-4 py-8 sm:py-12">
          {/* Header */}
          <div className="mb-8 sm:mb-10 animate-fade-in-up">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-full bg-[#FF6B6B]/10 flex items-center justify-center">
                <HiHeart className="text-xl text-[#FF6B6B]" />
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-[#2D3436] dark:text-white">
                {t("favorites.myFavorites")}
              </h1>
            </div>
            <p className="text-sm text-[#636E72] dark:text-[#B2BEC3] ml-[52px]">
              <span className="font-extrabold text-[#2D3436] dark:text-white">
                {favorites.length}
              </span>{" "}
              {favorites.length !== 1
                ? t("favorites.savedPlaces")
                : t("favorites.savedPlace")}
            </p>
          </div>

          {/* Content */}
          {favorites.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 animate-fade-in">
              <div className="w-24 h-24 mb-6 rounded-full bg-[#FF6B6B]/10 flex items-center justify-center">
                <HiOutlineHeart className="text-5xl text-[#FF6B6B]/40" />
              </div>
              <h3 className="text-xl font-extrabold text-[#2D3436] dark:text-white mb-2">
                {t("favorites.noFavorites")}
              </h3>
              <p className="text-[#636E72] dark:text-[#B2BEC3] text-center max-w-md text-sm mb-8">
                {t("favorites.noFavoritesDesc")}
              </p>
              <Link href="/" className="btn-pill px-8 py-3">
                {t("bookings.explorePlaces")}
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
              {favorites.map((place, i) => (
                <Place
                  key={place.place_id}
                  place={place}
                  index={i}
                  onFavoriteToggle={handleFavoriteToggle}
                />
              ))}
            </div>
          )}
        </div>
      </Layout>
    </>
  );
}
