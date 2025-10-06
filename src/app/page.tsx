import Hero from '@/components/common/Hero'
import Topbar from '@/components/layout/Topbar'
import Navbar from '@/components/common/Navbar'
import Footer from '@/components/layout/Footer'
import SponsorsBrands from '@/components/layout/SponsorsBrands'
import HomePage from '@/components/common/HomePage'


export default function Home() {
  return (
    <>
      <Topbar />
      <Navbar />
      <main>
        <Hero />

        <section className='container mx-auto px-4 py-8'>
         
          <HomePage />
          {/* Add more professional content here as needed */}
        </section>
        <SponsorsBrands />
      </main>
      <Footer />
    </>
  )
}
