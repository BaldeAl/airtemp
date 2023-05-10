import Head from 'next/head'
import Places from '../components/place/Places'
import Layout from '../components/Layout'
import Login from '../components/Auth/Login'
export default function Home() {
  return (
    <>
      <Head>
        <title>Airwo</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Layout >
      <Places/>
      <Login/>
      </Layout>
    </>
  )
}
