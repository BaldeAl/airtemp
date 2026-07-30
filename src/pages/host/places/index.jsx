import Head from "next/head";
import Layout from "../../../components/Layout";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import Loading from "../../../components/loading/Loading";
import { useTranslation } from "../../../lib/i18n/LanguageContext";
import { HiHome, HiPlus, HiPencil, HiStar, HiTrash, HiXCircle } from "react-icons/hi";
import { toast } from "react-toastify";

export default function HostPlaces() {
  const [places, setPlaces] = useState(null);
  const [deleting, setDeleting] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(null);
  const router = useRouter();
  const { t } = useTranslation();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");

    if (
      !token ||
      (role !== "HOST" && role !== "HOST_PENDING" && role !== "ADMIN")
    ) {
      router.push("/");
      return;
    }

    fetch("/api/host/places", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed");
        return res.json();
      })
      .then((data) => setPlaces(data))
      .catch(() => router.push("/"));
  }, [router]);

  const handleDelete = async (placeId) => {
    const token = localStorage.getItem("token");
    setDeleting(placeId);
    try {
      const res = await fetch(`/api/host/places/${placeId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        setPlaces((prev) => prev.filter((p) => p.place_id !== placeId));
        toast.success(t("host_places.deleteSuccess"));
      } else {
        toast.error(t("host_places.deleteFailed"));
      }
    } catch {
      toast.error(t("auth.networkError"));
    } finally {
      setDeleting(null);
      setShowDeleteModal(null);
    }
  };

  if (places === null) {
    return (
      <Layout>
        <Loading />
      </Layout>
    );
  }

  const role =
    typeof window !== "undefined" ? localStorage.getItem("role") : null;

  return (
    <>
      <Head>
        <title>{t("host_places.manageTitle")} – AirAl</title>
        <meta name="description" content="Manage your hosted places on AirAl" />
      </Head>
      <Layout>
        <div className="max-w-5xl mx-auto px-4 py-8 sm:py-12">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8 sm:mb-10 animate-fade-in-up">
            <div>
              <div className="flex items-center gap-3 mb-1">
                <div className="w-10 h-10 rounded-full bg-[#0984E3]/10 flex items-center justify-center">
                  <HiHome className="text-xl text-[#0984E3]" />
                </div>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-[#2D3436] dark:text-white">
                  {t("host_places.myPlaces")}
                </h1>
              </div>
              <p className="text-sm text-[#636E72] dark:text-[#B2BEC3] ml-[52px]">
                {places.length}{" "}
                {places.length === 1
                  ? t("host_places.placeListed")
                  : t("host_places.placesListed")}
              </p>
            </div>
            {role !== "HOST_PENDING" && (
              <Link
                href="/host/places/new"
                className="flex items-center justify-center gap-2 px-6 py-3 rounded-full font-bold text-white bg-gradient-to-r from-[#FF6B6B] to-[#FF8E53] hover:opacity-90 transition-all shadow-lg text-sm"
              >
                <HiPlus className="text-lg" />
                {t("host_places.addNewPlace")}
              </Link>
            )}
          </div>

          {places.length === 0 ? (
            role === "HOST_PENDING" ? (
              <div className="card-cartoon p-12 flex flex-col items-center justify-center text-center animate-fade-in border-2 border-[#FFE66D]/50 bg-[#FFE66D]/5">
                <div className="w-20 h-20 mb-4 rounded-full bg-[#FFE66D]/20 flex items-center justify-center">
                  <HiStar className="text-4xl text-[#C9A227]" />
                </div>
                <h3 className="text-lg font-extrabold text-[#2D3436] dark:text-white mb-2">
                  {t("host_places.accountUnderReview")}
                </h3>
                <p className="text-sm text-[#636E72] dark:text-[#B2BEC3] mb-6 max-w-sm">
                  {t("host_places.reviewDesc")}
                </p>
              </div>
            ) : (
              <div className="card-cartoon p-12 flex flex-col items-center justify-center text-center animate-fade-in">
                <div className="w-20 h-20 mb-4 rounded-full bg-[#0984E3]/10 flex items-center justify-center">
                  <HiHome className="text-4xl text-[#0984E3]" />
                </div>
                <h3 className="text-lg font-extrabold text-[#2D3436] dark:text-white mb-2">
                  {t("host_places.noPlacesYet")}
                </h3>
                <p className="text-sm text-[#636E72] dark:text-[#B2BEC3] mb-6 max-w-sm">
                  {t("host_places.startHostingDesc")}
                </p>
                <Link
                  href="/host/places/new"
                  className="flex items-center gap-2 px-6 py-3 rounded-full font-bold text-white bg-gradient-to-r from-[#FF6B6B] to-[#FF8E53] hover:opacity-90 transition-all text-sm"
                >
                  <HiPlus className="text-lg" />
                  {t("host_places.addFirstPlace")}
                </Link>
              </div>
            )
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {places.map((place, i) => (
                <div
                  key={place.place_id}
                  className="card-cartoon overflow-hidden animate-fade-in-up opacity-0 flex flex-col justify-between"
                  style={{
                    animationDelay: `${i * 0.08}s`,
                    animationFillMode: "forwards",
                  }}
                >
                  <Link
                    href={`/place/${place.place_id}`}
                    className="relative h-48 overflow-hidden block group cursor-pointer"
                  >
                    <img
                      src={place.image}
                      alt={place.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      onError={(e) => {
                        e.target.src =
                          "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=400&q=80";
                      }}
                    />
                    <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-white/90 dark:bg-[#1A1A2E]/90 backdrop-blur-sm text-xs font-bold text-[#2D3436] dark:text-white">
                      {place.category}
                    </div>
                    {place.Review && place.Review.length > 0 && (
                      <div className="absolute top-3 right-3 flex items-center gap-1 px-2.5 py-1 rounded-full bg-white/90 dark:bg-[#1A1A2E]/90 backdrop-blur-sm text-xs font-bold">
                        <HiStar className="text-[#FDCB6E]" />
                        <span className="text-[#2D3436] dark:text-white">
                          {(
                            place.Review.reduce((s, r) => s + r.rating, 0) /
                            place.Review.length
                          ).toFixed(1)}
                        </span>
                      </div>
                    )}
                  </Link>

                  <div className="p-5 flex-1 flex flex-col justify-between">
                    <div>
                      <Link href={`/place/${place.place_id}`}>
                        <h3 className="text-base font-extrabold text-[#2D3436] dark:text-white mb-1 truncate hover:text-[#FF6B6B] transition-colors">
                          {place.name}
                        </h3>
                      </Link>
                      <p className="text-xs text-[#636E72] dark:text-[#B2BEC3] mb-3 line-clamp-2">
                        {place.description}
                      </p>

                      <div className="flex items-center justify-between text-xs text-[#636E72] dark:text-[#B2BEC3] mb-4">
                        <span>
                          <strong className="text-[#2D3436] dark:text-white">
                            {place.priceByNight}€
                          </strong>{" "}
                          {t("booking_form.perNight")}
                        </span>
                        <span>
                          {place.maxGuests} {t("booking_form.guestsPlural")} ·{" "}
                          {place.numberOfRooms} {t("place_info.bedrooms")}
                        </span>
                      </div>
                    </div>

                    <div className="flex gap-2 pt-3 border-t border-[#E8E8E4] dark:border-[#2D2D4A]">
                      <Link
                        href={`/host/places/edit/${place.place_id}`}
                        className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-full border-2 border-[#0984E3] text-[#0984E3] text-xs font-bold hover:bg-[#0984E3] hover:text-white transition-all"
                      >
                        <HiPencil />
                        {t("profile.edit")}
                      </Link>
                      <button
                        onClick={() => setShowDeleteModal(place.place_id)}
                        disabled={deleting === place.place_id}
                        className="flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-full border-2 border-[#FF6B6B] text-[#FF6B6B] text-xs font-bold hover:bg-[#FF6B6B] hover:text-white transition-all disabled:opacity-50"
                      >
                        <HiTrash />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {showDeleteModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm animate-fade-in px-4">
            <div className="card-cartoon p-6 sm:p-8 max-w-md w-full animate-fade-in-up">
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-[#FF6B6B]/10 flex items-center justify-center">
                  <HiXCircle className="text-3xl text-[#FF6B6B]" />
                </div>
                <h3 className="text-xl font-extrabold text-[#2D3436] dark:text-white mb-2">
                  {t("host_places.deleteConfirmTitle")}
                </h3>
                <p className="text-sm text-[#636E72] dark:text-[#B2BEC3] mb-6">
                  {t("host_places.deleteConfirmDesc")}
                </p>
                <div className="flex gap-3">
                  <button
                    onClick={() => setShowDeleteModal(null)}
                    className="flex-1 py-3 rounded-full font-bold text-[#636E72] dark:text-[#B2BEC3] border-2 border-[#E8E8E4] dark:border-[#3D3D5C] hover:border-[#2D3436] dark:hover:border-white hover:text-[#2D3436] dark:hover:text-white transition-all text-sm"
                  >
                    {t("host_places.deleteConfirmCancel")}
                  </button>
                  <button
                    onClick={() => handleDelete(showDeleteModal)}
                    disabled={deleting === showDeleteModal}
                    className="flex-1 py-3 rounded-full font-bold text-white bg-[#FF6B6B] hover:bg-[#E85555] transition-all text-sm disabled:opacity-60"
                  >
                    {deleting === showDeleteModal
                      ? t("bookings.cancelling")
                      : t("host_places.deleteConfirmProceed")}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </Layout>
    </>
  );
}
