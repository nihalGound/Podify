'use client'

import { sideBarLinks } from '@/app/constants'
import { cn } from '@/lib/utils'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const LeftSideBar = () => {
  const pathName = usePathname();
  return (
    <section className={cn("left_sidebar h-[calc(100vh-2px)]",{
      "h-[calc(100vh-130px)]":false
    })}>
      <nav className='flex flex-col gap-6'>
        <Link href={"/"} className='flex items-center gap-3'>
          <Image src={"/images/podify_logo.png"} height={30} width={45} alt='podify_logo' className='rounded-xl' />
          <span className='text-2xl font-bold'>Podify</span>
        </Link>

        {sideBarLinks.map(({imageUrl,label,route})=>{
          const isActive = pathName === route || pathName.startsWith(`${route}/`);
          return <Link key={label} href={route} className={cn("flex items-center gap-3 py-4 max-lg:px-4 justify-center lg:justify-start rounded-md",{
            'bg-nav-focus border-r-4 border-orange-1 fill-red-400':isActive
          })}>
                <Image src={imageUrl} height={24} width={24} alt={label} />
                <span className={cn("text-sm font-medium text-gray-1",{"text-white-1":isActive})}>
                  {label}
                </span>
             </Link>
        })

        }

      </nav>
      
    </section>
  )
}

export default LeftSideBar