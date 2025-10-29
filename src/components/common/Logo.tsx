// Logo.tsx
'use client'
import Link from 'next/link'

const Logo = () => {
  return (
    <Link
      href={'/'}
      className="inline-flex group items-center justify-center h-full"
      style={{ minHeight: '50px', minWidth: '150px' }} // Ensure minimum size
    >
      <div className="relative overflow-visible transform transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-105">
        {/* Animated gradient background */}
        <div className="absolute -inset-4 rounded-full bg-[conic-gradient(at_top_left,_var(--tw-gradient-stops))] from-green-400/20 via-yellow-400/20 to-orange-400/20 transform scale-0 group-hover:scale-100 transition-all duration-1000 ease-[cubic-bezier(0.22,1,0.36,1)] opacity-0 group-hover:opacity-100 blur-md" />

        {/* Main logo text with 3D effect */}
        <h2 className="relative z-10 flex items-center text-3xl md:text-4xl font-extrabold tracking-tight uppercase text-emerald-900 group-hover:text-emerald-500 transition-all duration-500 ease-out drop-shadow-md group-hover:drop-shadow-lg font-sans">
          {/* First part with dynamic shine effect */}
          <span className="relative inline-block bg-clip-text text-transparent bg-gradient-to-b from-emerald-900 to-emerald-900/90 group-hover:from-emerald-500 group-hover:to-emerald-500/80 transition-all duration-500 ease-out px-[2px] underline decoration-amber-500/50">
            MUKUL
          </span>

          {/* Second part with animated underline and color shift */}
          <span className="relative bg-clip-text text-transparent bg-gradient-to-b from-emerald-500 to-emerald-500/80 group-hover:from-amber-500 group-hover:to-amber-500/80 transition-all duration-500 ease-out ml-1 before:absolute before:bottom-0 before:left-0 before:w-0 before:h-[3px] before:bg-gradient-to-r before:transition-all before:duration-700 before:ease-[cubic-bezier(0.65,0,0.35,1)] group-hover:before:w-full">
            AH
            {/* Animated decorative arrow */}
            <span className="absolute -right-3 top-0 text-amber-500 opacity-0 group-hover:opacity-100 transition-all duration-300 delay-100 text-xl transform group-hover:translate-x-1 group-hover:-translate-y-1">
              ↗
            </span>
          </span>
        </h2>
      </div>
    </Link>
  )
}

export default Logo
