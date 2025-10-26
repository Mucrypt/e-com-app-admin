import React from 'react'
import Topbar from '@/components/layout/Topbar'
import Navbar from '@/components/common/Navbar'
import Footer from '@/components/layout/Footer'
import CategoryPage from '@/components/category/CategoryPage'

export default function ProductsPage() {
  return (
    <>
      <Topbar />
      <Navbar />
      <main className='min-h-screen bg-gray-50'>
        <CategoryPage />
      </main>
      
      <Footer />
    </>
  )
}
