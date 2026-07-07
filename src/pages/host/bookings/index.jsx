import Head from 'next/head';
import Layout from '../../../components/Layout';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Loading from '../../../components/loading/Loading';
import Link from 'next/link';
import Image from 'next/image';
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
} from 'react-icons/hi';

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

export default function HostBookingsPage() {
  const [data, setData] = useState(null);
  const [activeTab, setActiveTab] = useState('upcoming');
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/Auth/login');
      return;
    }

    fetch('/api/host/bookings', {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        if (res.status === 403 || res.status === 401) {
          router.push('/');
          throw new Error('Unauthorized');
        }
        if (!res.ok) throw new Error('Failed');
        return res.json();
      })
      .then((d) => setData(d))
      .catch((err) => console.error(err));
  }, [router]);

  if (!data) {
    return (
      <Layout>
        <Loading />
      </Layout>
    );
  }

  const now = new Date();
  const bookings = data.bookings || [];

  const upcoming = bookings.filter(
    (b) => new Date(b.checkOut) >= now && b.status === 'confirmed'
  );
  const past = bookings.filter(
    (b) => new Date(b.checkOut) < now && b.status !== 'cancelled'
  );
  const cancelled = bookings.filter((b) => b.status === 'cancelled');

  const tabs = [
    { key: 'upcoming', label: 'Upcoming', count: upcoming.length, color: '#4ECDC4' },
    { key: 'past', label: 'Past', count: past.length, color: '#B2BEC3' },
    { key: 'cancelled', label: 'Cancelled', count: cancelled.length, color: '#FF6B6B' },
  ];

  const activeBookings =
    activeTab === 'upcoming' ? upcoming : activeTab === 'past' ? past : cancelled;

  return (
    <>
      <Head>
        <title>Host Bookings – AirAl</title>
        <meta name="description" content="Manage bookings for your places" />
      </Head>
      <Layout>
        <div className="max-w-5xl mx-auto px-4 py-8 sm:py-12">
          {/* Header */}
          <div className="mb-8 animate-fade-in-up">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-full bg-[#0984E3]/10 flex items-center justify-center">
                <HiClipboardList className="text-xl text-[#0984E3]" />
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-[#2D3436] dark:text-white">
                Guest Bookings
              </h1>
            </div>
            <p className="text-sm text-[#636E72] dark:text-[#B2BEC3] ml-[52px]">
              Bookings received on your properties
            </p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-3 gap-4 mb-8 animate-fade-in-up stagger-1">
            <div className="card-cartoon p-4 sm:p-5 text-center">
              <div className="w-10 h-10 mx-auto mb-2 rounded-full bg-[#0984E3]/10 flex items-center justify-center">
                <HiClipboardList className="text-lg text-[#0984E3]" />
              </div>
              <div className="text-xl sm:text-2xl font-extrabold text-[#2D3436] dark:text-white">
                {data.stats?.total || 0}
              </div>
              <div className="text-xs text-[#B2BEC3] font-medium mt-0.5">Total Bookings</div>
            </div>
            <div className="card-cartoon p-4 sm:p-5 text-center">
              <div className="w-10 h-10 mx-auto mb-2 rounded-full bg-[#55EFC4]/10 flex items-center justify-center">
                <HiCurrencyDollar className="text-lg text-[#00B894]" />
              </div>
              <div className="text-xl sm:text-2xl font-extrabold text-[#2D3436] dark:text-white">
                {data.stats?.revenue || 0}€
              </div>
              <div className="text-xs text-[#B2BEC3] font-medium mt-0.5">Total Revenue</div>
            </div>
            <div className="card-cartoon p-4 sm:p-5 text-center">
              <div className="w-10 h-10 mx-auto mb-2 rounded-full bg-[#4ECDC4]/10 flex items-center justify-center">
                <HiTrendingUp className="text-lg text-[#4ECDC4]" />
              </div>
              <div className="text-xl sm:text-2xl font-extrabold text-[#2D3436] dark:text-white">
                {data.stats?.upcoming || 0}
              </div>
              <div className="text-xs text-[#B2BEC3] font-medium mt-0.5">Upcoming</div>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex items-center gap-2 mb-6 animate-fade-in-up stagger-2">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-bold transition-all ${
                  activeTab === tab.key
                    ? 'bg-[#2D3436] dark:bg-white text-white dark:text-[#2D3436]'
                    : 'text-[#636E72] dark:text-[#B2BEC3] hover:bg-[#F0F0EC] dark:hover:bg-[#232340]'
                }`}
              >
                {tab.label}
                <span
                  className={`px-1.5 py-0.5 rounded-full text-xs ${
                    activeTab === tab.key
                      ? 'bg-white/20 dark:bg-black/20'
                      : 'bg-[#E8E8E4] dark:bg-[#3D3D5C]'
                  }`}
                >
                  {tab.count}
                </span>
              </button>
            ))}
          </div>

          {/* Booking List */}
          {activeBookings.length === 0 ? (
            <div className="card-cartoon p-12 flex flex-col items-center justify-center text-center animate-fade-in">
              <div className="w-20 h-20 mb-4 rounded-full bg-[#4ECDC4]/10 flex items-center justify-center">
                <HiCalendar className="text-4xl text-[#4ECDC4]/40" />
              </div>
              <h3 className="text-lg font-extrabold text-[#2D3436] dark:text-white mb-2">
                No {activeTab} bookings
              </h3>
              <p className="text-sm text-[#636E72] dark:text-[#B2BEC3]">
                {activeTab === 'upcoming'
                  ? 'When guests book your places, upcoming bookings will appear here.'
                  : `No ${activeTab} bookings to show.`}
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {activeBookings.map((booking, i) => (
                <HostBookingCard key={booking.id || booking.booking_id} booking={booking} index={i} />
              ))}
            </div>
          )}
        </div>
      </Layout>
    </>
  );
}

function HostBookingCard({ booking, index = 0 }) {
  const place = booking.place;
  const guest = booking.user;
  const nights = getNights(booking.checkIn, booking.checkOut);
  const status = statusConfig[booking.status] || statusConfig.confirmed;
  const StatusIcon = status.icon;

  return (
    <div
      className="card-cartoon animate-fade-in-up opacity-0"
      style={{
        animationDelay: `${index * 0.07}s`,
        animationFillMode: 'forwards',
      }}
    >
      <div className="p-5">
        {/* Header: Place + Status */}
        <div className="flex items-start justify-between gap-3 mb-4">
          <div className="flex items-center gap-3 min-w-0">
            <div className="relative w-12 h-12 rounded-2xl overflow-hidden flex-shrink-0">
              <Image
                src={place?.image || 'https://picsum.photos/seed/booking/200/200'}
                alt={place?.name || 'Place'}
                fill
                className="object-cover"
                sizes="48px"
              />
            </div>
            <div className="min-w-0">
              <Link href={`/place/${place?.place_id}`}>
                <h3 className="text-sm font-extrabold text-[#2D3436] dark:text-white truncate hover:text-[#FF6B6B] transition-colors">
                  {place?.name || 'Unknown Place'}
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
          <span className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold flex-shrink-0 ${status.badgeClass}`}>
            <StatusIcon className="text-sm" />
            {status.label}
          </span>
        </div>

        {/* Guest Info */}
        <div className="flex items-center gap-3 p-3 rounded-2xl bg-[#FAFAF8] dark:bg-[#1A1A2E] mb-4">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#A29BFE] to-[#6C5CE7] flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
            {guest?.name?.charAt(0)?.toUpperCase() || 'G'}
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1.5 text-sm font-bold text-[#2D3436] dark:text-white">
              <HiUser className="text-[#A29BFE] text-xs" />
              {guest?.name || 'Guest'}
            </div>
            <div className="flex items-center gap-1.5 text-xs text-[#B2BEC3]">
              <HiMail className="text-xs" />
              {guest?.email || 'No email'}
            </div>
          </div>
        </div>

        {/* Booking Details */}
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

        {/* Price */}
        <div className="flex items-center justify-between mt-4 pt-3 border-t border-[#E8E8E4] dark:border-[#2D2D4A]">
          <span className="text-sm text-[#636E72] dark:text-[#B2BEC3]">Total earned</span>
          <span className="text-lg font-extrabold text-[#00B894]">{booking.totalPrice}€</span>
        </div>
      </div>
    </div>
  );
}
