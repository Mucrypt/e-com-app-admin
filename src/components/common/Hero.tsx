'use client'
import { useEffect, useState, useCallback } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { FaAngleRight, FaAngleLeft } from 'react-icons/fa6'

const Hero = () => {
  const [currentImage, setCurrentImage] = useState(0)
  const [isTransitioning, setIsTransitioning] = useState(false)

  const desktopImages = [
    '/images/hero/desktop/img1.webp',
    '/images/hero/desktop/img2.webp',
    '/images/hero/desktop/img3.jpg',
    '/images/hero/desktop/img4.jpg',
    '/images/hero/desktop/img5.webp',
  ]
  const mobileImages = [
    '/images/hero/mobile/img1_mobile.jpg',
    '/images/hero/mobile/img2_mobile.webp',
    '/images/hero/mobile/img3_mobile.jpg',
    '/images/hero/mobile/img4_mobile.jpg',
    '/images/hero/mobile/img5_mobile.png',
  ]

  const nextImage = useCallback(() => {
    if (isTransitioning) return
    setIsTransitioning(true)
    setCurrentImage((prev) => (prev < desktopImages.length - 1 ? prev + 1 : 0))
    setTimeout(() => setIsTransitioning(false), 500)
  }, [desktopImages.length, isTransitioning])

  const prevImage = useCallback(() => {
    if (isTransitioning) return
    setIsTransitioning(true)
    setCurrentImage((prev) => (prev > 0 ? prev - 1 : desktopImages.length - 1))
    setTimeout(() => setIsTransitioning(false), 500)
  }, [desktopImages.length, isTransitioning])

  useEffect(() => {
    const interval = setInterval(nextImage, 5000)
    return () => clearInterval(interval)
  }, [nextImage])

  return (
    <div className='container mx-auto px-0 md:px-4 rounded'>
      <div className='h-48 md:h-96 w-full relative overflow-hidden bg-gray-200'>
        {/* Debug container - will show red if images aren't loading */}
        <div className='absolute inset-0 bg-red-500/10 z-0'></div>

        {/* Image Slider */}
        <div className='h-full w-full relative'>
          {/* Desktop and tablet version */}
          <div className='hidden md:block h-full w-full overflow-hidden'>
            <div
              className={`hero-slider-row hero-slider-row-transform`}
              style={{
                ['--hero-slider-transform' as string]: `translateX(-${
                  currentImage * 100
                }%)`,
              }}
            >
              {desktopImages.map((imageUrl, index) => (
                <div
                  key={`desktop-${index}`}
                  className='w-full h-full flex-shrink-0 relative'
                >
                  <Image
                    src={imageUrl}
                    alt={`Banner ${index + 1}`}
                    fill
                    sizes='(min-width: 768px) 100vw, 0vw'
                    className='object-cover'
                    priority={index === 0}
                    unoptimized={true}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Mobile version */}
          <div className='block md:hidden h-full w-full overflow-hidden'>
            <div
              className={`hero-slider-row hero-slider-row-transform`}
              style={{
                ['--hero-slider-transform' as string]: `translateX(-${
                  currentImage * 100
                }%)`,
              }}
            >
              {mobileImages.map((imageUrl, index) => (
                <div
                  key={`mobile-${index}`}
                  className='w-full h-full flex-shrink-0 relative'
                >
                  <Image
                    src={imageUrl}
                    alt={`Banner mobile ${index + 1}`}
                    fill
                    sizes='(max-width: 767px) 100vw, 0vw'
                    className='object-cover'
                    priority={index === 0}
                    unoptimized={true}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Navigation Arrows */}
        <div className='absolute z-20 inset-0 flex items-center justify-between px-4 pointer-events-none'>
          <button
            onClick={prevImage}
            className='pointer-events-auto p-2 rounded-full bg-black/30 text-white hover:bg-black/50 transition-colors'
            aria-label='Previous image'
          >
            <FaAngleLeft className='text-xl' />
          </button>
          <button
            onClick={nextImage}
            className='pointer-events-auto p-2 rounded-full bg-black/30 text-white hover:bg-black/50 transition-colors'
            aria-label='Next image'
          >
            <FaAngleRight className='text-xl' />
          </button>
        </div>

        {/* Overlay Text */}
        <div className='absolute z-10 inset-0 flex flex-col items-center justify-center bg-black/20 px-4'>
          <div className='text-center text-white space-y-2 md:space-y-4'>
            <h1 className='text-xl md:text-5xl font-bold tracking-wide'>
              Welcome to Our Store
            </h1>
            <p className='text-sm md:text-xl max-w-2xl'>
              Discover the latest trends and shop your favorite products at
              unbeatable prices.
            </p>
            <Link
              href='/products'
              className='inline-block px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition'
            >
              🛍️ Go to Products
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Hero
