"use client"
import { useRef } from 'react'
import { motion } from 'framer-motion'
import Image from 'next/image'

const sponsors = [
  {
    id: 1,
    logo: 'https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg',
    alt: 'Google',
  },
  {
    id: 2,
    logo: 'https://upload.wikimedia.org/wikipedia/commons/a/ab/Meta-Logo.png',
    alt: 'Meta',
  },
  {
    id: 3,
    logo: 'https://upload.wikimedia.org/wikipedia/commons/4/44/Microsoft_logo.svg',
    alt: 'Microsoft',
  },
  {
    id: 4,
    logo: 'https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg',
    alt: 'Apple',
  },
  {
    id: 5,
    logo: 'https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg',
    alt: 'Amazon',
  },
  {
    id: 6,
    logo: 'https://upload.wikimedia.org/wikipedia/commons/0/08/Netflix_2015_logo.svg',
    alt: 'Netflix',
  },
  {
    id: 7,
    logo: 'https://upload.wikimedia.org/wikipedia/commons/4/42/Facebook_icon.svg',
    alt: 'Facebook',
  },
  {
    id: 8,
    logo: 'https://upload.wikimedia.org/wikipedia/commons/1/1c/Twitter_Logo_WhiteOnBlue.svg',
    alt: 'Twitter',
  },
  {
    id: 9,
    logo: 'https://upload.wikimedia.org/wikipedia/commons/7/7e/Uber_logo_2018.svg',
    alt: 'Uber',
  },
  {
    id: 10,
    logo: 'https://upload.wikimedia.org/wikipedia/commons/3/3c/Spotify_2021_logo_green.png',
    alt: 'Spotify',
  },
  {
    id: 11,
    logo: 'https://upload.wikimedia.org/wikipedia/commons/6/6f/Adobe_Systems_logo_and_wordmark.svg',
    alt: 'Adobe',
  },
  {
    id: 12,
    logo: 'https://upload.wikimedia.org/wikipedia/commons/6/6d/Oracle_logo.svg',
    alt: 'Oracle',
  },
  {
    id: 13,
    logo: 'https://upload.wikimedia.org/wikipedia/commons/9/9e/Salesforce_logo.svg',
    alt: 'Salesforce',
  },
  {
    id: 14,
    logo: 'https://upload.wikimedia.org/wikipedia/commons/8/8e/IBM_logo.svg',
    alt: 'IBM',
  },
  {
    id: 15,
    logo: 'https://upload.wikimedia.org/wikipedia/commons/9/9a/Intel-logo.svg',
    alt: 'Intel',
  },
  {
    id: 16,
    logo: 'https://upload.wikimedia.org/wikipedia/commons/3/3c/HP_logo_2012.svg',
    alt: 'HP',
  },
  {
    id: 17,
    logo: 'https://upload.wikimedia.org/wikipedia/commons/1/1c/Dell_Logo.svg',
    alt: 'Dell',
  },
  {
    id: 18,
    logo: 'https://upload.wikimedia.org/wikipedia/commons/9/9e/VMware_logo.svg',
    alt: 'VMware',
  },
]

function SponsorsBrands() {
  const containerRef = useRef(null)

  return (
    <section className='py-20 px-4 bg-gradient-to-r from-green-50 to-green-100'>
      <div className='container mx-auto text-center'>
        <h2 className='text-3xl lg:text-4xl font-bold text-gray-900 mb-12'>
          Trusted by Leading Brands
        </h2>
        <div className='relative overflow-hidden'>
          {/** Infinite Scrolling Animation */}
          <motion.div
            ref={containerRef}
            className='flex space-x-8'
            animate={{
              x: ['0%', '-100%'],
              transition: {
                duration: 30,
                repeat: Infinity,
                ease: 'linear',
              },
            }}
          >
            {[...sponsors, ...sponsors].map((sponsor, index) => (
              <motion.div
                key={`${sponsor.id}-${index}`}
                className='flex-shrink-0 w-48 p-6 bg-white rounded-lg hover:bg-green-50 transition-colors duration-300'
                whileHover={{ scale: 1.1, transition: { duration: 0.3 } }}
              >
                <Image
                  src={sponsor.logo}
                  alt={sponsor.alt}
                  width={192}
                  height={64}
                  className='w-full h-auto max-h-16 object-contain'
                  loading='lazy'
                  unoptimized
                />
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  )
}

export default SponsorsBrands
