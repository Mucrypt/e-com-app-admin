import Hero from '@/components/common/Hero'
import Topbar from '@/components/layout/Topbar'
import Navbar from '@/components/common/Navbar'
import Footer from '@/components/layout/Footer'
import SponsorsBrands from '@/components/layout/SponsorsBrands'

export default function Home() {
  return (
    <>
      <Topbar />
      <Navbar />
      <main>
        <Hero />

        <section className='container mx-auto px-4 py-8'>
          <h2 className='text-2xl font-bold mb-4'>Home Page</h2>
          {/* Add more professional content here as needed */}
        </section>
        <SponsorsBrands />
      </main>
      <Footer />
    </>
  )
}
