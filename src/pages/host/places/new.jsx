import Head from 'next/head';
import Layout from '../../../components/Layout';
import PlaceForm from '../../../components/host/PlaceForm';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { HiPlus } from 'react-icons/hi';
import { useTranslation } from '../../../lib/i18n/LanguageContext';

export default function NewPlace() {
  const router = useRouter();
  const { t } = useTranslation();

  useEffect(() => {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');
    if (!token || (role !== 'HOST' && role !== 'ADMIN')) {
      router.push('/');
    }
  }, [router]);

  return (
    <>
      <Head>
        <title>{t('host_places.addNewPlace')} – AirAl</title>
        <meta name="description" content="Add a new place to host on AirAl" />
      </Head>
      <Layout>
        <div className="max-w-2xl mx-auto px-4 py-8 sm:py-12">
          <div className="mb-8 animate-fade-in-up">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-full bg-[#FF6B6B]/10 flex items-center justify-center">
                <HiPlus className="text-xl text-[#FF6B6B]" />
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-[#2D3436] dark:text-white">
                {t('host_places.addNewPlace')}
              </h1>
            </div>
            <p className="text-sm text-[#636E72] dark:text-[#B2BEC3] ml-[52px]">
              {t('host_places.fillDetails')}
            </p>
          </div>

          <div className="card-cartoon p-6 sm:p-8 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
            <PlaceForm />
          </div>
        </div>
      </Layout>
    </>
  );
}
