import Head from "next/head";
import Layout from "../../../components/Layout";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Loading from "../../../components/loading/Loading";
import Link from "next/link";
import Image from "next/image";
import { useTranslation } from "../../../lib/i18n/LanguageContext";
import {
  HiCalendar,
  HiLocationMarker,
  HiUsers,
  HiClock,
  HiCheckCircle,
  HiXCircle,
  HiCurrencyDollar,
  HiTrendingUp,
  HiClipboardList,
  HiUser,
  HiMail,
  HiCheck,
  HiX,
} from "react-icons/hi";
import { toast } from "react-toastify";

function formatDate(dateStr, locale) {
  return new Date(dateStr).toLocaleDateString(locale, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function getNights(checkIn, checkOut) {
  return Math.max(
    1,
    Math.ceil(
      (new Date(checkOut).getTime() - new Date(checkIn).getTime()) /
        (1000 * 60 * 60 * 24),
    ),
  );
}

export default function HostBookingsPage() {
  const [data, setData] = useState(null);
  const [activeTab, setActiveTab] = useState("pending");
  const [actionLoading, setActionLoading] = useState(null);
  const router = useRouter();
  const { t, dateLocale } = useTranslation();

  const statusConfig = {
    confirmed: {
      icon: HiCheckCircle,
      label: t("bookings.status.confirmed"),
      badgeClass: "bg-[#55EFC4]/15 text-[#00B894]",
    },
    pending: {
      icon: HiClock,
      label: t("bookings.status.pending"),
      badgeClass: "bg-[#FFE66D]/20 text-[#C9A227]",
    },
    cancelled: {
      icon: HiXCircle,
      label: t("bookings.status.cancelled"),
      badgeClass: "bg-[#FF6B6B]/10 text-[#FF6B6B]",
    },
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");
    if (
      !token ||
      (role !== "HOST" && role !== "HOST_PENDING" && role !== "ADMIN")
    ) {
      router.push("/Auth/login");
      return;
    }

    fetch("/api/host/bookings", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        if (res.status === 403 || res.status === 401) {
          router.push("/");
          throw new Error("Unauthorized");
        }
        if (!res.ok) throw new Error("Failed");
        return res.json();
      })
      .then((d) => setData(d))
      .catch((err) => console.error(err));
  }, [router]);

  const handleBookingAction = async (bookingId, action) => {
    const token = localStorage.getItem("token");
    if (!token) return;

    setActionLoading(`${bookingId}-${action}`);
    try {
      const res = await fetch("/api/host/bookings/approve", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ bookingId, action }),
      });

      if (res.ok) {
        setData((prev) => ({
          ...prev,
          bookings: prev.bookings.map((b) =>
            b.booking_id === bookingId
              ? {
                  ...b,
                  status: action === "approve" ? "confirmed" : "cancelled",
                }
              : b,
          ),
        }));
        toast.success(
          action === "approve"
            ? t("host_bookings.bookingConfirmed")
            : t("host_bookings.bookingDeclined"),
        );
      } else {
        const err = await res.json();
        toast.error(err.message || t("host_bookings.actionFailed"));
      }
    } catch (err) {
      console.error(err);
      toast.error(t("auth.networkError"));
    } finally {
      setActionLoading(null);
    }
  };

  if (!data) {
    return (
      <Layout>
        <Loading />
      </Layout>
    );
  }

  const now = new Date();
  const bookings = data.bookings || [];

  const pending = bookings.filter((b) => b.status === "pending");
  const upcoming = bookings.filter(
    (b) => new Date(b.checkOut) >= now && b.status === "confirmed",
  );
  const past = bookings.filter(
    (b) => new Date(b.checkOut) < now && b.status !== "cancelled",
  );
  const cancelled = bookings.filter((b) => b.status === "cancelled");

  const tabs = [
    {
      key: "pending",
      label: t("bookings.status.pending"),
      count: pending.length,
      color: "#FDCB6E",
    },
    {
      key: "upcoming",
      label: t("bookings.upcoming"),
      count: upcoming.length,
      color: "#4ECDC4",
    },
    {
      key: "past",
      label: t("bookings.past"),
      count: past.length,
      color: "#B2BEC3",
    },
    {
      key: "cancelled",
      label: t("bookings.status.cancelled"),
      count: cancelled.length,
      color: "#FF6B6B",
    },
  ];

  const activeBookings =
    activeTab === "pending"
      ? pending
      : activeTab === "upcoming"
        ? upcoming
        : activeTab === "past"
          ? past
          : cancelled;

  const role =
    typeof window !== "undefined" ? localStorage.getItem("role") : null;

  return (
    <>
      <Head>
        <title>{t("host_bookings.title")} – AirAl</title>
        <meta name="description" content="Manage bookings for your places" />
      </Head>
      <Layout>
        <div className="max-w-5xl mx-auto px-4 py-8 sm:py-12">
          <div className="mb-8 animate-fade-in-up">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-full bg-[#0984E3]/10 flex items-center justify-center">
                <HiClipboardList className="text-xl text-[#0984E3]" />
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-[#2D3436] dark:text-white">
                {t("host_bookings.guestBookings")}
              </h1>
            </div>
            <p className="text-sm text-[#636E72] dark:text-[#B2BEC3] ml-[52px]">
              {t("host_bookings.receivedBookings")}
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8 animate-fade-in-up stagger-1">
            <div className="card-cartoon p-4 sm:p-5 text-center">
              <div className="w-10 h-10 mx-auto mb-2 rounded-full bg-[#FDCB6E]/10 flex items-center justify-center">
                <HiClock className="text-lg text-[#C9A227]" />
              </div>
              <div className="text-xl sm:text-2xl font-extrabold text-[#2D3436] dark:text-white">
                {pending.length}
              </div>
              <div className="text-xs text-[#B2BEC3] font-medium mt-0.5">
                {t("bookings.status.pending")}
              </div>
            </div>
            <div className="card-cartoon p-4 sm:p-5 text-center">
              <div className="w-10 h-10 mx-auto mb-2 rounded-full bg-[#0984E3]/10 flex items-center justify-center">
                <HiClipboardList className="text-lg text-[#0984E3]" />
              </div>
              <div className="text-xl sm:text-2xl font-extrabold text-[#2D3436] dark:text-white">
                {data.stats?.total || 0}
              </div>
              <div className="text-xs text-[#B2BEC3] font-medium mt-0.5">
                {t("host_bookings.totalBookings")}
              </div>
            </div>
            <div className="card-cartoon p-4 sm:p-5 text-center">
              <div className="w-10 h-10 mx-auto mb-2 rounded-full bg-[#55EFC4]/10 flex items-center justify-center">
                <HiCurrencyDollar className="text-lg text-[#00B894]" />
              </div>
              <div className="text-xl sm:text-2xl font-extrabold text-[#2D3436] dark:text-white">
                {data.stats?.revenue || 0}€
              </div>
              <div className="text-xs text-[#B2BEC3] font-medium mt-0.5">
                {t("host_bookings.totalRevenue")}
              </div>
            </div>
            <div className="card-cartoon p-4 sm:p-5 text-center">
              <div className="w-10 h-10 mx-auto mb-2 rounded-full bg-[#4ECDC4]/10 flex items-center justify-center">
                <HiTrendingUp className="text-lg text-[#4ECDC4]" />
              </div>
              <div className="text-xl sm:text-2xl font-extrabold text-[#2D3436] dark:text-white">
                {data.stats?.upcoming || 0}
              </div>
              <div className="text-xs text-[#B2BEC3] font-medium mt-0.5">
                {t("bookings.upcoming")}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 mb-6 animate-fade-in-up stagger-2 flex-wrap">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-bold transition-all ${
                  activeTab === tab.key
                    ? "bg-[#2D3436] dark:bg-white text-white dark:text-[#2D3436]"
                    : "text-[#636E72] dark:text-[#B2BEC3] hover:bg-[#F0F0EC] dark:hover:bg-[#232340]"
                }`}
              >
                {tab.label}
                <span
                  className={`px-1.5 py-0.5 rounded-full text-xs ${
                    activeTab === tab.key
                      ? "bg-white/20 dark:bg-black/20"
                      : "bg-[#E8E8E4] dark:bg-[#3D3D5C]"
                  }`}
                >
                  {tab.count}
                </span>
              </button>
            ))}
          </div>

          {activeBookings.length === 0 ? (
            role === "HOST_PENDING" ? (
              <div className="card-cartoon p-12 flex flex-col items-center justify-center text-center animate-fade-in border-2 border-[#FFE66D]/50 bg-[#FFE66D]/5">
                <div className="w-20 h-20 mb-4 rounded-full bg-[#FFE66D]/20 flex items-center justify-center">
                  <HiClock className="text-4xl text-[#C9A227]" />
                </div>
                <h3 className="text-lg font-extrabold text-[#2D3436] dark:text-white mb-2">
                  {t("host_places.accountUnderReview")}
                </h3>
                <p className="text-sm text-[#636E72] dark:text-[#B2BEC3] max-w-sm">
                  {t("host_bookings.reviewDesc")}
                </p>
              </div>
            ) : (
              <div className="card-cartoon p-12 flex flex-col items-center justify-center text-center animate-fade-in">
                <div className="w-20 h-20 mb-4 rounded-full bg-[#4ECDC4]/10 flex items-center justify-center">
                  <HiCalendar className="text-4xl text-[#4ECDC4]/40" />
                </div>
                <h3 className="text-lg font-extrabold text-[#2D3436] dark:text-white mb-2">
                  {t("host_bookings.noBookingsPrefix")}{" "}
                  {tabs.find((t) => t.key === activeTab)?.label?.toLowerCase()}{" "}
                  {t("host_bookings.noBookingsSuffix")}
                </h3>
                <p className="text-sm text-[#636E72] dark:text-[#B2BEC3]">
                  {activeTab === "pending"
                    ? t("host_bookings.noPendingDesc")
                    : activeTab === "upcoming"
                      ? t("host_bookings.noUpcomingDesc")
                      : `${t("host_bookings.noBookingsToShow")} ${tabs.find((t) => t.key === activeTab)?.label?.toLowerCase()} ${t("host_bookings.noBookingsSuffix")}.`}
                </p>
              </div>
            )
          ) : (
            <div className="space-y-4">
              {activeBookings.map((booking, i) => (
                <HostBookingCard
                  key={booking.id || booking.booking_id}
                  booking={booking}
                  index={i}
                  onAction={handleBookingAction}
                  actionLoading={actionLoading}
                  statusConfig={statusConfig}
                  t={t}
                  dateLocale={dateLocale}
                />
              ))}
            </div>
          )}
        </div>
      </Layout>
    </>
  );
}

function HostBookingCard({
  booking,
  index = 0,
  onAction,
  actionLoading,
  statusConfig,
  t,
  dateLocale,
}) {
  const place = booking.place;
  const guest = booking.user;
  const nights = getNights(booking.checkIn, booking.checkOut);
  const status = statusConfig[booking.status] || statusConfig.confirmed;
  const StatusIcon = status.icon;
  const isPending = booking.status === "pending";

  return (
    <div
      className="card-cartoon animate-fade-in-up opacity-0"
      style={{
        animationDelay: `${index * 0.07}s`,
        animationFillMode: "forwards",
      }}
    >
      <div className="p-5">
        <div className="flex items-start justify-between gap-3 mb-4">
          <div className="flex items-center gap-3 min-w-0">
            <div className="relative w-12 h-12 rounded-2xl overflow-hidden flex-shrink-0">
              <Image
                src={
                  place?.image || "https://picsum.photos/seed/booking/200/200"
                }
                alt={place?.name || "Place"}
                fill
                className="object-cover"
                sizes="48px"
              />
            </div>
            <div className="min-w-0">
              <Link href={`/place/${place?.place_id}`}>
                <h3 className="text-sm font-extrabold text-[#2D3436] dark:text-white truncate hover:text-[#FF6B6B] transition-colors">
                  {place?.name || t("place.unknownPlace")}
                </h3>
              </Link>
              {place?.city && (
                <div className="flex items-center gap-1 text-xs text-[#B2BEC3]">
                  <HiLocationMarker className="text-[#FF6B6B]" />
                  {place.city.name}
                </div>
              )}
            </div>
          </div>
          <span
            className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold flex-shrink-0 ${status.badgeClass}`}
          >
            <StatusIcon className="text-sm" />
            {status.label}
          </span>
        </div>

        <div className="flex items-center gap-3 p-3 rounded-2xl bg-[#FAFAF8] dark:bg-[#1A1A2E] mb-4">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#A29BFE] to-[#6C5CE7] flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
            {guest?.name?.charAt(0)?.toUpperCase() || "G"}
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1.5 text-sm font-bold text-[#2D3436] dark:text-white">
              <HiUser className="text-[#A29BFE] text-xs" />
              {guest?.name || t("booking_form.guest")}
            </div>
            <div className="flex items-center gap-1.5 text-xs text-[#B2BEC3]">
              <HiMail className="text-xs" />
              {guest?.email || t("host_bookings.noEmail")}
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-[#636E72] dark:text-[#B2BEC3]">
          <div className="flex items-center gap-1.5">
            <HiCalendar className="text-[#4ECDC4]" />
            <span>
              {formatDate(booking.checkIn, dateLocale)} →{" "}
              {formatDate(booking.checkOut, dateLocale)}
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <HiUsers className="text-[#A29BFE]" />
            <span>
              {booking.guests}{" "}
              {booking.guests !== 1
                ? t("booking_form.guestsPlural")
                : t("booking_form.guest")}
            </span>
          </div>
          <span className="text-[#B2BEC3]">·</span>
          <span className="font-medium">
            {nights}{" "}
            {nights !== 1 ? t("booking_form.nights") : t("booking_form.night")}
          </span>
        </div>

        <div className="flex items-center justify-between mt-4 pt-3 border-t border-[#E8E8E4] dark:border-[#2D2D4A]">
          <span className="text-lg font-extrabold text-[#00B894]">
            {booking.totalPrice}€
          </span>

          {isPending && (
            <div className="flex items-center gap-2">
              <button
                onClick={() => onAction(booking.booking_id, "reject")}
                disabled={actionLoading === `${booking.booking_id}-reject`}
                className="flex items-center gap-1 px-4 py-2 rounded-full text-xs font-bold text-[#FF6B6B] border-2 border-[#FF6B6B]/20 hover:bg-[#FF6B6B]/10 transition-all disabled:opacity-60"
              >
                <HiX className="text-sm" />
                {actionLoading === `${booking.booking_id}-reject`
                  ? t("host_bookings.refusing")
                  : t("host_bookings.refuse")}
              </button>
              <button
                onClick={() => onAction(booking.booking_id, "approve")}
                disabled={actionLoading === `${booking.booking_id}-approve`}
                className="flex items-center gap-1 px-4 py-2 rounded-full text-xs font-bold text-white bg-[#00B894] hover:bg-[#00A080] transition-all disabled:opacity-60"
              >
                <HiCheck className="text-sm" />
                {actionLoading === `${booking.booking_id}-approve`
                  ? t("host_bookings.approving")
                  : t("host_bookings.accept")}
              </button>
            </div>
          )}

          {!isPending && (
            <span className="text-sm text-[#636E72] dark:text-[#B2BEC3]">
              {t("host_bookings.totalEarned")}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
