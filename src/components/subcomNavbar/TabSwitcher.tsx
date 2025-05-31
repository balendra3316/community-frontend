

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { memo } from 'react';

interface NavItem {
  name: string;
  path: string;
}

interface TabSwitcherProps {
  items: NavItem[];
}

const TabSwitcher = memo(({ items }: TabSwitcherProps) => {
  const pathname = usePathname();

  return (
    <div className="border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <nav className="flex space-x-8" aria-label="Tabs">
          {items.map((item) => {
            const isActive = 
              (item.path === '/' && pathname === '/') ||
              (item.path !== '/' && pathname.startsWith(item.path));
            
            return (
              <Link
                key={item.name}
                href={item.path}
                className={`
                  inline-flex items-center py-4 px-1 border-b-4 font-medium text-sm
                  ${isActive 
                    ? 'border-yellow-500 text-yellow-900' 
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}
                `}
                aria-current={isActive ? 'page' : undefined}
              >
                {item.name}
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
});

TabSwitcher.displayName = 'TabSwitcher';
export default TabSwitcher;
