import Head from 'next/head';
import Layout from '../../../components/Layout';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Loading from '../../../components/loading/Loading';
import Link from 'next/link';
import {
  HiUser,
  HiMail,
  HiCalendar,
  HiHeart,
  HiStar,
  HiPencil,
  HiCheck,
  HiX,
  HiCheckCircle,
  HiHome,
  HiPhotograph,
} from 'react-icons/hi';

export default function ProfilePage() {
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [flash, setFlash] = useState(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // Edit form state
  const [editName, setEditName] = useState('');
  const [editEmail, setEditEmail] = useState('');
  const [editBio, setEditBio] = useState('');
  const [editAvatar, setEditAvatar] = useState('');
  const [editPassword, setEditPassword] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/Auth/login');
      return;
    }

    fetch('/api/auth/me', {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        if (!res.ok) throw new Error('Failed');
        return res.json();
      })
      .then((data) => {
        setUser(data.user);
        setStats(data.stats);
        setEditName(data.user?.name || '');
        setEditEmail(data.user?.email || '');
        setEditBio(data.user?.bio || '');
        setEditAvatar(data.user?.avatar || '');
      })
      .catch(() => {
        router.push('/Auth/login');
      });
  }, [router]);

  const handleSave = async () => {
    const token = localStorage.getItem('token');
    if (!token) return;

    setLoading(true);
    try {
      const res = await fetch('/api/auth/me', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: editName,
          email: editEmail,
          bio: editBio,
          avatar: editAvatar,
          ...(editPassword.trim() ? { password: editPassword } : {}),
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setUser(data.user);
        localStorage.setItem('UserName', data.user.name);
        if (data.token) {
          localStorage.setItem('token', data.token);
        }
        setIsEditing(false);
        setEditPassword('');
        setFlash('Profile updated successfully!');
        setTimeout(() => setFlash(null), 3000);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const cancelEdit = () => {
    setIsEditing(false);
    setEditName(user?.name || '');
    setEditEmail(user?.email || '');
    setEditBio(user?.bio || '');
    setEditAvatar(user?.avatar || '');
    setEditPassword('');
  };

  if (!user) {
    return (
      <Layout>
        <Loading />
      </Layout>
    );
  }

  const memberSince = new Date(user.createdAt).toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric',
  });

  const roleLabels = {
    USER: { label: 'Guest', color: 'bg-[#4ECDC4]/15 text-[#3BADA6]' },
    HOST: { label: 'Host', color: 'bg-[#6C5CE7]/15 text-[#6C5CE7]' },
    HOST_PENDING: { label: 'Host (Pending)', color: 'bg-[#FFE66D]/20 text-[#C9A227]' },
    ADMIN: { label: 'Admin', color: 'bg-[#FF6B6B]/15 text-[#FF6B6B]' },
  };

  const roleInfo = roleLabels[user.role] || roleLabels.USER;

  const inputClass =
    'w-full px-4 py-3 rounded-2xl border-2 border-[#E8E8E4] dark:border-[#3D3D5C] bg-white dark:bg-[#232340] text-[#2D3436] dark:text-white text-sm font-semibold focus:border-[#4ECDC4] focus:ring-0 outline-none transition-all placeholder:text-[#B2BEC3]';

  return (
    <>
      <Head>
        <title>My Profile – AirAl</title>
        <meta name="description" content="Manage your AirAl profile" />
      </Head>
      <Layout>
        <div className="max-w-3xl mx-auto px-4 py-8 sm:py-12">
          {/* Flash Message */}
          {flash && (
            <div className="mb-6 flex items-center gap-2 p-3 rounded-2xl bg-[#55EFC4]/15 text-[#00B894] animate-fade-in-up">
              <HiCheckCircle className="w-5 h-5 flex-shrink-0" />
              <span className="text-sm font-bold">{flash}</span>
            </div>
          )}

          {/* Profile Header Card */}
          <div className="card-cartoon p-6 sm:p-8 mb-6 animate-fade-in-up">
            <div className="flex flex-col sm:flex-row items-start gap-5">
              {/* Avatar */}
              <div className="relative flex-shrink-0">
                {user.avatar ? (
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="w-20 h-20 sm:w-24 sm:h-24 rounded-full object-cover border-4 border-white dark:border-[#232340] shadow-cartoon"
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.nextSibling.style.display = 'flex';
                    }}
                  />
                ) : null}
                <div
                  className={`w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-gradient-to-br from-[#FF6B6B] to-[#FF8E53] flex items-center justify-center text-white text-2xl sm:text-3xl font-extrabold shadow-cartoon ${
                    user.avatar ? 'hidden' : ''
                  }`}
                >
                  {user.name?.charAt(0)?.toUpperCase() || 'U'}
                </div>
              </div>

              {/* User Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h1 className="text-2xl sm:text-3xl font-extrabold text-[#2D3436] dark:text-white">
                      {user.name}
                    </h1>
                    <div className="flex flex-wrap items-center gap-2 mt-2">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${roleInfo.color}`}>
                        {roleInfo.label}
                      </span>
                      <span className="text-sm text-[#B2BEC3] flex items-center gap-1">
                        <HiCalendar className="text-xs" />
                        Member since {memberSince}
                      </span>
                    </div>
                  </div>
                  {!isEditing && (
                    <button
                      onClick={() => setIsEditing(true)}
                      className="flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-bold text-[#636E72] dark:text-[#B2BEC3] border-2 border-[#E8E8E4] dark:border-[#3D3D5C] hover:border-[#4ECDC4] hover:text-[#4ECDC4] transition-all"
                    >
                      <HiPencil />
                      Edit
                    </button>
                  )}
                </div>

                <div className="flex items-center gap-2 mt-3 text-sm text-[#636E72] dark:text-[#B2BEC3]">
                  <HiMail className="text-[#A29BFE]" />
                  <span>{user.email}</span>
                </div>

                {user.bio && (
                  <p className="mt-3 text-sm text-[#636E72] dark:text-[#B2BEC3] leading-relaxed">
                    {user.bio}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Stats Cards */}
          {stats && (
            <div className="grid grid-cols-3 gap-4 mb-6 animate-fade-in-up stagger-1">
              <div className="card-cartoon p-4 sm:p-5 text-center">
                <div className="w-10 h-10 mx-auto mb-2 rounded-full bg-[#4ECDC4]/10 flex items-center justify-center">
                  <HiCalendar className="text-lg text-[#4ECDC4]" />
                </div>
                <div className="text-xl sm:text-2xl font-extrabold text-[#2D3436] dark:text-white">
                  {stats.bookings}
                </div>
                <div className="text-xs text-[#B2BEC3] font-medium mt-0.5">Bookings</div>
              </div>
              <div className="card-cartoon p-4 sm:p-5 text-center">
                <div className="w-10 h-10 mx-auto mb-2 rounded-full bg-[#FFE66D]/15 flex items-center justify-center">
                  <HiStar className="text-lg text-[#FDCB6E]" />
                </div>
                <div className="text-xl sm:text-2xl font-extrabold text-[#2D3436] dark:text-white">
                  {stats.reviews}
                </div>
                <div className="text-xs text-[#B2BEC3] font-medium mt-0.5">Reviews</div>
              </div>
              <div className="card-cartoon p-4 sm:p-5 text-center">
                <div className="w-10 h-10 mx-auto mb-2 rounded-full bg-[#FF6B6B]/10 flex items-center justify-center">
                  <HiHeart className="text-lg text-[#FF6B6B]" />
                </div>
                <div className="text-xl sm:text-2xl font-extrabold text-[#2D3436] dark:text-white">
                  {stats.favorites}
                </div>
                <div className="text-xs text-[#B2BEC3] font-medium mt-0.5">Favorites</div>
              </div>
            </div>
          )}

          {/* Edit Form */}
          {isEditing && (
            <div className="card-cartoon p-6 sm:p-8 mb-6 animate-fade-in-up">
              <h2 className="text-lg font-extrabold text-[#2D3436] dark:text-white mb-5 flex items-center gap-2">
                <HiPencil className="text-[#4ECDC4]" />
                Edit Profile
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-extrabold text-[#2D3436] dark:text-white mb-1.5">
                    Name
                  </label>
                  <input
                    type="text"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className={inputClass}
                    placeholder="Your name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-extrabold text-[#2D3436] dark:text-white mb-1.5">
                    Email
                  </label>
                  <input
                    type="email"
                    value={editEmail}
                    onChange={(e) => setEditEmail(e.target.value)}
                    className={inputClass}
                    placeholder="your@email.com"
                  />
                </div>
                <div>
                  <label className="block text-sm font-extrabold text-[#2D3436] dark:text-white mb-1.5">
                    <HiPhotograph className="inline mr-1.5 text-[#6C5CE7]" />
                    Avatar URL
                  </label>
                  <input
                    type="url"
                    value={editAvatar}
                    onChange={(e) => setEditAvatar(e.target.value)}
                    className={inputClass}
                    placeholder="https://example.com/photo.jpg"
                  />
                  {editAvatar && (
                    <div className="mt-2 flex items-center gap-3">
                      <img
                        src={editAvatar}
                        alt="Preview"
                        className="w-12 h-12 rounded-full object-cover border-2 border-[#E8E8E4] dark:border-[#3D3D5C]"
                        onError={(e) => (e.target.style.display = 'none')}
                      />
                      <span className="text-xs text-[#B2BEC3]">Avatar preview</span>
                    </div>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-extrabold text-[#2D3436] dark:text-white mb-1.5">
                    Bio
                  </label>
                  <textarea
                    value={editBio}
                    onChange={(e) => setEditBio(e.target.value)}
                    className={`${inputClass} resize-none`}
                    rows={3}
                    placeholder="Tell us about yourself..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-extrabold text-[#2D3436] dark:text-white mb-1.5">
                    New Password
                  </label>
                  <input
                    type="password"
                    value={editPassword}
                    onChange={(e) => setEditPassword(e.target.value)}
                    className={inputClass}
                    placeholder="Leave blank to keep current password"
                  />
                </div>
                <div className="flex gap-3 pt-2">
                  <button
                    onClick={cancelEdit}
                    className="flex-1 py-3 rounded-full font-bold text-[#636E72] dark:text-[#B2BEC3] border-2 border-[#E8E8E4] dark:border-[#3D3D5C] hover:border-[#2D3436] dark:hover:border-white hover:text-[#2D3436] dark:hover:text-white transition-all text-sm flex items-center justify-center gap-1.5"
                  >
                    <HiX />
                    Cancel
                  </button>
                  <button
                    onClick={handleSave}
                    disabled={loading}
                    className="flex-1 py-3 rounded-full font-bold text-white bg-gradient-to-r from-[#4ECDC4] to-[#44B0A8] hover:opacity-90 transition-all text-sm disabled:opacity-60 flex items-center justify-center gap-1.5"
                  >
                    <HiCheck />
                    {loading ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Quick Links */}
          <div className="card-cartoon p-6 sm:p-8 animate-fade-in-up stagger-2">
            <h2 className="text-lg font-extrabold text-[#2D3436] dark:text-white mb-4">
              Quick Links
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Link
                href="/bookings"
                className="flex items-center gap-3 p-3 rounded-2xl hover:bg-[#F0F0EC] dark:hover:bg-[#2D2D4A] transition-all"
              >
                <div className="w-10 h-10 rounded-full bg-[#4ECDC4]/10 flex items-center justify-center">
                  <HiCalendar className="text-[#4ECDC4]" />
                </div>
                <div>
                  <div className="text-sm font-bold text-[#2D3436] dark:text-white">My Bookings</div>
                  <div className="text-xs text-[#B2BEC3]">View your trips</div>
                </div>
              </Link>
              <Link
                href="/favorites"
                className="flex items-center gap-3 p-3 rounded-2xl hover:bg-[#F0F0EC] dark:hover:bg-[#2D2D4A] transition-all"
              >
                <div className="w-10 h-10 rounded-full bg-[#FF6B6B]/10 flex items-center justify-center">
                  <HiHeart className="text-[#FF6B6B]" />
                </div>
                <div>
                  <div className="text-sm font-bold text-[#2D3436] dark:text-white">Favorites</div>
                  <div className="text-xs text-[#B2BEC3]">Saved places</div>
                </div>
              </Link>

              {user.role === 'USER' && (
                <Link
                  href="/Auth/register"
                  className="flex items-center gap-3 p-3 rounded-2xl hover:bg-[#F0F0EC] dark:hover:bg-[#2D2D4A] transition-all sm:col-span-2"
                >
                  <div className="w-10 h-10 rounded-full bg-[#6C5CE7]/10 flex items-center justify-center">
                    <HiHome className="text-[#6C5CE7]" />
                  </div>
                  <div>
                    <div className="text-sm font-bold text-[#2D3436] dark:text-white">Become a Host</div>
                    <div className="text-xs text-[#B2BEC3]">Start earning by sharing your space</div>
                  </div>
                </Link>
              )}

              {(user.role === 'HOST' || user.role === 'ADMIN') && (
                <Link
                  href="/host/places"
                  className="flex items-center gap-3 p-3 rounded-2xl hover:bg-[#F0F0EC] dark:hover:bg-[#2D2D4A] transition-all"
                >
                  <div className="w-10 h-10 rounded-full bg-[#0984E3]/10 flex items-center justify-center">
                    <HiHome className="text-[#0984E3]" />
                  </div>
                  <div>
                    <div className="text-sm font-bold text-[#2D3436] dark:text-white">My Places</div>
                    <div className="text-xs text-[#B2BEC3]">Manage your listings</div>
                  </div>
                </Link>
              )}
            </div>
          </div>
        </div>
      </Layout>
    </>
  );
}