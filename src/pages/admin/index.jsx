import Head from 'next/head';
import Layout from '../../components/Layout';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Loading from '../../components/loading/Loading';
import { HiCheck, HiShieldCheck, HiUser, HiLocationMarker, HiClock, HiPhone, HiIdentification, HiX, HiCheckCircle, HiBan } from 'react-icons/hi';
import { toast } from 'react-toastify';

export default function AdminDashboard() {
  const [hosts, setHosts] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loadingAction, setLoadingAction] = useState(null);
  const [viewingDocument, setViewingDocument] = useState(null);
  const [activeTab, setActiveTab] = useState('pending');
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/');
      return;
    }

    fetch('/api/admin/hosts', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (res.status === 403 || res.status === 401) {
          router.push('/');
          throw new Error('Unauthorized');
        }
        if (!res.ok) throw new Error('Failed to fetch');
        return res.json();
      })
      .then((data) => {
        setIsAdmin(true);
        setHosts(data);
      })
      .catch((err) => {
        console.error(err);
      });
  }, [router]);

  const handleApprove = async (userId) => {
    const token = localStorage.getItem('token');
    if (!token) return;

    setLoadingAction(userId);
    try {
      const res = await fetch('/api/admin/hosts/approve', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ targetUserId: userId }),
      });

      if (res.ok) {
        setHosts((prev) => 
          prev.map((host) => 
            host.user_id === userId ? { ...host, role: 'HOST' } : host
          )
        );
        toast.success('Host approved successfully!');
      } else {
        toast.error('Failed to approve host.');
      }
    } catch (err) {
      console.error(err);
      toast.error('An error occurred.');
    } finally {
      setLoadingAction(null);
    }
  };

  const handleToggleRole = async (userId, action) => {
    const token = localStorage.getItem('token');
    if (!token) return;

    const confirmMsg = action === 'revoke'
      ? 'Are you sure you want to revoke this host\'s rights?'
      : 'Are you sure you want to re-grant host rights to this user?';
    if (!window.confirm(confirmMsg)) return;

    setLoadingAction(`${action}-${userId}`);
    try {
      const res = await fetch('/api/admin/hosts/toggle-role', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ targetUserId: userId, action }),
      });

      if (res.ok) {
        setHosts((prev) =>
          prev.map((host) =>
            host.user_id === userId
              ? { ...host, role: action === 'revoke' ? 'USER' : 'HOST' }
              : host
          )
        );
        toast.success(
          action === 'revoke'
            ? 'Host rights revoked successfully.'
            : 'Host rights re-granted successfully.'
        );
      } else {
        toast.error('Failed to update host role.');
      }
    } catch (err) {
      console.error(err);
      toast.error('An error occurred.');
    } finally {
      setLoadingAction(null);
    }
  };

  if (hosts === null) {
    return (
      <Layout>
        <Loading />
      </Layout>
    );
  }

  const pendingHosts = hosts.filter(h => h.role === "HOST_PENDING");
  const approvedHosts = hosts.filter(h => h.role === "HOST");
  const revokedHosts = hosts.filter(h => h.role === "USER" && h.identityDocument);

  const getHostStatus = (host) => {
    if (host.role === 'HOST') return 'approved';
    if (host.role === 'HOST_PENDING') return 'pending';
    return 'revoked';
  };

  const renderHostCard = (host, isApproved) => (
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
              <h3 className="font-extrabold text-[#2D3436] dark:text-white">{host.name}</h3>
              <p className="text-xs text-[#636E72] dark:text-[#B2BEC3]">{host.email}</p>
            </div>
          </div>
          {host.role === 'HOST' && (
            <span className="px-2.5 py-1 rounded-full bg-[#55EFC4]/20 text-[#00B894] text-xs font-bold flex items-center gap-1">
              <HiCheckCircle className="text-sm" />
              Approved
            </span>
          )}
          {host.role === 'HOST_PENDING' && (
            <span className="px-2.5 py-1 rounded-full bg-[#FDCB6E]/20 text-[#C9A227] text-xs font-bold flex items-center gap-1">
              <HiClock className="text-sm" />
              Pending
            </span>
          )}
          {host.role === 'USER' && host.identityDocument && (
            <span className="px-2.5 py-1 rounded-full bg-[#FF6B6B]/20 text-[#FF6B6B] text-xs font-bold flex items-center gap-1">
              <HiBan className="text-sm" />
              Revoked
            </span>
          )}
        </div>
        
        <div className="mb-4 space-y-3">
          {/* Address */}
          <div className="flex items-start gap-2 text-sm">
            <HiLocationMarker className="text-[#FF6B6B] mt-0.5 flex-shrink-0" />
            <span className="text-[#636E72] dark:text-[#B2BEC3] leading-relaxed">
              <strong className="text-[#2D3436] dark:text-white block mb-0.5">Address:</strong>
              {host.address || "No address provided."}
            </span>
          </div>

          {/* Phone */}
          {host.phone && (
            <div className="flex items-start gap-2 text-sm">
              <HiPhone className="text-[#6C5CE7] mt-0.5 flex-shrink-0" />
              <span className="text-[#636E72] dark:text-[#B2BEC3] leading-relaxed">
                <strong className="text-[#2D3436] dark:text-white block mb-0.5">Phone:</strong>
                {host.phone}
              </span>
            </div>
          )}

          {/* Identity Document */}
          {host.identityDocument && (
            <div className="flex items-start gap-2 text-sm">
              <HiIdentification className="text-[#FF6B6B] mt-0.5 flex-shrink-0" />
              <div className="w-full pr-2">
                <strong className="text-[#2D3436] dark:text-white block mb-1.5 flex items-center justify-between">
                  Identity Document:
                  {isApproved && (
                    <span className="text-[10px] font-normal text-[#B2BEC3] ml-2">
                      (Conservé dans la limite de durée légale)
                    </span>
                  )}
                </strong>
                <button
                  onClick={() => setViewingDocument(host.identityDocument)}
                  className="group/doc relative rounded-xl overflow-hidden border-2 border-[#E8E8E4] dark:border-[#3D3D5C] hover:border-[#6C5CE7] transition-all block w-full"
                >
                  {host.identityDocument.startsWith('data:image') ? (
                    <img 
                      src={host.identityDocument} 
                      alt="Identity Document" 
                      className="w-full h-24 object-cover"
                    />
                  ) : (
                    <div className="w-full h-24 bg-[#F0F0EC] dark:bg-[#232340] flex items-center justify-center">
                      <span className="text-sm text-[#636E72] dark:text-[#B2BEC3] font-bold">📄 PDF Document</span>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-black/0 group-hover/doc:bg-black/30 transition-all flex items-center justify-center">
                    <span className="text-white font-bold text-xs opacity-0 group-hover/doc:opacity-100 transition-opacity">
                      Click to view
                    </span>
                  </div>
                </button>
              </div>
            </div>
          )}

          <div className="flex items-start gap-2 text-xs text-[#B2BEC3] mt-2 pl-6">
            <span>Registered: {new Date(host.createdAt).toLocaleDateString()}</span>
          </div>
        </div>
      </div>

      {/* Pending: Approve button */}
      {host.role === 'HOST_PENDING' && (
        <button
          onClick={() => handleApprove(host.user_id)}
          disabled={loadingAction === host.user_id}
          className="w-full py-2.5 rounded-full font-bold text-white bg-[#00B894] hover:bg-[#00A080] transition-colors shadow-sm disabled:opacity-70 flex justify-center items-center gap-2"
        >
          {loadingAction === host.user_id ? (
            "Approving..."
          ) : (
            <>
              <HiCheck className="text-lg" />
              Approve Host
            </>
          )}
        </button>
      )}

      {/* Approved: Revoke button */}
      {host.role === 'HOST' && (
        <button
          onClick={() => handleToggleRole(host.user_id, 'revoke')}
          disabled={loadingAction === `revoke-${host.user_id}`}
          className="w-full py-2.5 rounded-full font-bold text-white bg-[#FF6B6B] hover:bg-[#E05555] transition-colors shadow-sm disabled:opacity-70 flex justify-center items-center gap-2"
        >
          {loadingAction === `revoke-${host.user_id}` ? (
            "Revoking..."
          ) : (
            <>
              <HiBan className="text-lg" />
              Revoke Host Rights
            </>
          )}
        </button>
      )}

      {/* Revoked: Re-grant button */}
      {host.role === 'USER' && host.identityDocument && (
        <button
          onClick={() => handleToggleRole(host.user_id, 'grant')}
          disabled={loadingAction === `grant-${host.user_id}`}
          className="w-full py-2.5 rounded-full font-bold text-white bg-[#6C5CE7] hover:bg-[#5A4BD1] transition-colors shadow-sm disabled:opacity-70 flex justify-center items-center gap-2"
        >
          {loadingAction === `grant-${host.user_id}` ? (
            "Granting..."
          ) : (
            <>
              <HiCheck className="text-lg" />
              Re-grant Host Rights
            </>
          )}
        </button>
      )}
    </div>
  );

  return (
    <>
      <Head>
        <title>Admin Dashboard – AirAl</title>
        <meta name="description" content="Admin dashboard for AirAl" />
      </Head>
      <Layout>
        <div className="max-w-5xl mx-auto px-4 py-8 sm:py-12">
          {/* Header */}
          <div className="mb-8 sm:mb-10 animate-fade-in-up">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-full bg-[#6C5CE7]/10 flex items-center justify-center">
                <HiShieldCheck className="text-xl text-[#6C5CE7]" />
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-[#2D3436] dark:text-white">
                Admin Dashboard
              </h1>
            </div>
            <p className="text-sm text-[#636E72] dark:text-[#B2BEC3] ml-[52px]">
              Manage users and host applications
            </p>
          </div>

          {/* Tabs */}
          <div className="flex items-center gap-2 mb-6 animate-fade-in-up flex-wrap">
            <button
              onClick={() => setActiveTab('pending')}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-bold transition-all ${
                activeTab === 'pending'
                  ? 'bg-[#2D3436] dark:bg-white text-white dark:text-[#2D3436]'
                  : 'text-[#636E72] dark:text-[#B2BEC3] hover:bg-[#F0F0EC] dark:hover:bg-[#232340]'
              }`}
            >
              Pending Validations
              <span className={`px-1.5 py-0.5 rounded-full text-xs ${activeTab === 'pending' ? 'bg-white/20 dark:bg-black/20' : 'bg-[#E8E8E4] dark:bg-[#3D3D5C]'}`}>
                {pendingHosts.length}
              </span>
            </button>
            <button
              onClick={() => setActiveTab('approved')}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-bold transition-all ${
                activeTab === 'approved'
                  ? 'bg-[#2D3436] dark:bg-white text-white dark:text-[#2D3436]'
                  : 'text-[#636E72] dark:text-[#B2BEC3] hover:bg-[#F0F0EC] dark:hover:bg-[#232340]'
              }`}
            >
              Approved Hosts
              <span className={`px-1.5 py-0.5 rounded-full text-xs ${activeTab === 'approved' ? 'bg-white/20 dark:bg-black/20' : 'bg-[#E8E8E4] dark:bg-[#3D3D5C]'}`}>
                {approvedHosts.length}
              </span>
            </button>
            <button
              onClick={() => setActiveTab('revoked')}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-bold transition-all ${
                activeTab === 'revoked'
                  ? 'bg-[#2D3436] dark:bg-white text-white dark:text-[#2D3436]'
                  : 'text-[#636E72] dark:text-[#B2BEC3] hover:bg-[#F0F0EC] dark:hover:bg-[#232340]'
              }`}
            >
              Revoked
              <span className={`px-1.5 py-0.5 rounded-full text-xs ${activeTab === 'revoked' ? 'bg-white/20 dark:bg-black/20' : 'bg-[#E8E8E4] dark:bg-[#3D3D5C]'}`}>
                {revokedHosts.length}
              </span>
            </button>
          </div>

          <section className="mb-12">
            {activeTab === 'pending' && (
              <>
                {pendingHosts.length === 0 ? (
                  <div className="card-cartoon p-12 flex flex-col items-center justify-center text-center animate-fade-in">
                    <div className="w-20 h-20 mb-4 rounded-full bg-[#00B894]/10 flex items-center justify-center">
                      <HiCheck className="text-4xl text-[#00B894]" />
                    </div>
                    <h3 className="text-lg font-extrabold text-[#2D3436] dark:text-white mb-2">All Caught Up!</h3>
                    <p className="text-sm text-[#636E72] dark:text-[#B2BEC3]">There are no pending host applications to review.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    {pendingHosts.map(host => renderHostCard(host, false))}
                  </div>
                )}
              </>
            )}

            {activeTab === 'approved' && (
              <>
                {approvedHosts.length === 0 ? (
                  <div className="card-cartoon p-12 flex flex-col items-center justify-center text-center animate-fade-in">
                    <div className="w-20 h-20 mb-4 rounded-full bg-[#E8E8E4] dark:bg-[#2D2D4A] flex items-center justify-center">
                      <HiUser className="text-4xl text-[#B2BEC3]" />
                    </div>
                    <h3 className="text-lg font-extrabold text-[#2D3436] dark:text-white mb-2">No Approved Hosts</h3>
                    <p className="text-sm text-[#636E72] dark:text-[#B2BEC3]">There are no approved hosts yet.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    {approvedHosts.map(host => renderHostCard(host, true))}
                  </div>
                )}
              </>
            )}

            {activeTab === 'revoked' && (
              <>
                {revokedHosts.length === 0 ? (
                  <div className="card-cartoon p-12 flex flex-col items-center justify-center text-center animate-fade-in">
                    <div className="w-20 h-20 mb-4 rounded-full bg-[#E8E8E4] dark:bg-[#2D2D4A] flex items-center justify-center">
                      <HiBan className="text-4xl text-[#B2BEC3]" />
                    </div>
                    <h3 className="text-lg font-extrabold text-[#2D3436] dark:text-white mb-2">No Revoked Hosts</h3>
                    <p className="text-sm text-[#636E72] dark:text-[#B2BEC3]">There are no hosts with revoked rights.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    {revokedHosts.map(host => renderHostCard(host, false))}
                  </div>
                )}
              </>
            )}
          </section>
        </div>

        {/* Document Viewer Modal */}
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
                {viewingDocument.startsWith('data:image') ? (
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
