import Layout from '../components/Layout';
import Head from 'next/head';

export default function GenericPage({ title = "Page Under Construction" }) {
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
            We are working hard to bring you this content. Please check back later!
          </p>
        </div>
      </Layout>
    </>
  );
}
