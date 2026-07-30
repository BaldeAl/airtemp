import Head from "next/head";
import Layout from "../../components/Layout";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Place from "../../components/place/Place";
import Loading from "../../components/loading/Loading";
import { useTranslation } from "../../lib/i18n/LanguageContext";
import {
  HiHome,
  HiCalendar,
  HiStar,
  HiChat,
  HiArrowLeft,
  HiBadgeCheck,
  HiUser,
} from "react-icons/hi";
import Link from "next/link";

export default function HostProfilePage() {
  const router = useRouter();
  const { id } = router.query;
  const [host, setHost] = useState(null);
  const [loading, setLoading] = useState(true);
  const { t, dateLocale } = useTranslation();

  useEffect(() => {
    if (id) {
      fetch(`/api/hosts/${id}`)
        .then((res) => {
          if (!res.ok) throw new Error("Failed to fetch host");
          return res.json();
        })
        .then((data) => {
          setHost(data);
        })
        .catch((err) => {
          console.error(err);
        })
        .finally(() => setLoading(false));
    }
  }, [id]);

  if (loading) {
    return (
      <Layout>
        <Loading />
      </Layout>
    );
  }

  if (!host) {
    return (
      <Layout>
        <div className="max-w-4xl mx-auto px-4 py-20 text-center animate-fade-in">
          <div className="text-6xl mb-4">👤</div>
          <h2 className="text-2xl font-extrabold text-[#2D3436] dark:text-white mb-2">
            {t("errors.somethingWentWrong")}
          </h2>
          <p className="text-[#636E72] dark:text-[#B2BEC3] text-sm mb-6">
            {t("notFound.description")}
          </p>
          <Link href="/" className="btn-pill px-8 py-3">
            {t("notFound.goHome")}
          </Link>
        </div>
      </Layout>
    );
  }

  const places = host.Place || [];
  const memberSince = host.createdAt
    ? new Date(host.createdAt).toLocaleDateString(dateLocale, {
        month: "long",
        year: "numeric",
      })
    : "2024";

  const allReviews = places.flatMap((p) => p.Review || []);
  const avgRatingNum =
    allReviews.length > 0
      ? allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length
      : 0;
  const avgRatingStr = allReviews.length > 0 ? avgRatingNum.toFixed(1) : null;

  const createdDate = host.createdAt ? new Date(host.createdAt) : null;
  const isSenior = createdDate
    ? new Date().getTime() - createdDate.getTime() >= 90 * 24 * 60 * 60 * 1000
    : false;

  const isSuperhost = avgRatingNum >= 4.2;
  const isApprovedHost = host.role === "HOST";

  return (
    <>
      <Head>
        <title>{host.name} – AirAl</title>
        <meta
          name="description"
          content={`Explore places hosted by ${host.name} on AirAl.`}
        />
      </Head>
      <Layout>
        <div className="max-w-6xl mx-auto px-4 py-8 sm:py-12">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-[#636E72] dark:text-[#B2BEC3] hover:text-[#2D3436] dark:hover:text-white transition-colors font-semibold mb-6 text-sm"
          >
            <HiArrowLeft />
            <span>{t("place.back")}</span>
          </button>

          <div className="card-cartoon p-6 sm:p-8 mb-10 animate-fade-in-up">
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 text-center sm:text-left">
              <div className="relative">
                <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-gradient-to-br from-[#A29BFE] to-[#6C5CE7] flex items-center justify-center text-white text-3xl font-extrabold flex-shrink-0 shadow-lg overflow-hidden">
                  {host.avatar ? (
                    <img
                      src={host.avatar}
                      alt={host.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    host.name?.charAt(0)?.toUpperCase() || "H"
                  )}
                </div>
                {isSuperhost ? (
                  <div className="absolute -bottom-1 -right-1 w-7 h-7 bg-[#00B894] text-white rounded-full border-2 border-white dark:border-[#232340] flex items-center justify-center text-sm font-bold shadow-md">
                    ★
                  </div>
                ) : isApprovedHost && isSenior ? (
                  <div className="absolute -bottom-1 -right-1 w-7 h-7 bg-[#0984E3] text-white rounded-full border-2 border-white dark:border-[#232340] flex items-center justify-center text-sm font-bold shadow-md">
                    ✓
                  </div>
                ) : null}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
                  <div>
                    <h1 className="text-2xl sm:text-3xl font-extrabold text-[#2D3436] dark:text-white">
                      {host.name}
                    </h1>

                    {isSuperhost ? (
                      <div className="inline-flex items-center gap-1.5 mt-1 px-3 py-1 rounded-full bg-[#00B894]/15 text-[#00B894] text-xs font-extrabold">
                        <HiStar className="text-sm" />
                        <span>{t("host_card.superhost")}</span>
                      </div>
                    ) : isApprovedHost && isSenior ? (
                      <div className="inline-flex items-center gap-1.5 mt-1 px-3 py-1 rounded-full bg-[#0984E3]/15 text-[#0984E3] text-xs font-extrabold">
                        <HiBadgeCheck className="text-sm" />
                        <span>{t("host_card.host")}</span>
                      </div>
                    ) : isApprovedHost ? (
                      <div className="inline-flex items-center gap-1.5 mt-1 px-3 py-1 rounded-full bg-[#636E72]/10 text-[#636E72] dark:text-[#B2BEC3] text-xs font-bold">
                        <HiUser className="text-sm" />
                        <span>{t("host_card.host")}</span>
                      </div>
                    ) : null}
                  </div>

                  <Link
                    href={`/messages?contact=${host.user_id}`}
                    className="btn-pill px-6 py-2.5 text-sm flex items-center justify-center gap-2"
                  >
                    <HiChat className="text-base" />
                    {t("place.contactHost")}
                  </Link>
                </div>

                {host.bio && (
                  <p className="text-sm text-[#636E72] dark:text-[#B2BEC3] leading-relaxed mb-4">
                    {host.bio}
                  </p>
                )}

                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-6 pt-4 border-t border-[#E8E8E4] dark:border-[#2D2D4A] text-xs sm:text-sm text-[#636E72] dark:text-[#B2BEC3]">
                  <div className="flex items-center gap-1.5 font-medium">
                    <HiCalendar className="text-[#A29BFE] text-base" />
                    <span>
                      {t("host_card.memberSince")} {memberSince}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 font-medium">
                    <HiHome className="text-[#0984E3] text-base" />
                    <span>
                      {places.length}{" "}
                      {places.length !== 1
                        ? t("host_card.listings")
                        : t("host_card.listing")}
                    </span>
                  </div>
                  {avgRatingStr && (
                    <div className="flex items-center gap-1.5 font-medium">
                      <HiStar className="text-[#FDCB6E] text-base" />
                      <span className="font-extrabold text-[#2D3436] dark:text-white">
                        {avgRatingStr}
                      </span>{" "}
                      ({allReviews.length}{" "}
                      {allReviews.length !== 1
                        ? t("reviews.reviewsWord")
                        : "review"})
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="mb-6">
            <h2 className="text-xl sm:text-2xl font-extrabold text-[#2D3436] dark:text-white flex items-center gap-2">
              <HiHome className="text-[#FF6B6B]" />
              {t("host_places.myPlaces")} ({places.length})
            </h2>
          </div>

          {places.length === 0 ? (
            <div className="card-cartoon p-12 text-center text-[#B2BEC3] text-sm animate-fade-in">
              {t("host_places.noPlacesYet")}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 animate-fade-in">
              {places.map((place, i) => (
                <Place key={place.place_id} place={place} index={i} />
              ))}
            </div>
          )}
        </div>
      </Layout>
    </>
  );
}
