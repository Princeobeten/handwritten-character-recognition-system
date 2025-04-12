import Link from 'next/link';

export default function Footer() {
  const links = [
    { href: '/', label: 'Home' },
    { href: '/about', label: 'About' },
    { href: '/upload', label: 'Upload' },
    { href: '/history', label: 'History' }
  ];

  return (
    <footer className="bg-background border-t border-gray-200 dark:border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <nav>
          <ul className="gap-6 flex flex-wrap items-center justify-center">
            {links.map(({ href, label }) => (
              <li key={href}>
                <Link 
                  href={href}
                  className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Copyright */}
        <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-800">
          <p className="text-center text-gray-500 dark:text-gray-400">
            © {new Date().getFullYear()} Handwritten Character Recognition. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}