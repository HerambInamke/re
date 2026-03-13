'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Header() {
  const pathname = usePathname();

  const navItems = [
    { href: '/', label: 'Dashboard', icon: '📊' },
    { href: '/analysis', label: 'Analytics', icon: '📈' },
    { href: '/about', label: 'About', icon: 'ℹ️' }
  ];

  return (
    <header className="bg-gradient-to-r from-blue-600 to-blue-700 border-b border-blue-800 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo and Title */}
          <div className="flex items-center gap-3">
            <div className="text-3xl">⚡</div>
            <div>
              <h1 className="text-xl font-bold text-white">
                UK Wind Power Monitor
              </h1>
              <p className="text-xs text-blue-100">
                Real-time Forecast Analytics
              </p>
            </div>
          </div>
          
          {/* Navigation */}
          <nav className="flex space-x-2">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-all ${
                  pathname === item.href
                    ? 'bg-white text-blue-700 shadow-md'
                    : 'text-blue-100 hover:bg-blue-500 hover:text-white'
                }`}
              >
                <span>{item.icon}</span>
                <span className="hidden sm:inline">{item.label}</span>
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </header>
  );
}
