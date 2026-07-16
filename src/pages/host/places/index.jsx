import Head from 'next/head';
import Layout from '../../../components/Layout';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Loading from '../../../components/loading/Loading';
import { HiHome, HiPlus, HiPencil, HiStar, HiTrash } from 'react-icons/hi';
import { toast } from 'react-toastify';

export default function HostPlaces() {
  const [places, setPlaces] = useState(null);
  const [deleting, setDeleting] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');

    if (!token || (role !== 'HOST' && role !== 'HOST_PENDING' && role !== 'ADMIN')) {
      router.push('/');
      return;
    }

    fetch('/api/host/places', {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        if (!res.ok) throw new Error('Failed');
        return res.json();
      })
      .then((data) => setPlaces(data))
      .catch(() => router.push('/'));
  }, [router]);

  const handleDelete = async (placeId) => {
    if (!confirm('Are you sure you want to delete this place? This action cannot be undone.')) return;

    const token = localStorage.getItem('token');
    setDeleting(placeId);
    try {
      const res = await fetch(`/api/host/places/${placeId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        setPlaces((prev) => prev.filter((p) => p.place_id !== placeId));
        toast.success('Place deleted successfully');
      } else {
        toast.error('Failed to delete place.');
      }
    } catch {
      toast.error('An error occurred.');
    } finally {
      setDeleting(null);
    }
  };

  if (places === null) {
    return (
      <Layout>
        <Loading />
      </Layout>
    );
  }

  const role = typeof window !== 'undefined' ? localStorage.getItem('role') : null;

  return (
    <>
      <Head>
        <title>Manage My Places – AirAl</title>
        <meta name="description" content="Manage your hosted places on AirAl" />
      </Head>
      <Layout>
        <div className="max-w-5xl mx-auto px-4 py-8 sm:py-12">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8 sm:mb-10 animate-fade-in-up">
            <div>
              <div className="flex items-center gap-3 mb-1">
                <div className="w-10 h-10 rounded-full bg-[#0984E3]/10 flex items-center justify-center">
                  <HiHome className="text-xl text-[#0984E3]" />
                </div>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-[#2D3436] dark:text-white">
                  My Places
                </h1>
              </div>
              <p className="text-sm text-[#636E72] dark:text-[#B2BEC3] ml-[52px]">
                {places.length} {places.length === 1 ? 'place' : 'places'} listed
              </p>
            </div>
            {role !== 'HOST_PENDING' && (
              <Link
                href="/host/places/new"
                className="flex items-center justify-center gap-2 px-6 py-3 rounded-full font-bold text-white bg-gradient-to-r from-[#FF6B6B] to-[#FF8E53] hover:opacity-90 transition-all shadow-lg text-sm"
              >
                <HiPlus className="text-lg" />
                Add New Place
              </Link>
            )}
          </div>

          {/* Content */}
          {places.length === 0 ? (
            role === 'HOST_PENDING' ? (
              <div className="card-cartoon p-12 flex flex-col items-center justify-center text-center animate-fade-in border-2 border-[#FFE66D]/50 bg-[#FFE66D]/5">
                <div className="w-20 h-20 mb-4 rounded-full bg-[#FFE66D]/20 flex items-center justify-center">
                  <HiStar className="text-4xl text-[#C9A227]" />
                </div>
                <h3 className="text-lg font-extrabold text-[#2D3436] dark:text-white mb-2">
                  Account Under Review
                </h3>
                <p className="text-sm text-[#636E72] dark:text-[#B2BEC3] mb-6 max-w-sm">
                  Your host application is currently being reviewed by an administrator. Once validated, you will be able to add places and start hosting!
                </p>
              </div>
            ) : (
              <div className="card-cartoon p-12 flex flex-col items-center justify-center text-center animate-fade-in">
                <div className="w-20 h-20 mb-4 rounded-full bg-[#0984E3]/10 flex items-center justify-center">
                  <HiHome className="text-4xl text-[#0984E3]" />
                </div>
                <h3 className="text-lg font-extrabold text-[#2D3436] dark:text-white mb-2">
                  No Places Yet
                </h3>
                <p className="text-sm text-[#636E72] dark:text-[#B2BEC3] mb-6 max-w-sm">
                  Start hosting by adding your first place. Share your property with travelers around the world!
                </p>
                <Link
                  href="/host/places/new"
                  className="flex items-center gap-2 px-6 py-3 rounded-full font-bold text-white bg-gradient-to-r from-[#FF6B6B] to-[#FF8E53] hover:opacity-90 transition-all text-sm"
                >
                  <HiPlus className="text-lg" />
                  Add Your First Place
                </Link>
              </div>
            )
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {places.map((place, i) => (
                <div
                  key={place.place_id}
                  className="card-cartoon overflow-hidden animate-fade-in-up opacity-0"
                  style={{ animationDelay: `${i * 0.08}s`, animationFillMode: 'forwards' }}
                >
                  {/* Image */}
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={place.image}
                      alt={place.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.src =
                          'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=400&q=80';
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
                  </div>

                  {/* Info */}
                  <div className="p-5">
                    <h3 className="text-base font-extrabold text-[#2D3436] dark:text-white mb-1 truncate">
                      {place.name}
                    </h3>
                    <p className="text-xs text-[#636E72] dark:text-[#B2BEC3] mb-3 line-clamp-2">
                      {place.description}
                    </p>

                    <div className="flex items-center justify-between text-xs text-[#636E72] dark:text-[#B2BEC3] mb-4">
                      <span>
                        <strong className="text-[#2D3436] dark:text-white">{place.priceByNight}€</strong> / night
                      </span>
                      <span>
                        {place.maxGuests} guests · {place.numberOfRooms} rooms
                      </span>
                    </div>

                    <div className="flex gap-2">
                      <Link
                        href={`/host/places/edit/${place.place_id}`}
                        className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-full border-2 border-[#0984E3] text-[#0984E3] text-xs font-bold hover:bg-[#0984E3] hover:text-white transition-all"
                      >
                        <HiPencil />
                        Edit
                      </Link>
                      <button
                        onClick={() => handleDelete(place.place_id)}
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
      </Layout>
    </>
  );
}
