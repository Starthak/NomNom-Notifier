'use client';

import Image from "next/image";
import { useRouter } from "next/navigation";

const Logo = () => {
  const router = useRouter();

  return ( 
    <Image
      onClick={() => router.push('/')}
      className="block cursor-pointer w-[7rem] h-[5rem]" 
      src="/images/nomnomLogo.png" 
      height="100" 
      width="100" 
      alt="Logo" 
    />
   );
}
 
export default Logo;
