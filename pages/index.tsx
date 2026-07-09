import type { NextPage } from 'next'
import Head from 'next/head'
import Header from '../components/Header'
import Hero from '../components/Hero'
import Features from '../components/Features'
import Stats from '../components/Stats'
import News from '../components/News'
import Footer from '../components/Footer'

const Home: NextPage = () => (
  <>
    <Head>
      <title>Horizon RP — GTA V RolePlay Сервер</title>
      <meta name="description" content="GTA V RolePlay сервер нового поколения. Реальная экономика, живой город." />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
    </Head>
    <div className="min-h-screen" style={{ background: '#090B10' }}>
      <Header />
      <main>
        <Hero />
        <Features />
        <Stats />
        <News />
      </main>
      <Footer />
    </div>
  </>
)

export default Home
