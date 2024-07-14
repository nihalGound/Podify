"use client"

import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import { Sheet, SheetClose, SheetContent, SheetTrigger } from './ui/sheet'
import { cn } from '@/lib/utils'
import { sideBarLinks } from '@/app/constants'
import { usePathname } from 'next/navigation'

const MobileNav = () => {
  const pathName = usePathname();
  return (
    <section>
      <Sheet>
        <SheetTrigger>
          <Image src={"/icons/hamburger.svg"} alt='menu' height={30} width={30} className='cursor-pointer hamburger-icon' />
        </SheetTrigger>
        <SheetContent side={'left'} className='bg-black-1  pt-2 border-none'>
          <Link className="flex justify-start gap-3 text-white-1 items-center" href={"/"}>
            <Image src={"/images/podify_logo.png"} height={40} width={40} alt='podify_logo' className='rounded-xl' />
            <span className='text-2xl font-bold'>Podify</span>
          </Link>
          <div className={cn("flex h-[calc(100vh-72px)] flex-col justify-between overflow-y-auto mt-5")}>
            <SheetClose asChild>
              <nav className='flex h-full flex-col gap-6 text-white-1'>
                {sideBarLinks.map(({ label, imageUrl, route }) => {
                  const isActive = pathName === route || pathName.startsWith(`${route}/`);
                  return <SheetClose asChild key={route}>
                    <Link href={route} className={cn("flex gap-3 items-center text-gray-1 py-4 justify-start max-lg:px-4", { "bg-nav-focus border-r-4 border-orange-1 text-white-1": isActive })}>
                      <Image src={imageUrl} height={24} width={24} alt={label} />
                      <span className={cn("text-sm font-medium text-gray-1", { "text-white-1": isActive })}>
                        {label}
                      </span>
                    </Link>
                  </SheetClose>
                })

                }
              </nav>
            </SheetClose>

          </div>
        </SheetContent>
      </Sheet>
    </section>
  )
}

export default MobileNav