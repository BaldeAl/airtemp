import Layout from "../components/Layout";
import Head from "next/head";
import { useTranslation } from "../lib/i18n/LanguageContext";

export default function GenericPage({ titleKey }) {
  const { t } = useTranslation();

  // If a translation key is passed, use it, otherwise fallback to "Page Under Construction"
  const title = titleKey ? t(titleKey) : t("generic.underConstruction");

  return (
    <>
      <Head>
        <title>{title} – AirAl</title>
      </Head>
      <Layout>
        <div className="max-w-4xl mx-auto px-4 py-20 text-center animate-fade-in-up">
          <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-[#0984E3]/10 flex items-center justify-center">
            <span className="text-4xl">🚧</span>
          </div>
          <h1 className="text-3xl font-extrabold text-[#2D3436] dark:text-white mb-4">
            {title}
          </h1>
          <p className="text-[#636E72] dark:text-[#B2BEC3] max-w-lg mx-auto">
            {t("generic.workingHard")}
          </p>
        </div>
      </Layout>
    </>
  );
}
