import Head from 'next/head';
import Layout from '../../components/Layout';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Loading from '../../components/loading/Loading';
import { HiCheck, HiShieldCheck, HiUser, HiLocationMarker, HiClock } from 'react-icons/hi';
import { toast } from 'react-toastify';

export default function AdminDashboard() {
  const [pendingHosts, setPendingHosts] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loadingAction, setLoadingAction] = useState(null);
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
        setPendingHosts(data);
      })
      .catch((err) => {
        console.error(err);
        // Will be redirected by logic above
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
        setPendingHosts((prev) => prev.filter((host) => host.user_id !== userId));
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

  if (pendingHosts === null) {
    return (
      <Layout>
        <Loading />
      </Layout>
    );
  }

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

          <section className="mb-12">
            <h2 className="text-xl font-extrabold text-[#2D3436] dark:text-white mb-6 flex items-center gap-2 animate-fade-in-up">
              <span className="w-2 h-2 rounded-full bg-[#FDCB6E]" />
              Pending Host Validations
            </h2>

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
                {pendingHosts.map((host, i) => (
                  <div 
                    key={host.user_id} 
                    className="card-cartoon p-5 flex flex-col justify-between animate-fade-in-up opacity-0"
                    style={{ animationDelay: `${i * 0.1}s`, animationFillMode: 'forwards' }}
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
                        <span className="px-2.5 py-1 rounded-full bg-[#FDCB6E]/20 text-[#C9A227] text-xs font-bold flex items-center gap-1">
                          <HiClock className="text-sm" />
                          Pending
                        </span>
                      </div>
                      
                      <div className="mb-6 space-y-2">
                        <div className="flex items-start gap-2 text-sm">
                          <HiLocationMarker className="text-[#FF6B6B] mt-0.5 flex-shrink-0" />
                          <span className="text-[#636E72] dark:text-[#B2BEC3] leading-relaxed">
                            <strong className="text-[#2D3436] dark:text-white block mb-0.5">Provided Address:</strong>
                            {host.address || "No address provided."}
                          </span>
                        </div>
                        <div className="flex items-start gap-2 text-xs text-[#B2BEC3] mt-2 pl-6">
                          <span>Registered: {new Date(host.createdAt).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>

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
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>
      </Layout>
    </>
  );
}
