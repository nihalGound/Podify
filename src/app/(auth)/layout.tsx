import Image from "next/image";

export default function RootLayout({
    children,
  }: Readonly<{
    children: React.ReactNode;
  }>) {
    return (
      <div className="relative h-screen w-full  ">
        <div className="absolute size-full">
          <Image src={"/images/podify_bg1.png"} alt="auth-bg" fill className="size-full" />
        </div>
        {children}
      </div>

    );
  }
  