import Head from "next/head";
import Layout from "../components/Layout";
import Link from "next/link";
import { useTranslation } from "../lib/i18n/LanguageContext";
import { HiHeart, HiGlobe, HiUsers, HiShieldCheck } from "react-icons/hi";

export default function AboutPage() {
  const { t } = useTranslation();

  return (
    <>
      <Head>
        <title>{t("about.title")} – The Future of Travel</title>
        <meta
          name="description"
          content="Learn about AirAl's mission to make everyone feel like they belong anywhere."
        />
      </Head>
      <Layout>
        {/* Hero Section */}
        <section className="bg-gradient-to-b from-[#FAFAF8] to-white dark:from-[#1A1A2E] dark:to-[#121222] pt-16 pb-20">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-6xl font-extrabold text-[#2D3436] dark:text-white mb-6 animate-fade-in-up">
              {t("about.heroTitle")}{" "}
              <span className="text-[#FF6B6B]">{t("about.heroHighlight")}</span>
            </h1>
            <p className="text-lg md:text-xl text-[#636E72] dark:text-[#B2BEC3] leading-relaxed mb-10 max-w-2xl mx-auto animate-fade-in-up stagger-1">
              {t("about.heroDescription")}
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4 animate-fade-in-up stagger-2">
              <Link href="/" className="btn-pill px-8 py-3.5 text-base">
                {t("bookings.explorePlaces")}
              </Link>
              <Link
                href="/Auth/register"
                className="px-8 py-3.5 rounded-full font-bold text-[#636E72] dark:text-[#B2BEC3] border-2 border-[#E8E8E4] dark:border-[#3D3D5C] hover:border-[#4ECDC4] hover:text-[#4ECDC4] transition-all bg-white dark:bg-[#232340]"
              >
                {t("about.becomeHost")}
              </Link>
            </div>
          </div>
        </section>

        {/* Mission Stats */}
        <section className="max-w-6xl mx-auto px-4 py-16">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="card-cartoon p-8 text-center animate-fade-in-up">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-[#FF6B6B]/10 flex items-center justify-center">
                <HiHeart className="text-3xl text-[#FF6B6B]" />
              </div>
              <h3 className="text-3xl font-extrabold text-[#2D3436] dark:text-white mb-2">
                5M+
              </h3>
              <p className="text-[#636E72] dark:text-[#B2BEC3] font-medium">
                {t("about.stats.arrivals")}
              </p>
            </div>
            <div className="card-cartoon p-8 text-center animate-fade-in-up stagger-1">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-[#4ECDC4]/10 flex items-center justify-center">
                <HiGlobe className="text-3xl text-[#4ECDC4]" />
              </div>
              <h3 className="text-3xl font-extrabold text-[#2D3436] dark:text-white mb-2">
                120+
              </h3>
              <p className="text-[#636E72] dark:text-[#B2BEC3] font-medium">
                {t("about.stats.countries")}
              </p>
            </div>
            <div className="card-cartoon p-8 text-center animate-fade-in-up stagger-2">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-[#A29BFE]/10 flex items-center justify-center">
                <HiUsers className="text-3xl text-[#A29BFE]" />
              </div>
              <h3 className="text-3xl font-extrabold text-[#2D3436] dark:text-white mb-2">
                800K
              </h3>
              <p className="text-[#636E72] dark:text-[#B2BEC3] font-medium">
                {t("about.stats.hosts")}
              </p>
            </div>
          </div>
        </section>

        {/* Story Section */}
        <section className="bg-[#FAFAF8] dark:bg-[#1A1A2E] border-y border-[#E8E8E4] dark:border-[#2D2D4A] py-20">
          <div className="max-w-4xl mx-auto px-4">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-full bg-[#FDCB6E]/20 flex items-center justify-center">
                <HiShieldCheck className="text-xl text-[#FDCB6E]" />
              </div>
              <h2 className="text-2xl md:text-3xl font-extrabold text-[#2D3436] dark:text-white">
                {t("about.trustTitle")}
              </h2>
            </div>
            <div className="space-y-6 text-[#636E72] dark:text-[#B2BEC3] text-lg leading-relaxed">
              <p>{t("about.trustP1")}</p>
              <p>{t("about.trustP2")}</p>
              <p>{t("about.trustP3")}</p>
            </div>
          </div>
        </section>
      </Layout>
    </>
  );
}
