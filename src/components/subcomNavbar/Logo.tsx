// components/NavBar/Logo.tsx
import Link from 'next/link';
import { memo } from 'react';

const Logo = memo(() => {
  return (
    <div className="flex items-center">
      <Link href="/" className="flex items-center">
        <div className="rounded-md p-1">
          <img 
            src="/logo acd.png" 
            alt="Logo" 
            className="h-12 w-13 object-contain"
            loading="lazy"
          />
        </div>
        <span className="ml-2 text-xl font-bold text-gray-800 hidden md:block">
          Anyone Can Dance
        </span>
      </Link>
    </div>
  );
});

Logo.displayName = 'Logo';
export default Logo;