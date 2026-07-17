import Head from 'next/head';
import Layout from '../../../../components/Layout';
import PlaceForm from '../../../../components/host/PlaceForm';
import Loading from '../../../../components/loading/Loading';
import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import { HiPencil } from 'react-icons/hi';
import { useTranslation } from '../../../../lib/i18n/LanguageContext';

export default function EditPlace() {
  const router = useRouter();
  const { id } = router.query;
  const [place, setPlace] = useState(null);
  const [loading, setLoading] = useState(true);
  const { t } = useTranslation();

  useEffect(() => {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');

    if (!token || (role !== 'HOST' && role !== 'ADMIN')) {
      router.push('/');
      return;
    }

    if (!id && id !== '0') return;

    // Fetch the specific place via the host API to get all fields
    fetch('/api/host/places', {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        if (!res.ok) throw new Error('Failed');
        return res.json();
      })
      .then((data) => {
        const found = data.find((p) => p.place_id === Number(id));
        if (found) {
          setPlace(found);
        } else {
          router.push('/host/places');
        }
      })
      .catch(() => router.push('/host/places'))
      .finally(() => setLoading(false));
  }, [id, router]);

  if (loading || !place) {
    return (
      <Layout>
        <Loading />
      </Layout>
    );
  }

  return (
    <>
      <Head>
        <title>{t('host_places.editPlace')} {place.name} – AirAl</title>
        <meta name="description" content={`Edit ${place.name} on AirAl`} />
      </Head>
      <Layout>
        <div className="max-w-2xl mx-auto px-4 py-8 sm:py-12">
          <div className="mb-8 animate-fade-in-up">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-full bg-[#0984E3]/10 flex items-center justify-center">
                <HiPencil className="text-xl text-[#0984E3]" />
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-[#2D3436] dark:text-white">
                {t('host_places.editPlace')}
              </h1>
            </div>
            <p className="text-sm text-[#636E72] dark:text-[#B2BEC3] ml-[52px]">
              {t('host_places.updateDetails')} <strong>{place.name}</strong>
            </p>
          </div>

          <div className="card-cartoon p-6 sm:p-8 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
            <PlaceForm initialData={place} isEdit={true} />
          </div>
        </div>
      </Layout>
    </>
  );
}
