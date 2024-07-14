import LeftSideBar from "@/components/LeftSideBar";
import MobileNav from "@/components/MobileNav";
import RightSideBar from "@/components/RightSideBar";
import Image from "next/image";
import { Toaster } from "@/components/ui/toaster"

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="relative flex flex-col">
      <main className="relative flex bg-black-3 text-white-1">
        <LeftSideBar />
        <section className="flex min-h-screen flex-1 flex-col px-4 sm:px-14">
          <div className="mx-auto w-full flex flex-col max-w-5xl max-sm:px-4">
            <div className="flex justify-between items-center h-16 md:hidden">
              <div className="flex justify-start gap-2 text-white-1 items-center">
                <Image src={"/images/podify_logo.png"} height={30} width={40} alt='podify_logo' className='rounded-xl' />
                <span className='text-2xl font-bold'>Podify</span>
              </div>
              <MobileNav />
            </div>
            <div className="flex flex-col md:pb-14">
              <Toaster />
              {children}
            </div>
          </div>
        </section>
        <RightSideBar />
      </main>
    </div>
  );
}
