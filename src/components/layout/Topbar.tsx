import { TbBrandMeta } from 'react-icons/tb'
import { IoLogoInstagram } from 'react-icons/io'
import { RiTwitterXLine } from 'react-icons/ri'

const Topbar = () => {
  return (
    <div className='topbar-bg text-white'>
      <div className='container mx-auto flex justify-between items-center py-2 px-4'>
        <div className=' items-center space-x-4 hidden md:flex'>
          <a href='#' className='hover:text-gray-300' title='Meta'>
            <TbBrandMeta className='h-7 w-7 md:h-8 md:w-8' />
          </a>
          <a href='#' className='hover:text-gray-300' title='Instagram'>
            <IoLogoInstagram className='h-7 w-7 md:h-8 md:w-8' />
          </a>
          <a href='#' className='hover:text-gray-300' title='Twitter'>
            <RiTwitterXLine className='h-7 w-7 md:h-8 md:w-8' />
          </a>
        </div>

        <div className='text-sm text-center flex-grow'>
          <span>We Ship Worldwide Fast and reliable shipping!</span>
        </div>

        <div className='text-sm hidden md:block'>
          <a href='tel:+1234567890' className='hover:text-gray-300'>
            +39 (333) 219-000-6
          </a>
        </div>
      </div>
    </div>
  )
}

export default Topbar
