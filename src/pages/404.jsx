import Link from 'next/link'
import Layout from '../components/Layout'
import { useTranslation } from '../lib/i18n/LanguageContext'

export default function FourOhFour() {
  const { t } = useTranslation();

  return (
    <Layout>
      <div className="flex min-h-[calc(100vh-200px)] items-center justify-center px-4">
        <div className="text-center max-w-md">
          <div className="text-8xl mb-6">🏠</div>
          <h1 className="text-6xl font-extrabold text-[#2D3436] dark:text-white mb-4">404</h1>
          <h2 className="text-xl font-bold text-[#636E72] dark:text-[#B2BEC3] mb-3">
            {t('error404.title')}
          </h2>
          <p className="text-[#B2BEC3] mb-8">
            {t('error404.description')}
          </p>
          <Link href="/" className="btn-pill px-8 py-3 text-base">
            {t('error404.goHome')}
          </Link>
        </div>
      </div>
    </Layout>
  )
}