'use client';

import Link from 'next/link'
import { usePathname } from 'next/navigation';

const Navbar = () => {
  const path : string = usePathname();

  return (
    <div className='flex justify-between items-center px-4 md:px-8 border-b-1 border-zinc-900'>
      <div>DeepRecc</div>
      <div className='flex gap-6'>
        <Link href='/' className={`py-2 + ${path === '/' ? 'border-b-2 border-white' : ''}`} >
            home
        </Link>
        <Link href='/following' className={`py-2 + ${path === '/requests' ? 'border-b-2 border-white' : ''}`}>
            following
        </Link>
        <Link href='/reccs' className={`py-2 + ${path === '/requests' ? 'border-b-2 border-white' : ''}`}>
            my reccs
        </Link>
        <Link href='/profile' className={`py-2 + ${path === '/profile' ? 'border-b-2 border-white' : ''}`}>
            profile
        </Link>
      </div>
    </div>
  )
}

export default Navbar
