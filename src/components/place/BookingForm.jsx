import { useState } from "react";
import { useRouter } from "next/router";

const BookingForm = ({ place }) => {
  const router = useRouter();
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [guests, setGuests] = useState(1);
  const [isBooked, setIsBooked] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

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

  const handleBook = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/Auth/login");
      return;
    }

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
          <div className="text-5xl mb-4">🎉</div>
          <h3 className="text-xl font-extrabold text-[#2D3436] dark:text-white mb-2">Booking Confirmed!</h3>
          <p className="text-[#636E72] dark:text-[#B2BEC3] text-sm mb-2">
            {nights} night{nights !== 1 ? "s" : ""} at {place.name}
          </p>
          <p className="text-lg font-extrabold text-[#FF6B6B] mb-6">{totalPrice}€ total</p>
          <button
            onClick={() => router.push("/bookings")}
            className="btn-pill w-full py-3"
          >
            View My Bookings
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="card-cartoon p-6 sticky top-28">
      <div className="flex items-baseline gap-2 mb-6">
        <span className="text-2xl font-extrabold text-[#2D3436] dark:text-white">{place.priceByNight}€</span>
        <span className="text-[#B2BEC3] font-medium">/ night</span>
      </div>

      <form onSubmit={handleBook} className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs font-bold text-[#636E72] dark:text-[#B2BEC3] mb-1.5 block uppercase tracking-wide">Check-in</label>
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
            <label className="text-xs font-bold text-[#636E72] dark:text-[#B2BEC3] mb-1.5 block uppercase tracking-wide">Checkout</label>
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

        <div>
          <label className="text-xs font-bold text-[#636E72] dark:text-[#B2BEC3] mb-1.5 block uppercase tracking-wide">Guests</label>
          <select
            value={guests}
            onChange={(e) => setGuests(Number(e.target.value))}
            className="w-full input-cartoon text-sm"
          >
            {Array.from({ length: place.maxGuests || 5 }, (_, i) => (
              <option key={i + 1} value={i + 1}>
                {i + 1} guest{i > 0 ? "s" : ""}
              </option>
            ))}
          </select>
        </div>

        <button
          type="submit"
          disabled={isLoading || !checkIn || !checkOut}
          className="w-full btn-pill py-3.5 text-base"
        >
          {isLoading ? "Booking..." : "Reserve"}
        </button>
      </form>

      {nights > 0 && (
        <div className="mt-5 space-y-3 pt-5 border-t border-[#E8E8E4] dark:border-[#3D3D5C] animate-fade-in">
          <div className="flex justify-between text-sm">
            <span className="text-[#636E72] dark:text-[#B2BEC3]">
              {place.priceByNight}€ × {nights} night{nights !== 1 ? "s" : ""}
            </span>
            <span className="font-bold text-[#2D3436] dark:text-white">{place.priceByNight * nights}€</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-[#636E72] dark:text-[#B2BEC3]">Service fee</span>
            <span className="font-bold text-[#2D3436] dark:text-white">{serviceFee}€</span>
          </div>
          <div className="flex justify-between text-base font-extrabold pt-3 border-t border-[#E8E8E4] dark:border-[#3D3D5C]">
            <span className="text-[#2D3436] dark:text-white">Total</span>
            <span className="text-[#FF6B6B]">{totalPrice}€</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookingForm;
