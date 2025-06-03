'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

const navItems = [
  { title: 'Overview', href: '/dashboard', icon: '📊' },
  { title: 'Convert', href: '/dashboard/convert', icon: '🔄' },
  { title: 'Recipes', href: '/dashboard/recipes', icon: '📖' },
  { title: 'Collections', href: '/dashboard/collections', icon: '📁' },
  { title: 'Settings', href: '/dashboard/settings', icon: '⚙️' },
];

export function MobileNav() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  return (
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex h-8 w-8 flex-col items-center justify-center gap-1"
      >
        <span className={cn(
          'h-0.5 w-5 bg-text transition-all',
          isOpen && 'translate-y-1.5 rotate-45'
        )} />
        <span className={cn(
          'h-0.5 w-5 bg-text transition-all',
          isOpen && 'opacity-0'
        )} />
        <span className={cn(
          'h-0.5 w-5 bg-text transition-all',
          isOpen && '-translate-y-1.5 -rotate-45'
        )} />
      </button>

      {isOpen && (
        <div className="fixed inset-0 top-16 z-50 bg-background">
          <nav className="container py-4">
            {navItems.map((item) => {
              const isActive = pathname === item.href || 
                (item.href !== '/dashboard' && pathname.startsWith(item.href));
              
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className={cn(
                    'flex items-center gap-3 rounded-lg px-3 py-3 text-base font-medium',
                    isActive
                      ? 'bg-accent/20 text-accent'
                      : 'text-text-dark'
                  )}
                >
                  <span className="text-2xl">{item.icon}</span>
                  {item.title}
                </Link>
              );
            })}
            
            <div className="mt-8 border-t border-text-dark/20 pt-4">
              <Link
                href="/dashboard/subscription"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-3 rounded-lg px-3 py-3 text-base font-medium text-text-dark"
              >
                <span className="text-2xl">💎</span>
                Subscription
              </Link>
            </div>
          </nav>
        </div>
      )}
    </>
  );
}