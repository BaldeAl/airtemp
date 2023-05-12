import Link from 'next/link'
import { useRouter } from 'next/router'
import Layout from '../components/Layout'

export default function FourOhFour() {
    const router = useRouter()
  return <>
    <Layout>
    <div className="lg:px-24 lg:py-24 md:py-20 md:px-44 px-4 py-24 items-center flex justify-center flex-col-reverse lg:flex-row md:gap-28 gap-16">
            <div className="xl:pt-24 w-full xl:w-1/2 relative pb-12 lg:pb-0">
                <div className="relative">
                    <div className="text-6xl text-center bg-clip-text ">
                       <h1>Page not found </h1>
                    </div>
                    <div>
                        <img src="https://i.ibb.co/G9DC8S0/404-2.png" />
                    </div>
                </div>
            </div>
            <div>
                <img src="https://i.ibb.co/ck1SGFJ/Group.png" />
            </div>
        </div>
        </Layout>

  </>
}