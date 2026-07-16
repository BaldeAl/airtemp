import Head from 'next/head';
import Layout from '../../components/Layout';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Loading from '../../components/loading/Loading';
import Link from 'next/link';
import Image from 'next/image';
import { HiCalendar, HiLocationMarker, HiUsers, HiClock, HiCheckCircle, HiXCircle, HiX, HiExclamation } from 'react-icons/hi';

const statusConfig = {
  confirmed: {
    icon: HiCheckCircle,
    label: 'Confirmed',
    badgeClass: 'bg-[#55EFC4]/15 text-[#00B894]',
  },
  pending: {
    icon: HiClock,
    label: 'Pending',
    badgeClass: 'bg-[#FFE66D]/20 text-[#C9A227]',
  },
  cancelled: {
    icon: HiXCircle,
    label: 'Cancelled',
    badgeClass: 'bg-[#FF6B6B]/10 text-[#FF6B6B]',
  },
};

function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

function getNights(checkIn, checkOut) {
  return Math.max(
    1,
    Math.ceil(
      (new Date(checkOut).getTime() - new Date(checkIn).getTime()) /
        (1000 * 60 * 60 * 24)
    )
  );
}

function getHoursUntilCheckIn(checkIn) {
  return (new Date(checkIn).getTime() - new Date().getTime()) / (1000 * 60 * 60);
}

function canCancel(booking) {
  // Pending bookings can always be cancelled
  if (booking.status === 'pending') return true;
  // Confirmed bookings can only be cancelled 72h+ before check-in
  if (booking.status === 'confirmed') {
    return getHoursUntilCheckIn(booking.checkIn) >= 72;
  }
  return false;
}

