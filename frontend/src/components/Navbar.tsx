import { ConnectButton } from '@rainbow-me/rainbowkit';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';

const Navbar = () => {
  const router = useRouter();

  const isActive = (path: string) => router.pathname === path;

  return (
    <nav className="sticky top-0 z-50 bg-shield-accent border-b-2 border-shield-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center space-x-4">
            <Image src="/o2.png" alt="Oblivio Logo" width={48} height={48} className="w-12 h-12 object-contain" />
            <div className="flex space-x-8">
              <Link 
                href="/" 
                className={`nav-link ${isActive('/') ? 'text-shield-primary' : 'text-shield-text-light'}`}
              >
                Home
              </Link>
              <Link 
                href="/private-transaction" 
                className={`nav-link ${isActive('/private-transaction') ? 'text-shield-primary' : 'text-shield-text-light'}`}
              >
                Private Transaction
              </Link>
              <Link 
                href="/private-payroll" 
                className={`nav-link ${isActive('/private-payroll') ? 'text-shield-primary' : 'text-shield-text-light'}`}
              >
                Private Payroll
              </Link>
              <Link 
                href="/dashboard" 
                className={`nav-link ${isActive('/dashboard') ? 'text-shield-primary' : 'text-shield-text-light'}`}
              >
                Dashboard
              </Link>
            </div>
          </div>
          <ConnectButton />
        </div>
      </div>
    </nav>
  );
};

export default Navbar; 