import * as React from 'react';
import { useState } from 'react';
import { Button } from './ui/button';

// Define the NavItem type
interface NavItem {
  title: string;
  href: string;
}

// Define the Navbar props
interface NavbarProps {
  logo?: React.ReactNode;
  items?: NavItem[];
}

// Array of navigation items
const defaultNavItems: NavItem[] = [
  {
    title: 'خانه',
    href: '/',
  },
  {
    title: 'انجمن',
    href: '/forum',
  },
  {
    title: 'مقالات',
    href: '/articles',
  },
  {
    title: 'درباره ما',
    href: '/about',
  },
  {
    title: 'تماس با ما',
    href: '/contact',
  },
];

export function Navbar({ logo, items = defaultNavItems }: NavbarProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="sticky top-0 z-50 w-full bg-white py-4 shadow-md">
      <div className="container mx-auto flex items-center justify-between px-4">
        {/* Logo section */}
        <div className="flex items-center">
          {logo ? (
            logo
          ) : (
            <a href="/" className="text-xl font-bold text-primary">
              انجمن پرستاران
            </a>
          )}
        </div>

        {/* Desktop navigation */}
        <div className="rtl hidden items-center space-x-1 space-x-reverse md:flex">
          {items.map((item, index) => (
            <a
              key={index}
              href={item.href}
              className="mx-2 px-3 py-2 text-sm font-medium text-gray-700 transition-colors duration-200 hover:text-primary"
            >
              {item.title}
            </a>
          ))}
          <Button className="mr-4">ورود / ثبت نام</Button>
        </div>

        {/* Mobile menu button */}
        <div className="md:hidden">
          <button
            type="button"
            className="text-gray-500 hover:text-gray-600 focus:outline-none"
            onClick={toggleMenu}
            aria-label={isMenuOpen ? 'بستن منو' : 'باز کردن منو'}
          >
            <svg
              className="h-6 w-6"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              {isMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="bg-white px-4 pt-2 pb-4 shadow-lg md:hidden">
          <div className="flex flex-col space-y-2">
            {items.map((item, index) => (
              <a
                key={index}
                href={item.href}
                className="rounded-md px-3 py-2 text-right text-sm font-medium text-gray-700 transition-colors duration-200 hover:text-primary"
              >
                {item.title}
              </a>
            ))}
            <Button className="mt-3 w-full">ورود / ثبت نام</Button>
          </div>
        </div>
      )}
    </nav>
  );
}