export default function BookingsPage() {
  const [bookings, setBookings] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(true);
  const [cancellingId, setCancellingId] = useState(null);
  const [showCancelModal, setShowCancelModal] = useState(null);
  const [cancelError, setCancelError] = useState('');
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      setIsAuthenticated(false);
      setBookings([]);
      return;
    }

    fetch('/api/bookings', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error('Failed');
        return res.json();
      })
      .then((data) => setBookings(data))
      .catch(() => setBookings([]));
  }, []);

  const handleCancel = async (bookingId) => {
    const token = localStorage.getItem('token');
    if (!token) return;

    setCancellingId(bookingId);
    setCancelError('');
    try {
      const res = await fetch('/api/bookings/cancel', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ bookingId }),
      });

      if (res.ok) {
        setBookings((prev) =>
          prev.map((b) =>
            b.booking_id === bookingId ? { ...b, status: 'cancelled' } : b
          )
        );
        setShowCancelModal(null);
      } else {
        const data = await res.json();
        setCancelError(data.message || 'Cancel failed');
      }
    } catch (err) {
      console.error('Cancel failed:', err);
      setCancelError('Network error');
    } finally {
      setCancellingId(null);
    }
  };

  if (bookings === null) {
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
          <title>Bookings – AirAl</title>
          <meta name="description" content="Sign in to see your bookings" />
        </Head>
        <Layout>
          <div className="flex min-h-[calc(100vh-200px)] items-center justify-center px-4">
            <div className="text-center max-w-md animate-fade-in-up">
              <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-[#4ECDC4]/10 flex items-center justify-center">
                <HiCalendar className="text-4xl text-[#4ECDC4]" />
              </div>
              <h1 className="text-2xl font-extrabold text-[#2D3436] dark:text-white mb-3">
                Sign in to view bookings
              </h1>
              <p className="text-[#636E72] dark:text-[#B2BEC3] mb-8 text-sm leading-relaxed">
                View and manage your upcoming stays by signing in to your account.
              </p>
              <Link href="/Auth/login/" className="btn-pill px-8 py-3 text-base">
                Login
              </Link>
            </div>
          </div>
        </Layout>
      </>
    );
  }

  // Separate bookings into categories
  const now = new Date();
  const upcoming = bookings.filter((b) => new Date(b.checkOut) >= now && (b.status === 'confirmed' || b.status === 'pending'));
  const past = bookings.filter((b) => new Date(b.checkOut) < now && b.status !== 'cancelled');
  const cancelled = bookings.filter((b) => b.status === 'cancelled');

  return (
    <>
      <Head>
        <title>My Bookings – AirAl</title>
        <meta name="description" content="Your bookings on AirAl" />
      </Head>
      <Layout>
        <div className="max-w-4xl mx-auto px-4 py-8 sm:py-12">
          {/* Header */}
          <div className="mb-8 sm:mb-10 animate-fade-in-up">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-full bg-[#4ECDC4]/10 flex items-center justify-center">
                <HiCalendar className="text-xl text-[#4ECDC4]" />
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-[#2D3436] dark:text-white">
                My Bookings
              </h1>
            </div>
            <p className="text-sm text-[#636E72] dark:text-[#B2BEC3] ml-[52px]">
              <span className="font-extrabold text-[#2D3436] dark:text-white">{bookings.length}</span>{' '}
              booking{bookings.length !== 1 ? 's' : ''} total
            </p>
          </div>

          {/* Empty State */}
          {bookings.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 animate-fade-in">
              <div className="w-24 h-24 mb-6 rounded-full bg-[#4ECDC4]/10 flex items-center justify-center">
                <HiCalendar className="text-5xl text-[#4ECDC4]/40" />
              </div>
              <h3 className="text-xl font-extrabold text-[#2D3436] dark:text-white mb-2">
                No bookings yet
              </h3>
              <p className="text-[#636E72] dark:text-[#B2BEC3] text-center max-w-md text-sm mb-8">
                When you book a stay, it will appear here. Start exploring amazing places!
              </p>
              <Link href="/" className="btn-pill px-8 py-3">
                Explore Places
              </Link>
            </div>
          ) : (
            <div className="space-y-10">
              {/* Upcoming Bookings (confirmed + pending) */}
              {upcoming.length > 0 && (
                <section>
                  <h2 className="text-lg font-extrabold text-[#2D3436] dark:text-white mb-4 flex items-center gap-2 animate-fade-in-up">
                    <span className="w-2 h-2 rounded-full bg-[#4ECDC4]" />
                    Upcoming
                  </h2>
                  <div className="space-y-4">
                    {upcoming.map((booking, i) => (
                      <BookingCard
                        key={booking.id || booking.booking_id}
                        booking={booking}
                        index={i}
                        onCancel={canCancel(booking) ? () => setShowCancelModal(booking.booking_id) : null}
                      />
                    ))}
                  </div>
                </section>
              )}

              {/* Past Bookings */}
              {past.length > 0 && (
                <section>
                  <h2 className="text-lg font-extrabold text-[#2D3436] dark:text-white mb-4 flex items-center gap-2 animate-fade-in-up">
                    <span className="w-2 h-2 rounded-full bg-[#B2BEC3]" />
                    Past
                  </h2>
                  <div className="space-y-4">
                    {past.map((booking, i) => (
                      <BookingCard key={booking.id || booking.booking_id} booking={booking} index={i} isPast />
                    ))}
                  </div>
                </section>
              )}

              {/* Cancelled Bookings */}
              {cancelled.length > 0 && (
                <section>
                  <h2 className="text-lg font-extrabold text-[#2D3436] dark:text-white mb-4 flex items-center gap-2 animate-fade-in-up">
                    <span className="w-2 h-2 rounded-full bg-[#FF6B6B]" />
                    Cancelled
                  </h2>
                  <div className="space-y-4">
                    {cancelled.map((booking, i) => (
                      <BookingCard key={booking.id || booking.booking_id} booking={booking} index={i} isPast />
                    ))}
                  </div>
                </section>
              )}
            </div>
          )}
        </div>

        {/* Cancel Confirmation Modal */}
        {showCancelModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm animate-fade-in px-4">
            <div className="card-cartoon p-6 sm:p-8 max-w-md w-full animate-fade-in-up">
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-[#FF6B6B]/10 flex items-center justify-center">
                  <HiXCircle className="text-3xl text-[#FF6B6B]" />
                </div>
                <h3 className="text-xl font-extrabold text-[#2D3436] dark:text-white mb-2">
                  Cancel Booking?
                </h3>
                <p className="text-sm text-[#636E72] dark:text-[#B2BEC3] mb-4">
                  Are you sure you want to cancel this booking? This action cannot be undone.
                </p>

                {cancelError && (
                  <div className="flex items-center gap-2 p-3 rounded-2xl bg-[#FF6B6B]/10 text-[#FF6B6B] mb-4">
                    <HiExclamation className="w-5 h-5 flex-shrink-0" />
                    <span className="text-xs font-bold">{cancelError}</span>
                  </div>
                )}

                <div className="flex gap-3">
                  <button
                    onClick={() => { setShowCancelModal(null); setCancelError(''); }}
                    className="flex-1 py-3 rounded-full font-bold text-[#636E72] dark:text-[#B2BEC3] border-2 border-[#E8E8E4] dark:border-[#3D3D5C] hover:border-[#2D3436] dark:hover:border-white hover:text-[#2D3436] dark:hover:text-white transition-all text-sm"
                  >
                    Keep Booking
                  </button>
                  <button
                    onClick={() => handleCancel(showCancelModal)}
                    disabled={cancellingId === showCancelModal}
                    className="flex-1 py-3 rounded-full font-bold text-white bg-[#FF6B6B] hover:bg-[#E85555] transition-all text-sm disabled:opacity-60"
                  >
                    {cancellingId === showCancelModal ? 'Cancelling...' : 'Yes, Cancel'}
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

function BookingCard({ booking, index = 0, isPast = false, onCancel }) {
  const place = booking.place;
  const nights = getNights(booking.checkIn, booking.checkOut);
  const status = statusConfig[booking.status] || statusConfig.confirmed;
  const StatusIcon = status.icon;
  const isActive = !isPast && (booking.status === 'confirmed' || booking.status === 'pending');

  // Show 72h warning for confirmed bookings close to check-in
  const hoursLeft = getHoursUntilCheckIn(booking.checkIn);
  const showNoCancel = booking.status === 'confirmed' && hoursLeft < 72 && hoursLeft > 0 && !isPast;

  return (
    <div
      className="card-cartoon animate-fade-in-up opacity-0 group"
      style={{
        animationDelay: `${index * 0.07}s`,
        animationFillMode: 'forwards',
      }}
    >
      <div className="flex flex-col sm:flex-row">
        {/* Image */}
        <Link href={`/place/${place?.place_id}`} className="relative w-full sm:w-48 md:w-56 aspect-[16/10] sm:aspect-[4/3] flex-shrink-0 overflow-hidden rounded-t-[20px] sm:rounded-t-none sm:rounded-l-[20px]">
          <Image
            src={place?.image || 'https://picsum.photos/seed/booking/800/600'}
            alt={place?.name || 'Booking'}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 640px) 100vw, 224px"
          />
          {isPast && (
            <div className="absolute inset-0 bg-white/30 dark:bg-black/30" />
          )}
        </Link>

        {/* Details */}
        <div className={`flex-1 p-4 sm:p-5 flex flex-col justify-between min-w-0 ${isPast ? 'opacity-60' : ''}`}>
          <div>
            <div className="flex items-start justify-between gap-3 mb-2">
              <Link href={`/place/${place?.place_id}`}>
                <h3 className="text-base sm:text-lg font-extrabold text-[#2D3436] dark:text-white truncate hover:text-[#FF6B6B] transition-colors">
                  {place?.name || 'Unknown Place'}
                </h3>
              </Link>
              <span className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold flex-shrink-0 ${status.badgeClass}`}>
                <StatusIcon className="text-sm" />
                {status.label}
              </span>
            </div>

            {place?.city && (
              <div className="flex items-center gap-1 text-sm text-[#636E72] dark:text-[#B2BEC3] mb-3">
                <HiLocationMarker className="text-[#FF6B6B] flex-shrink-0" />
                <span>{place.city.name}</span>
              </div>
            )}

            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-[#636E72] dark:text-[#B2BEC3]">
              <div className="flex items-center gap-1.5">
                <HiCalendar className="text-[#4ECDC4]" />
                <span>
                  {formatDate(booking.checkIn)} → {formatDate(booking.checkOut)}
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <HiUsers className="text-[#A29BFE]" />
                <span>
                  {booking.guests} guest{booking.guests !== 1 ? 's' : ''}
                </span>
              </div>
              <span className="text-[#B2BEC3]">·</span>
              <span className="font-medium">
                {nights} night{nights !== 1 ? 's' : ''}
              </span>
            </div>

            {/* 72h warning */}
            {showNoCancel && (
              <div className="flex items-center gap-1.5 mt-3 px-3 py-2 rounded-xl bg-[#FFE66D]/15 text-[#C9A227] text-xs font-bold">
                <HiExclamation className="text-sm flex-shrink-0" />
                Annulation impossible : moins de 72h avant le check-in
              </div>
            )}
          </div>

          <div className="flex items-center justify-between mt-4 pt-3 border-t border-[#E8E8E4] dark:border-[#2D2D4A]">
            <span className="text-sm text-[#636E72] dark:text-[#B2BEC3]">Total price</span>
            <div className="flex items-center gap-3">
              <span className="text-lg font-extrabold text-[#FF6B6B]">{booking.totalPrice}€</span>
              {isActive && onCancel && (
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    onCancel();
                  }}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-bold text-[#FF6B6B] border-2 border-[#FF6B6B]/20 hover:bg-[#FF6B6B]/10 transition-all"
                >
                  <HiX className="text-sm" />
                  Cancel
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
