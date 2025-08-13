import { IoLogoInstagram } from 'react-icons/io5'
import { RiTwitterXFill } from 'react-icons/ri'
import { FaFacebookF, FaTiktok, FaYoutube, FaPinterestP } from 'react-icons/fa'
import { FiPhone, FiMail } from 'react-icons/fi'
import { HiOutlineLocationMarker } from 'react-icons/hi'
import Link from 'next/link'

const Footer = () => {
  return (
    <footer className='bg-gray-900 text-gray-300'>
      {/* Main Footer Content */}
      <div className='container mx-auto px-6 py-12'>
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12'>
          {/* Brand Info */}
          <div className='space-y-6'>
            <h3 className='text-2xl font-bold text-white'>MUKUL AH</h3>
            <p className='text-gray-400'>
              Premium eCommerce solutions for the modern world. Quality products
              with exceptional service.
            </p>

            {/* Social Media */}
            <div className='flex space-x-4 pt-2'>
              <a
                href='#'
                className='text-gray-400 hover:text-white transition-colors duration-300'
                aria-label='Facebook'
              >
                <FaFacebookF className='h-5 w-5' />
              </a>
              <a
                href='#'
                className='text-gray-400 hover:text-white transition-colors duration-300'
                aria-label='Instagram'
              >
                <IoLogoInstagram className='h-5 w-5' />
              </a>
              <a
                href='#'
                className='text-gray-400 hover:text-white transition-colors duration-300'
                aria-label='Twitter'
              >
                <RiTwitterXFill className='h-5 w-5' />
              </a>
              <a
                href='#'
                className='text-gray-400 hover:text-white transition-colors duration-300'
                aria-label='TikTok'
              >
                <FaTiktok className='h-5 w-5' />
              </a>
              <a
                href='#'
                className='text-gray-400 hover:text-white transition-colors duration-300'
                aria-label='YouTube'
              >
                <FaYoutube className='h-5 w-5' />
              </a>
              <a
                href='#'
                className='text-gray-400 hover:text-white transition-colors duration-300'
                aria-label='Pinterest'
              >
                <FaPinterestP className='h-5 w-5' />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className='space-y-6'>
            <h4 className='text-lg font-semibold text-white uppercase tracking-wider'>
              Shop
            </h4>
            <ul className='space-y-3'>
              {[
                'New Arrivals',
                'Best Sellers',
                'Men',
                'Women',
                'Kids',
                'Accessories',
                'Sale',
              ].map((item) => (
                <li key={item}>
                  <Link
                    href='#'
                    className='text-gray-400 hover:text-white transition-colors duration-300'
                  >
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Customer Service */}
          <div className='space-y-6'>
            <h4 className='text-lg font-semibold text-white uppercase tracking-wider'>
              Customer Service
            </h4>
            <ul className='space-y-3'>
              {[
                'Contact Us',
                'FAQs',
                'Shipping Policy',
                'Returns & Exchanges',
                'Order Tracking',
                'Size Guide',
                'Gift Cards',
              ].map((item) => (
                <li key={item}>
                  <Link
                    href='#'
                    className='text-gray-400 hover:text-white transition-colors duration-300'
                  >
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact & Newsletter */}
          <div className='space-y-6'>
            <h4 className='text-lg font-semibold text-white uppercase tracking-wider'>
              Contact Us
            </h4>
            <div className='space-y-4'>
              <div className='flex items-start space-x-3'>
                <HiOutlineLocationMarker className='h-5 w-5 mt-1 text-gray-400' />
                <p className='text-gray-400'>
                  123 Fashion Street, Milan, Italy 20100
                </p>
              </div>
              <div className='flex items-center space-x-3'>
                <FiPhone className='h-5 w-5 text-gray-400' />
                <a
                  href='tel:+393332190006'
                  className='text-gray-400 hover:text-white transition-colors duration-300'
                >
                  +39 (333) 219-000-6
                </a>
              </div>
              <div className='flex items-center space-x-3'>
                <FiMail className='h-5 w-5 text-gray-400' />
                <a
                  href='mailto:info@mukulah.com'
                  className='text-gray-400 hover:text-white transition-colors duration-300'
                >
                  info@mukulah.com
                </a>
              </div>
            </div>

            {/* Newsletter */}
            <div className='pt-2'>
              <h5 className='text-sm font-semibold text-white uppercase tracking-wider mb-3'>
                Subscribe to our newsletter
              </h5>
              <form className='flex flex-col space-y-3'>
                <input
                  type='email'
                  placeholder='Your email address'
                  className='px-4 py-3 bg-gray-800 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-white placeholder-gray-500'
                  required
                />
                <button
                  type='submit'
                  className='px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-medium rounded-md transition-colors duration-300'
                >
                  Subscribe
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className='border-t border-gray-800'>
        <div className='container mx-auto px-6 py-6'>
          <div className='flex flex-col md:flex-row justify-between items-center'>
            <p className='text-gray-500 text-sm'>
              © {new Date().getFullYear()} MUKUL AH. All rights reserved.
            </p>
            <div className='flex space-x-6 mt-4 md:mt-0'>
              <Link
                href='#'
                className='text-gray-500 hover:text-white text-sm transition-colors duration-300'
              >
                Privacy Policy
              </Link>
              <Link
                href='#'
                className='text-gray-500 hover:text-white text-sm transition-colors duration-300'
              >
                Terms of Service
              </Link>
              <Link
                href='#'
                className='text-gray-500 hover:text-white text-sm transition-colors duration-300'
              >
                Cookies
              </Link>
            </div>
            <div className='mt-4 md:mt-0'>
              <p className='text-gray-500 text-sm'>Designed with ❤️ in Italy</p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
