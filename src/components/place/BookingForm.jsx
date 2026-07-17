import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/router";
import { useTranslation } from "../../lib/i18n/LanguageContext";

const BookingForm = ({ place }) => {
  const router = useRouter();
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [guests, setGuests] = useState(1);
  const [isBooked, setIsBooked] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [availabilityStatus, setAvailabilityStatus] = useState(null); // null | 'checking' | 'available' | 'unavailable'
  const [availabilityMessage, setAvailabilityMessage] = useState("");
  const { t } = useTranslation();

  const nights =
    checkIn && checkOut
      ? Math.max(
          1,
          Math.ceil(
            (new Date(checkOut).getTime() - new Date(checkIn).getTime()) /
              (1000 * 60 * 60 * 24)
          )
        )
      : 0;

  const serviceFee = Math.round(place.priceByNight * nights * 0.12);
  const totalPrice = place.priceByNight * nights + serviceFee;

  // Check availability when dates change
  const checkAvailability = useCallback(async () => {
    if (!checkIn || !checkOut) {
      setAvailabilityStatus(null);
      return;
    }

    if (new Date(checkOut) <= new Date(checkIn)) {
      setAvailabilityStatus(null);
      return;
    }

    setAvailabilityStatus("checking");
    try {
      const res = await fetch("/api/bookings/check-availability", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          placeId: place.place_id,
          checkIn,
          checkOut,
        }),
      });

      const data = await res.json();
      setAvailabilityStatus(data.available ? "available" : "unavailable");
      setAvailabilityMessage(data.message);
    } catch {
      setAvailabilityStatus(null);
    }
  }, [checkIn, checkOut, place.place_id]);

  useEffect(() => {
    const timer = setTimeout(checkAvailability, 300);
    return () => clearTimeout(timer);
  }, [checkAvailability]);

  const handleBook = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/Auth/login");
      return;
    }

    if (availabilityStatus === "unavailable") return;

    setIsLoading(true);
    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          placeId: place.place_id,
          checkIn,
          checkOut,
          guests,
          totalPrice,
        }),
      });

      if (res.ok) {
        setIsBooked(true);
      }
    } catch (err) {
      console.error("Booking failed");
    } finally {
      setIsLoading(false);
    }
  };

  if (isBooked) {
    return (
      <div className="card-cartoon p-6 sticky top-28">
        <div className="text-center py-6">
          <div className="text-5xl mb-4">⏳</div>
          <h3 className="text-xl font-extrabold text-[#2D3436] dark:text-white mb-2">{t("booking_form.reservationPending")}</h3>
          <p className="text-[#636E72] dark:text-[#B2BEC3] text-sm mb-2">
            {nights} {nights !== 1 ? t("booking_form.nights") : t("booking_form.night")} {t("booking_form.nightsAt")} {place.name}
          </p>
          <p className="text-lg font-extrabold text-[#FF6B6B] mb-4">{totalPrice}€ {t("booking_form.total").toLowerCase()}</p>
          <div className="flex items-start gap-2 p-3 rounded-2xl bg-[#FFE66D]/15 text-[#C9A227] mb-6">
            <span className="text-sm">ℹ️</span>
            <span className="text-xs font-semibold leading-relaxed text-left">
              {t("booking_form.pendingApproval")}
            </span>
          </div>
          <button
            onClick={() => router.push("/bookings")}
            className="btn-pill w-full py-3"
          >
            {t("booking_form.viewMyBookings")}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="card-cartoon p-6 sticky top-28">
      <div className="flex items-baseline gap-2 mb-6">
        <span className="text-2xl font-extrabold text-[#2D3436] dark:text-white">{place.priceByNight}€</span>
        <span className="text-[#B2BEC3] font-medium">{t("booking_form.perNight")}</span>
      </div>

      <form onSubmit={handleBook} className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs font-bold text-[#636E72] dark:text-[#B2BEC3] mb-1.5 block uppercase tracking-wide">{t("booking_form.checkIn")}</label>
            <input
              type="date"
              value={checkIn}
              onChange={(e) => setCheckIn(e.target.value)}
              required
              min={new Date().toISOString().split("T")[0]}
              className="w-full input-cartoon text-sm"
            />
          </div>
          <div>
            <label className="text-xs font-bold text-[#636E72] dark:text-[#B2BEC3] mb-1.5 block uppercase tracking-wide">{t("booking_form.checkout")}</label>
            <input
              type="date"
              value={checkOut}
              onChange={(e) => setCheckOut(e.target.value)}
              required
              min={checkIn || new Date().toISOString().split("T")[0]}
              className="w-full input-cartoon text-sm"
            />
          </div>
        </div>

        {/* Availability indicator */}
        {availabilityStatus && (
          <div
            className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold animate-fade-in ${
              availabilityStatus === "checking"
                ? "bg-[#FFE66D]/15 text-[#C9A227]"
                : availabilityStatus === "available"
                ? "bg-[#55EFC4]/15 text-[#00B894]"
                : "bg-[#FF6B6B]/10 text-[#FF6B6B]"
            }`}
          >
            {availabilityStatus === "checking" ? (
              <>
                <span className="inline-block w-3 h-3 border-2 border-[#C9A227] border-t-transparent rounded-full animate-spin" />
                {t("booking_form.checkingAvailability")}
              </>
            ) : availabilityStatus === "available" ? (
              <>
                <span>✓</span>
                {availabilityMessage}
              </>
            ) : (
              <>
                <span>✕</span>
                {availabilityMessage}
              </>
            )}
          </div>
        )}

        <div>
          <label className="text-xs font-bold text-[#636E72] dark:text-[#B2BEC3] mb-1.5 block uppercase tracking-wide">{t("booking_form.guests")}</label>
          <select
            value={guests}
            onChange={(e) => setGuests(Number(e.target.value))}
            className="w-full input-cartoon text-sm"
          >
            {Array.from({ length: place.maxGuests || 5 }, (_, i) => (
              <option key={i + 1} value={i + 1}>
                {i + 1} {i > 0 ? t("booking_form.guestsPlural") : t("booking_form.guest")}
              </option>
            ))}
          </select>
        </div>

        <button
          type="submit"
          disabled={isLoading || !checkIn || !checkOut || availabilityStatus === "unavailable" || availabilityStatus === "checking"}
          className="w-full btn-pill py-3.5 text-base"
        >
          {isLoading ? t("booking_form.booking") : availabilityStatus === "unavailable" ? t("booking_form.notAvailable") : t("booking_form.reserve")}
        </button>
      </form>

      {nights > 0 && availabilityStatus !== "unavailable" && (
        <div className="mt-5 space-y-3 pt-5 border-t border-[#E8E8E4] dark:border-[#3D3D5C] animate-fade-in">
          <div className="flex justify-between text-sm">
            <span className="text-[#636E72] dark:text-[#B2BEC3]">
              {place.priceByNight}€ × {nights} {nights !== 1 ? t("booking_form.nights") : t("booking_form.night")}
            </span>
            <span className="font-bold text-[#2D3436] dark:text-white">{place.priceByNight * nights}€</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-[#636E72] dark:text-[#B2BEC3]">{t("booking_form.serviceFee")}</span>
            <span className="font-bold text-[#2D3436] dark:text-white">{serviceFee}€</span>
          </div>
          <div className="flex justify-between text-base font-extrabold pt-3 border-t border-[#E8E8E4] dark:border-[#3D3D5C]">
            <span className="text-[#2D3436] dark:text-white">{t("booking_form.total")}</span>
            <span className="text-[#FF6B6B]">{totalPrice}€</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookingForm;
