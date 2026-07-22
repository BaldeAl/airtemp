import Head from "next/head";
import { useState } from "react";
import Places from "../components/place/Places";
import Layout from "../components/Layout";
import WelcomeMessage from "../components/Welcome";
import HeroBanner from "../components/home/HeroBanner";
import { useTranslation } from "../lib/i18n/LanguageContext";

export default function Home() {
  const [searchValue, setSearchValue] = useState("");
  const { t } = useTranslation();

  return (
    <>
      <Head>
        <title>AirAl</title>
        <meta name="description" content={t("footer.description")} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <Layout>
        <WelcomeMessage />
        <HeroBanner onSearch={setSearchValue} />
        <Places searchValue={searchValue} />
      </Layout>
    </>
  );
}
