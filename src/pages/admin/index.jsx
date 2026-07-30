import Head from "next/head";
import Layout from "../../components/Layout";
import { useState, useEffect, useCallback, useMemo } from "react";
import { useRouter } from "next/router";
import Loading from "../../components/loading/Loading";
import Link from "next/link";
import { useTranslation } from "../../lib/i18n/LanguageContext";
import {
  HiCheck,
  HiShieldCheck,
  HiUser,
  HiLocationMarker,
  HiClock,
  HiPhone,
  HiIdentification,
  HiX,
  HiCheckCircle,
  HiBan,
  HiHome,
  HiCalendar,
  HiCurrencyDollar,
  HiUsers,
  HiTrash,
  HiExclamationCircle,
  HiChat,
  HiSearch,
  HiFilter,
} from "react-icons/hi";
import { toast } from "react-toastify";

export default function AdminDashboard() {
  const [hosts, setHosts] = useState(null);
  const [users, setUsers] = useState([]);
  const [places, setPlaces] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [stats, setStats] = useState(null);

  const [loadingAction, setLoadingAction] = useState(null);
  const [viewingDocument, setViewingDocument] = useState(null);
  const [activeTab, setActiveTab] = useState("hosts");
  const [hostSubTab, setHostSubTab] = useState("pending");

  const [confirmModal, setConfirmModal] = useState(null);

  const [placeSearch, setPlaceSearch] = useState("");
  const [selectedHostFilter, setSelectedHostFilter] = useState("ALL");
  const [selectedCityFilter, setSelectedCityFilter] = useState("ALL");

  const [userSearch, setUserSearch] = useState("");
  const [selectedUserRoleFilter, setSelectedUserRoleFilter] = useState("ALL");

  const router = useRouter();
  const { t, dateLocale } = useTranslation();

  const fetchAdminData = useCallback(async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/");
      return;
    }

    const headers = { Authorization: `Bearer ${token}` };

    try {
      const [resHosts, resUsers, resPlaces, resBookings, resStats] =
        await Promise.all([
          fetch("/api/admin/hosts", { headers }),
          fetch("/api/admin/users", { headers }),
          fetch("/api/admin/places", { headers }),
          fetch("/api/admin/bookings", { headers }),
          fetch("/api/admin/stats", { headers }),
        ]);

      if (resHosts.status === 403 || resHosts.status === 401) {
        router.push("/");
        return;
      }

      if (resHosts.ok) setHosts(await resHosts.json());
      if (resUsers.ok) setUsers(await resUsers.json());
      if (resPlaces.ok) setPlaces(await resPlaces.json());
      if (resBookings.ok) setBookings(await resBookings.json());
      if (resStats.ok) setStats(await resStats.json());
    } catch (err) {
      console.error("Failed fetching admin data:", err);
      toast.error(t("toast.serverError"));
    }
  }, [router, t]);

  useEffect(() => {
    fetchAdminData();
  }, [fetchAdminData]);

  const handleApprove = async (userId) => {
    const token = localStorage.getItem("token");
    if (!token) return;

    setLoadingAction(userId);
    try {
      const res = await fetch("/api/admin/hosts/approve", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ targetUserId: userId }),
      });

      if (res.ok) {
        setHosts((prev) =>
          prev.map((host) =>
            host.user_id === userId ? { ...host, role: "HOST" } : host,
          ),
        );
        toast.success(t("admin.approveSuccess"));
      } else {
        toast.error(t("admin.approveFailed"));
      }
    } catch {
      toast.error(t("auth.networkError"));
    } finally {
      setLoadingAction(null);
    }
  };

  const handleToggleRole = async (userId, action) => {
    const token = localStorage.getItem("token");
    if (!token) return;

    setLoadingAction(`${action}-${userId}`);
    try {
      const res = await fetch("/api/admin/hosts/toggle-role", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ targetUserId: userId, action }),
      });

      if (res.ok) {
        setHosts((prev) =>
          prev.map((host) =>
            host.user_id === userId
              ? { ...host, role: action === "revoke" ? "HOST_REVOKED" : "HOST" }
              : host,
          ),
        );
        setUsers((prev) =>
          prev.map((u) =>
            u.user_id === userId
              ? { ...u, role: action === "revoke" ? "HOST_REVOKED" : "HOST" }
              : u,
          ),
        );
        toast.success(
          action === "revoke"
            ? t("admin.revokeSuccess")
            : t("admin.grantSuccess"),
        );
      } else {
        toast.error(t("admin.roleUpdateFailed"));
      }
    } catch {
      toast.error(t("auth.networkError"));
    } finally {
      setLoadingAction(null);
      setConfirmModal(null);
    }
  };

  const handleDeletePlace = async (placeId) => {
    const token = localStorage.getItem("token");
    if (!token) return;

    setLoadingAction(`delete-place-${placeId}`);
    try {
      const res = await fetch(`/api/admin/places?placeId=${placeId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.ok) {
        setPlaces((prev) => prev.filter((p) => p.place_id !== placeId));
        toast.success(t("admin.placeDeleted"));
      } else {
        toast.error(t("admin.placeDeleteFailed"));
      }
    } catch {
      toast.error(t("auth.networkError"));
    } finally {
      setLoadingAction(null);
      setConfirmModal(null);
    }
  };

  const filteredPlaces = useMemo(() => {
    return places.filter((p) => {
      const query = placeSearch.toLowerCase();
      const matchesQuery =
        !query ||
        p.name.toLowerCase().includes(query) ||
        p.city?.name?.toLowerCase().includes(query) ||
        p.host?.name?.toLowerCase().includes(query) ||
        p.host?.email?.toLowerCase().includes(query);

      const matchesHost =
        selectedHostFilter === "ALL" ||
        String(p.hostId) === String(selectedHostFilter);

      const matchesCity =
        selectedCityFilter === "ALL" ||
        p.city?.name?.toLowerCase() === selectedCityFilter.toLowerCase();

      return matchesQuery && matchesHost && matchesCity;
    });
  }, [places, placeSearch, selectedHostFilter, selectedCityFilter]);

  const filteredUsers = useMemo(() => {
    return users.filter((u) => {
      const query = userSearch.toLowerCase();
      const matchesQuery =
        !query ||
        u.name?.toLowerCase().includes(query) ||
        u.email?.toLowerCase().includes(query);

      const matchesRole =
        selectedUserRoleFilter === "ALL" || u.role === selectedUserRoleFilter;

      return matchesQuery && matchesRole;
    });
  }, [users, userSearch, selectedUserRoleFilter]);

  const uniqueHosts = useMemo(() => {
    const hostMap = new Map();
    places.forEach((p) => {
      if (p.host) hostMap.set(p.hostId, p.host);
    });
    return Array.from(hostMap.entries());
  }, [places]);

  const uniqueCities = useMemo(() => {
    const citySet = new Set();
    places.forEach((p) => {
      if (p.city?.name) citySet.add(p.city.name);
    });
    return Array.from(citySet);
  }, [places]);

  if (hosts === null) {
    return (
      <Layout>
        <Loading />
      </Layout>
    );
  }

  const pendingHosts = hosts.filter((h) => h.role === "HOST_PENDING");
  const approvedHosts = hosts.filter((h) => h.role === "HOST");
  const revokedHosts = hosts.filter(
    (h) => h.role === "HOST_REVOKED" || (h.role === "USER" && h.identityDocument),
  );

  const renderHostCard = (host) => (
    <div
      key={host.user_id}
      className="card-cartoon p-5 flex flex-col justify-between animate-fade-in-up"
    >
      <div>
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-[#E8E8E4] dark:bg-[#2D2D4A] flex items-center justify-center flex-shrink-0">
              <HiUser className="text-xl text-[#B2BEC3]" />
            </div>
            <div>
              <h3 className="font-extrabold text-[#2D3436] dark:text-white">
                {host.name}
              </h3>
              <p className="text-xs text-[#636E72] dark:text-[#B2BEC3]">
                {host.email}
              </p>
            </div>
          </div>
          {host.role === "HOST" && (
            <span className="px-2.5 py-1 rounded-full bg-[#55EFC4]/20 text-[#00B894] text-xs font-bold flex items-center gap-1">
              <HiCheckCircle className="text-sm" />
              {t("admin.statusApproved")}
            </span>
          )}
          {host.role === "HOST_PENDING" && (
            <span className="px-2.5 py-1 rounded-full bg-[#FDCB6E]/20 text-[#C9A227] text-xs font-bold flex items-center gap-1">
              <HiClock className="text-sm" />
              {t("admin.statusPending")}
            </span>
          )}
          {(host.role === "HOST_REVOKED" || (host.role === "USER" && host.identityDocument)) && (
            <span className="px-2.5 py-1 rounded-full bg-[#FF6B6B]/20 text-[#FF6B6B] text-xs font-bold flex items-center gap-1">
              <HiBan className="text-sm" />
              {t("admin.statusRevoked")}
            </span>
          )}
        </div>

        <div className="mb-4 space-y-3">
          <div className="flex items-start gap-2 text-sm">
            <HiLocationMarker className="text-[#FF6B6B] mt-0.5 flex-shrink-0" />
            <span className="text-[#636E72] dark:text-[#B2BEC3] leading-relaxed">
              <strong className="text-[#2D3436] dark:text-white block mb-0.5">
                {t("admin.address")}
              </strong>
              {host.address || t("admin.noAddress")}
            </span>
          </div>

          {host.phone && (
            <div className="flex items-start gap-2 text-sm">
              <HiPhone className="text-[#6C5CE7] mt-0.5 flex-shrink-0" />
              <span className="text-[#636E72] dark:text-[#B2BEC3] leading-relaxed">
                <strong className="text-[#2D3436] dark:text-white block mb-0.5">
                  {t("admin.phone")}
                </strong>
                {host.phone}
              </span>
            </div>
          )}

          {host.identityDocument && (
            <div className="flex items-start gap-2 text-sm">
              <HiIdentification className="text-[#FF6B6B] mt-0.5 flex-shrink-0" />
              <div className="w-full pr-2">
                <strong className="text-[#2D3436] dark:text-white block mb-1.5 flex items-center justify-between">
                  {t("admin.identityDocument")}
                </strong>
                <button
                  onClick={() => setViewingDocument(host.identityDocument)}
                  className="group/doc relative rounded-xl overflow-hidden border-2 border-[#E8E8E4] dark:border-[#3D3D5C] hover:border-[#6C5CE7] transition-all block w-full"
                >
                  {host.identityDocument.startsWith("data:image") ? (
                    <img
                      src={host.identityDocument}
                      alt="Identity Document"
                      className="w-full h-24 object-cover"
                    />
                  ) : (
                    <div className="w-full h-24 bg-[#F0F0EC] dark:bg-[#232340] flex items-center justify-center">
                      <span className="text-sm text-[#636E72] dark:text-[#B2BEC3] font-bold">
                        📄 PDF Document
                      </span>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-black/0 group-hover/doc:bg-black/30 transition-all flex items-center justify-center">
                    <span className="text-white font-bold text-xs opacity-0 group-hover/doc:opacity-100 transition-opacity">
                      {t("admin.clickView")}
                    </span>
                  </div>
                </button>
              </div>
            </div>
          )}

          <div className="flex items-start gap-2 text-xs text-[#B2BEC3] mt-2 pl-6">
            <span>
              {t("admin.registered")}:{" "}
              {new Date(host.createdAt).toLocaleDateString(dateLocale)}
            </span>
          </div>
        </div>
      </div>

      <div className="space-y-2 mt-4 pt-3 border-t border-[#E8E8E4] dark:border-[#2D2D4A]">
        <div className="flex gap-2">
          <Link
            href={`/host/${host.user_id}`}
            className="flex-1 py-2 rounded-full font-bold text-center border border-[#0984E3] text-[#0984E3] hover:bg-[#0984E3] hover:text-white transition-all text-xs flex items-center justify-center gap-1"
          >
            <HiHome />
            {t("host_places.myPlaces")}
          </Link>
          <Link
            href={`/messages?contact=${host.user_id}`}
            className="flex-1 py-2 rounded-full font-bold text-center border border-[#6C5CE7] text-[#6C5CE7] hover:bg-[#6C5CE7] hover:text-white transition-all text-xs flex items-center justify-center gap-1"
          >
            <HiChat />
            {t("place.contactHost")}
          </Link>
        </div>

        {host.role === "HOST_PENDING" && (
          <button
            onClick={() => handleApprove(host.user_id)}
            disabled={loadingAction === host.user_id}
            className="w-full py-2.5 rounded-full font-bold text-white bg-[#00B894] hover:bg-[#00A080] transition-colors shadow-sm disabled:opacity-70 flex justify-center items-center gap-2 text-xs"
          >
            {loadingAction === host.user_id ? (
              t("admin.approving")
            ) : (
              <>
                <HiCheck className="text-base" />
                {t("admin.approveHost")}
              </>
            )}
          </button>
        )}

        {host.role === "HOST" && (
          <button
            onClick={() =>
              setConfirmModal({
                type: "revoke",
                title: t("admin.revokeHost"),
                description: t("admin.revokeConfirm"),
                onConfirm: () => handleToggleRole(host.user_id, "revoke"),
              })
            }
            disabled={loadingAction === `revoke-${host.user_id}`}
            className="w-full py-2.5 rounded-full font-bold text-white bg-[#FF6B6B] hover:bg-[#E05555] transition-colors shadow-sm disabled:opacity-70 flex justify-center items-center gap-2 text-xs"
          >
            <HiBan className="text-base" />
            {t("admin.revokeHost")}
          </button>
        )}

        {(host.role === "HOST_REVOKED" || (host.role === "USER" && host.identityDocument)) && (
          <button
            onClick={() =>
              setConfirmModal({
                type: "grant",
                title: t("admin.grantHost"),
                description: t("admin.grantConfirm"),
                onConfirm: () => handleToggleRole(host.user_id, "grant"),
              })
            }
            disabled={loadingAction === `grant-${host.user_id}`}
            className="w-full py-2.5 rounded-full font-bold text-white bg-[#6C5CE7] hover:bg-[#5A4BD1] transition-colors shadow-sm disabled:opacity-70 flex justify-center items-center gap-2 text-xs"
          >
            <HiCheck className="text-base" />
            {t("admin.grantHost")}
          </button>
        )}
      </div>
    </div>
  );

  return (
    <>
      <Head>
        <title>{t("admin.title")} – AirAl</title>
        <meta name="description" content="Admin dashboard for AirAl" />
      </Head>
      <Layout>
        <div className="max-w-6xl mx-auto px-4 py-8 sm:py-12">
          <div className="mb-8 sm:mb-10 animate-fade-in-up">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-full bg-[#6C5CE7]/10 flex items-center justify-center">
                <HiShieldCheck className="text-xl text-[#6C5CE7]" />
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-[#2D3436] dark:text-white">
                {t("admin.title")}
              </h1>
            </div>
            <p className="text-sm text-[#636E72] dark:text-[#B2BEC3] ml-[52px]">
              {t("admin.manageUsers")}
            </p>
          </div>

          {stats && (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8 animate-fade-in-up">
              <div className="card-cartoon p-4 sm:p-5 text-center">
                <div className="w-10 h-10 mx-auto mb-2 rounded-full bg-[#6C5CE7]/10 flex items-center justify-center">
                  <HiUsers className="text-lg text-[#6C5CE7]" />
                </div>
                <div className="text-xl sm:text-2xl font-extrabold text-[#2D3436] dark:text-white">
                  {stats.totalUsers}
                </div>
                <div className="text-xs text-[#B2BEC3] font-medium mt-0.5">
                  {t("admin.statsUsers")}
                </div>
              </div>

              <div className="card-cartoon p-4 sm:p-5 text-center">
                <div className="w-10 h-10 mx-auto mb-2 rounded-full bg-[#0984E3]/10 flex items-center justify-center">
                  <HiHome className="text-lg text-[#0984E3]" />
                </div>
                <div className="text-xl sm:text-2xl font-extrabold text-[#2D3436] dark:text-white">
                  {stats.totalPlaces}
                </div>
                <div className="text-xs text-[#B2BEC3] font-medium mt-0.5">
                  {t("admin.statsPlaces")}
                </div>
              </div>

              <div className="card-cartoon p-4 sm:p-5 text-center">
                <div className="w-10 h-10 mx-auto mb-2 rounded-full bg-[#4ECDC4]/10 flex items-center justify-center">
                  <HiCalendar className="text-lg text-[#4ECDC4]" />
                </div>
                <div className="text-xl sm:text-2xl font-extrabold text-[#2D3436] dark:text-white">
                  {stats.totalBookings}
                </div>
                <div className="text-xs text-[#B2BEC3] font-medium mt-0.5">
                  {t("admin.statsBookings")}
                </div>
              </div>

              <div className="card-cartoon p-4 sm:p-5 text-center">
                <div className="w-10 h-10 mx-auto mb-2 rounded-full bg-[#00B894]/10 flex items-center justify-center">
                  <HiCurrencyDollar className="text-lg text-[#00B894]" />
                </div>
                <div className="text-xl sm:text-2xl font-extrabold text-[#2D3436] dark:text-white">
                  {stats.totalRevenue}€
                </div>
                <div className="text-xs text-[#B2BEC3] font-medium mt-0.5">
                  {t("admin.statsRevenue")}
                </div>
              </div>
            </div>
          )}

          <div className="flex items-center gap-2 mb-6 border-b border-[#E8E8E4] dark:border-[#2D2D4A] pb-4 flex-wrap">
            <button
              onClick={() => setActiveTab("hosts")}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-bold transition-all ${
                activeTab === "hosts"
                  ? "bg-[#6C5CE7] text-white shadow-cartoon"
                  : "text-[#636E72] dark:text-[#B2BEC3] hover:bg-[#F0F0EC] dark:hover:bg-[#232340]"
              }`}
            >
              <HiShieldCheck />
              {t("admin.tabHosts")}
              {pendingHosts.length > 0 && (
                <span className="w-5 h-5 rounded-full bg-[#FF6B6B] text-white text-xs flex items-center justify-center font-bold">
                  {pendingHosts.length}
                </span>
              )}
            </button>
            <button
              onClick={() => setActiveTab("users")}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-bold transition-all ${
                activeTab === "users"
                  ? "bg-[#6C5CE7] text-white shadow-cartoon"
                  : "text-[#636E72] dark:text-[#B2BEC3] hover:bg-[#F0F0EC] dark:hover:bg-[#232340]"
              }`}
            >
              <HiUsers />
              {t("admin.tabUsers")} ({users.length})
            </button>
            <button
              onClick={() => setActiveTab("places")}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-bold transition-all ${
                activeTab === "places"
                  ? "bg-[#6C5CE7] text-white shadow-cartoon"
                  : "text-[#636E72] dark:text-[#B2BEC3] hover:bg-[#F0F0EC] dark:hover:bg-[#232340]"
              }`}
            >
              <HiHome />
              {t("admin.tabPlaces")} ({places.length})
            </button>
            <button
              onClick={() => setActiveTab("bookings")}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-bold transition-all ${
                activeTab === "bookings"
                  ? "bg-[#6C5CE7] text-white shadow-cartoon"
                  : "text-[#636E72] dark:text-[#B2BEC3] hover:bg-[#F0F0EC] dark:hover:bg-[#232340]"
              }`}
            >
              <HiCalendar />
              {t("admin.tabBookings")} ({bookings.length})
            </button>
          </div>

          {activeTab === "hosts" && (
            <div>
              <div className="flex items-center gap-2 mb-6 animate-fade-in-up flex-wrap">
                <button
                  onClick={() => setHostSubTab("pending")}
                  className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-bold transition-all ${
                    hostSubTab === "pending"
                      ? "bg-[#2D3436] dark:bg-white text-white dark:text-[#2D3436]"
                      : "text-[#636E72] dark:text-[#B2BEC3] hover:bg-[#F0F0EC] dark:hover:bg-[#232340]"
                  }`}
                >
                  {t("admin.pendingValidations")}
                  <span className="px-1.5 py-0.5 rounded-full text-[10px] bg-white/20 dark:bg-black/20">
                    {pendingHosts.length}
                  </span>
                </button>
                <button
                  onClick={() => setHostSubTab("approved")}
                  className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-bold transition-all ${
                    hostSubTab === "approved"
                      ? "bg-[#2D3436] dark:bg-white text-white dark:text-[#2D3436]"
                      : "text-[#636E72] dark:text-[#B2BEC3] hover:bg-[#F0F0EC] dark:hover:bg-[#232340]"
                  }`}
                >
                  {t("admin.approvedHosts")}
                  <span className="px-1.5 py-0.5 rounded-full text-[10px] bg-white/20 dark:bg-black/20">
                    {approvedHosts.length}
                  </span>
                </button>
                <button
                  onClick={() => setHostSubTab("revoked")}
                  className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-bold transition-all ${
                    hostSubTab === "revoked"
                      ? "bg-[#2D3436] dark:bg-white text-white dark:text-[#2D3436]"
                      : "text-[#636E72] dark:text-[#B2BEC3] hover:bg-[#F0F0EC] dark:hover:bg-[#232340]"
                  }`}
                >
                  {t("admin.revoked")}
                  <span className="px-1.5 py-0.5 rounded-full text-[10px] bg-white/20 dark:bg-black/20">
                    {revokedHosts.length}
                  </span>
                </button>
              </div>

              {hostSubTab === "pending" &&
                (pendingHosts.length === 0 ? (
                  <div className="card-cartoon p-12 flex flex-col items-center justify-center text-center animate-fade-in">
                    <div className="w-20 h-20 mb-4 rounded-full bg-[#00B894]/10 flex items-center justify-center">
                      <HiCheck className="text-4xl text-[#00B894]" />
                    </div>
                    <h3 className="text-lg font-extrabold text-[#2D3436] dark:text-white mb-2">
                      {t("admin.allCaughtUp")}
                    </h3>
                    <p className="text-sm text-[#636E72] dark:text-[#B2BEC3]">
                      {t("admin.noPending")}
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    {pendingHosts.map(renderHostCard)}
                  </div>
                ))}

              {hostSubTab === "approved" &&
                (approvedHosts.length === 0 ? (
                  <div className="card-cartoon p-12 flex flex-col items-center justify-center text-center animate-fade-in">
                    <div className="w-20 h-20 mb-4 rounded-full bg-[#E8E8E4] dark:bg-[#2D2D4A] flex items-center justify-center">
                      <HiUser className="text-4xl text-[#B2BEC3]" />
                    </div>
                    <h3 className="text-lg font-extrabold text-[#2D3436] dark:text-white mb-2">
                      {t("admin.noApprovedHosts")}
                    </h3>
                    <p className="text-sm text-[#636E72] dark:text-[#B2BEC3]">
                      {t("admin.noApprovedHostsDesc")}
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    {approvedHosts.map(renderHostCard)}
                  </div>
                ))}

              {hostSubTab === "revoked" &&
                (revokedHosts.length === 0 ? (
                  <div className="card-cartoon p-12 flex flex-col items-center justify-center text-center animate-fade-in">
                    <div className="w-20 h-20 mb-4 rounded-full bg-[#E8E8E4] dark:bg-[#2D2D4A] flex items-center justify-center">
                      <HiBan className="text-4xl text-[#B2BEC3]" />
                    </div>
                    <h3 className="text-lg font-extrabold text-[#2D3436] dark:text-white mb-2">
                      {t("admin.noRevokedHosts")}
                    </h3>
                    <p className="text-sm text-[#636E72] dark:text-[#B2BEC3]">
                      {t("admin.noRevokedHostsDesc")}
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    {revokedHosts.map(renderHostCard)}
                  </div>
                ))}
            </div>
          )}

          {activeTab === "users" && (
            <div className="space-y-6 animate-fade-in">
              <div className="card-cartoon p-4 sm:p-5 flex flex-col sm:flex-row items-center gap-4">
                <div className="relative flex-1 w-full">
                  <HiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-lg" />
                  <input
                    type="text"
                    value={userSearch}
                    onChange={(e) => setUserSearch(e.target.value)}
                    placeholder={t("auth.name")}
                    className="w-full pl-10 pr-4 py-2.5 rounded-full bg-[#F0F0EC] dark:bg-[#1A1A2E] text-sm font-semibold outline-none focus:ring-2 focus:ring-[#6C5CE7] transition-all"
                  />
                  {userSearch && (
                    <button
                      onClick={() => setUserSearch("")}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      <HiX />
                    </button>
                  )}
                </div>

                <div className="flex items-center gap-1.5 w-full sm:w-auto">
                  <HiFilter className="text-[#6C5CE7] text-base flex-shrink-0" />
                  <select
                    value={selectedUserRoleFilter}
                    onChange={(e) => setSelectedUserRoleFilter(e.target.value)}
                    className="px-3 py-2 rounded-full bg-[#F0F0EC] dark:bg-[#1A1A2E] text-xs font-bold outline-none cursor-pointer border border-[#E8E8E4] dark:border-[#3D3D5C] w-full"
                  >
                    <option value="ALL">-- Tous les Rôles --</option>
                    <option value="ADMIN">ADMIN</option>
                    <option value="HOST">HOST</option>
                    <option value="HOST_PENDING">HOST_PENDING</option>
                    <option value="HOST_REVOKED">HOST_REVOKED</option>
                    <option value="USER">USER</option>
                  </select>
                </div>
              </div>

              <div className="card-cartoon overflow-hidden">
                <div className="p-5 border-b border-[#E8E8E4] dark:border-[#2D2D4A]">
                  <h3 className="text-lg font-extrabold text-[#2D3436] dark:text-white">
                    {t("admin.allUsers")} ({filteredUsers.length})
                  </h3>
                </div>
                {filteredUsers.length === 0 ? (
                  <div className="p-8 text-center text-[#B2BEC3] text-sm">
                    {t("admin.noUsersDesc")}
                  </div>
                ) : (
                  <div className="divide-y divide-[#E8E8E4] dark:divide-[#2D2D4A]">
                    {filteredUsers.map((u) => (
                      <div
                        key={u.user_id}
                        className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-[#FAFAF8] dark:hover:bg-[#232340] transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-[#6C5CE7]/10 text-[#6C5CE7] font-bold flex items-center justify-center flex-shrink-0">
                            {u.name?.charAt(0)?.toUpperCase()}
                          </div>
                          <div>
                            <h4 className="text-sm font-extrabold text-[#2D3436] dark:text-white">
                              {u.name}
                            </h4>
                            <p className="text-xs text-[#636E72] dark:text-[#B2BEC3]">
                              {u.email}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3 flex-wrap">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-bold ${
                              u.role === "ADMIN"
                                ? "bg-[#6C5CE7]/20 text-[#6C5CE7]"
                                : u.role === "HOST"
                                  ? "bg-[#00B894]/20 text-[#00B894]"
                                  : u.role === "HOST_PENDING"
                                    ? "bg-[#FDCB6E]/20 text-[#C9A227]"
                                    : u.role === "HOST_REVOKED"
                                      ? "bg-[#FF6B6B]/20 text-[#FF6B6B]"
                                      : "bg-[#E8E8E4] dark:bg-[#3D3D5C] text-[#636E72] dark:text-[#B2BEC3]"
                            }`}
                          >
                            {u.role}
                          </span>
                          <span className="text-xs text-[#B2BEC3]">
                            {new Date(u.createdAt).toLocaleDateString(dateLocale)}
                          </span>
                          <div className="flex items-center gap-1.5 ml-2">
                            {(u.role === "HOST" || u.role === "HOST_PENDING" || u.role === "HOST_REVOKED") && (
                              <Link
                                href={`/host/${u.user_id}`}
                                className="px-3 py-1 rounded-full text-xs font-bold text-[#0984E3] border border-[#0984E3]/30 hover:bg-[#0984E3]/10"
                              >
                                {t("host_places.myPlaces")}
                              </Link>
                            )}
                            <Link
                              href={`/messages?contact=${u.user_id}`}
                              className="px-3 py-1 rounded-full text-xs font-bold text-[#6C5CE7] border border-[#6C5CE7]/30 hover:bg-[#6C5CE7]/10"
                            >
                              {t("place.contactHost")}
                            </Link>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === "places" && (
            <div className="space-y-6 animate-fade-in">
              <div className="card-cartoon p-4 sm:p-5 flex flex-col sm:flex-row items-center gap-4">
                <div className="relative flex-1 w-full">
                  <HiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-lg" />
                  <input
                    type="text"
                    value={placeSearch}
                    onChange={(e) => setPlaceSearch(e.target.value)}
                    placeholder={t("hero.searchPlaceholder")}
                    className="w-full pl-10 pr-4 py-2.5 rounded-full bg-[#F0F0EC] dark:bg-[#1A1A2E] text-sm font-semibold outline-none focus:ring-2 focus:ring-[#6C5CE7] transition-all"
                  />
                  {placeSearch && (
                    <button
                      onClick={() => setPlaceSearch("")}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      <HiX />
                    </button>
                  )}
                </div>

                <div className="flex items-center gap-3 w-full sm:w-auto">
                  <div className="flex items-center gap-1.5 w-1/2 sm:w-auto">
                    <HiFilter className="text-[#6C5CE7] text-base flex-shrink-0" />
                    <select
                      value={selectedHostFilter}
                      onChange={(e) => setSelectedHostFilter(e.target.value)}
                      className="px-3 py-2 rounded-full bg-[#F0F0EC] dark:bg-[#1A1A2E] text-xs font-bold outline-none cursor-pointer border border-[#E8E8E4] dark:border-[#3D3D5C] w-full"
                    >
                      <option value="ALL">-- Tous les Gérants --</option>
                      {uniqueHosts.map(([hostId, h]) => (
                        <option key={hostId} value={hostId}>
                          {h.name} ({h.email})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="flex items-center gap-1.5 w-1/2 sm:w-auto">
                    <select
                      value={selectedCityFilter}
                      onChange={(e) => setSelectedCityFilter(e.target.value)}
                      className="px-3 py-2 rounded-full bg-[#F0F0EC] dark:bg-[#1A1A2E] text-xs font-bold outline-none cursor-pointer border border-[#E8E8E4] dark:border-[#3D3D5C] w-full"
                    >
                      <option value="ALL">-- Toutes les Villes --</option>
                      {uniqueCities.map((cityName) => (
                        <option key={cityName} value={cityName}>
                          {cityName}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {filteredPlaces.length === 0 ? (
                <div className="card-cartoon p-12 text-center text-[#B2BEC3] text-sm">
                  {t("places.noPlacesFound")}
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {filteredPlaces.map((place) => (
                    <div
                      key={place.place_id}
                      className="card-cartoon overflow-hidden flex flex-col justify-between"
                    >
                      <Link
                        href={`/place/${place.place_id}`}
                        className="relative h-44 overflow-hidden block group"
                      >
                        <img
                          src={place.image}
                          alt={place.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-white/90 dark:bg-[#1A1A2E]/90 text-xs font-bold">
                          {place.category}
                        </div>
                        {place.city?.name && (
                          <div className="absolute bottom-3 left-3 px-3 py-1 rounded-full bg-black/60 text-white text-xs font-bold backdrop-blur-sm flex items-center gap-1">
                            <HiLocationMarker className="text-[#FF6B6B]" />
                            {place.city.name}
                          </div>
                        )}
                      </Link>

                      <div className="p-4">
                        <Link href={`/place/${place.place_id}`}>
                          <h3 className="font-extrabold text-[#2D3436] dark:text-white text-base truncate hover:text-[#FF6B6B] transition-colors">
                            {place.name}
                          </h3>
                        </Link>

                        <div className="flex items-center justify-between mt-2 pt-2 border-t border-[#E8E8E4] dark:border-[#2D2D4A]">
                          <Link
                            href={`/host/${place.hostId}`}
                            className="text-xs text-[#0984E3] font-semibold hover:underline truncate"
                          >
                            {t("admin.hostedBy")}: {place.host?.name}
                          </Link>
                          <span className="text-xs font-extrabold text-[#FF6B6B] flex-shrink-0 ml-2">
                            {place.priceByNight}€ / night
                          </span>
                        </div>

                        <div className="flex items-center justify-between mt-4 pt-3 border-t border-[#E8E8E4] dark:border-[#2D2D4A]">
                          <div className="flex items-center gap-2">
                            <Link
                              href={`/place/${place.place_id}`}
                              className="px-3 py-1.5 rounded-full text-xs font-bold text-[#0984E3] border border-[#0984E3]/30 hover:bg-[#0984E3]/10"
                            >
                              {t("admin.viewPlace")}
                            </Link>
                            <Link
                              href={`/host/${place.hostId}`}
                              className="px-3 py-1.5 rounded-full text-xs font-bold text-[#6C5CE7] border border-[#6C5CE7]/30 hover:bg-[#6C5CE7]/10"
                            >
                              {t("host_places.myPlaces")}
                            </Link>
                          </div>
                          <button
                            onClick={() =>
                              setConfirmModal({
                                type: "deletePlace",
                                title: t("admin.deletePlace"),
                                description: t("admin.deletePlaceConfirm"),
                                onConfirm: () =>
                                  handleDeletePlace(place.place_id),
                              })
                            }
                            className="p-2 rounded-full text-[#FF6B6B] hover:bg-[#FF6B6B]/10 transition-colors"
                          >
                            <HiTrash className="text-base" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === "bookings" && (
            <div className="card-cartoon overflow-hidden animate-fade-in">
              <div className="p-5 border-b border-[#E8E8E4] dark:border-[#2D2D4A]">
                <h3 className="text-lg font-extrabold text-[#2D3436] dark:text-white">
                  {t("admin.allBookings")} ({bookings.length})
                </h3>
              </div>
              <div className="divide-y divide-[#E8E8E4] dark:divide-[#2D2D4A]">
                {bookings.map((b) => (
                  <div
                    key={b.booking_id}
                    className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-[#FAFAF8] dark:hover:bg-[#232340] transition-colors"
                  >
                    <div>
                      <h4 className="text-sm font-extrabold text-[#2D3436] dark:text-white">
                        {b.place?.name}
                      </h4>
                      <p className="text-xs text-[#636E72] dark:text-[#B2BEC3] mt-0.5">
                        {t("admin.bookedBy")}: {b.user?.name} ({b.user?.email})
                      </p>
                      <p className="text-xs text-[#B2BEC3] mt-0.5">
                        {new Date(b.checkIn).toLocaleDateString(dateLocale)} →{" "}
                        {new Date(b.checkOut).toLocaleDateString(dateLocale)}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-extrabold text-[#00B894]">
                        {b.totalPrice}€
                      </span>
                      <span
                        className={`px-2.5 py-1 rounded-full text-xs font-bold uppercase ${
                          b.status === "confirmed"
                            ? "bg-[#55EFC4]/20 text-[#00B894]"
                            : b.status === "pending"
                              ? "bg-[#FDCB6E]/20 text-[#C9A227]"
                              : "bg-[#FF6B6B]/20 text-[#FF6B6B]"
                        }`}
                      >
                        {b.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {confirmModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm animate-fade-in px-4">
            <div className="card-cartoon p-6 sm:p-8 max-w-md w-full animate-fade-in-up">
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-[#FF6B6B]/10 flex items-center justify-center">
                  <HiExclamationCircle className="text-3xl text-[#FF6B6B]" />
                </div>
                <h3 className="text-xl font-extrabold text-[#2D3436] dark:text-white mb-2">
                  {confirmModal.title}
                </h3>
                <p className="text-sm text-[#636E72] dark:text-[#B2BEC3] mb-6">
                  {confirmModal.description}
                </p>
                <div className="flex gap-3">
                  <button
                    onClick={() => setConfirmModal(null)}
                    className="flex-1 py-3 rounded-full font-bold text-[#636E72] dark:text-[#B2BEC3] border-2 border-[#E8E8E4] dark:border-[#3D3D5C] hover:border-[#2D3436] dark:hover:border-white hover:text-[#2D3436] dark:hover:text-white transition-all text-sm"
                  >
                    {t("admin.confirmCancel")}
                  </button>
                  <button
                    onClick={confirmModal.onConfirm}
                    className="flex-1 py-3 rounded-full font-bold text-white bg-[#FF6B6B] hover:bg-[#E85555] transition-all text-sm"
                  >
                    {t("admin.confirmProceed")}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {viewingDocument && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-fade-in px-4">
            <div className="relative max-w-3xl w-full max-h-[90vh] animate-fade-in-up">
              <button
                onClick={() => setViewingDocument(null)}
                className="absolute -top-3 -right-3 z-10 w-10 h-10 rounded-full bg-white dark:bg-[#2D2D4A] shadow-lg flex items-center justify-center text-[#2D3436] dark:text-white hover:bg-[#FF6B6B] hover:text-white transition-all"
              >
                <HiX className="text-xl" />
              </button>
              <div className="card-cartoon overflow-hidden">
                {viewingDocument.startsWith("data:image") ? (
                  <img
                    src={viewingDocument}
                    alt="Identity Document"
                    className="w-full h-auto max-h-[80vh] object-contain"
                  />
                ) : (
                  <iframe
                    src={viewingDocument}
                    className="w-full h-[80vh]"
                    title="Identity Document"
                  />
                )}
              </div>
            </div>
          </div>
        )}
      </Layout>
    </>
  );
}
