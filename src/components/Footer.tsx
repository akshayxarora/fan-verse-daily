'use client';

import Link from "next/link";
import { ArrowUp } from "lucide-react";

// FanverseDaily Logo SVG
const FanverseLogo = () => (
  <svg fill="currentColor" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg" className="w-8 h-8">
    <path d="M42.4379 44C42.4379 44 36.0744 33.9038 41.1692 24C46.8624 12.9336 42.2078 4 42.2078 4L7.01134 4C7.01134 4 11.6577 12.932 5.96912 23.9969C0.876273 33.9029 7.27094 44 7.27094 44L42.4379 44Z" />
  </svg>
);

const footerLinks = {
  categories: [
    { label: "Gaming & Esports", href: "/blog?category=gaming" },
    { label: "Movies", href: "/blog?category=movies" },
    { label: "TV & Streaming", href: "/blog?category=tv" },
    { label: "Anime & Manga", href: "/blog?category=anime" },
    { label: "Wrestling News", href: "/blog?category=wrestling" },
    { label: "Tech & Hardware", href: "/blog?category=tech" },
  ],
  company: [
    { label: "About Us", href: "/about" },
    { label: "Contact Support", href: "/contact" },
    { label: "Privacy Policy", href: "/privacy" },
    { label: "Terms of Service", href: "/terms" },
    { label: "Advertising", href: "/advertise" },
    { label: "Cookie Settings", href: "/cookies" },
  ],
};

const Footer = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-[#0F1419] border-t border-[#2A3441]">
      <div className="max-w-[1200px] mx-auto pt-12 sm:pt-20 pb-8 sm:pb-10 px-4 sm:px-6">
        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-12 mb-10 sm:mb-16">
          {/* Brand Column */}
          <div className="flex flex-col gap-4 sm:gap-6 col-span-2 md:col-span-1">
            <Link href="/" className="flex items-center gap-2 sm:gap-3 text-primary">
              <FanverseLogo />
              <h2 className="text-xl sm:text-2xl font-black tracking-tight">FanverseDaily</h2>
            </Link>
            <p className="text-gray-400 text-xs sm:text-sm leading-relaxed max-w-xs">
              FanverseDaily is your ultimate source for the latest breaking news in entertainment, gaming, anime, and pop culture.
            </p>
            <button
              onClick={scrollToTop}
              className="flex items-center gap-2 text-primary hover:text-white transition-colors text-xs sm:text-sm font-bold uppercase tracking-wider w-fit"
            >
              <ArrowUp className="w-4 h-4" />
              Back to Top
            </button>
          </div>

          {/* Categories Column */}
          <div>
            <h4 className="text-white font-black uppercase tracking-widest text-xs sm:text-sm mb-4 sm:mb-6 pb-2 border-b border-primary/30 w-fit">
              Categories
            </h4>
            <ul className="flex flex-col gap-2 sm:gap-3">
              {footerLinks.categories.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-gray-400 hover:text-primary transition-colors text-xs sm:text-sm font-medium"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company Column */}
          <div className="hidden sm:block">
            <h4 className="text-white font-black uppercase tracking-widest text-xs sm:text-sm mb-4 sm:mb-6 pb-2 border-b border-primary/30 w-fit">
              Company
            </h4>
            <ul className="flex flex-col gap-2 sm:gap-3">
              {footerLinks.company.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-gray-400 hover:text-primary transition-colors text-xs sm:text-sm font-medium"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Follow Column */}
          <div className="col-span-2 sm:col-span-1">
            <h4 className="text-white font-black uppercase tracking-widest text-xs sm:text-sm mb-4 sm:mb-6 pb-2 border-b border-primary/30 w-fit">
              Follow Us
            </h4>
            <div className="flex flex-wrap gap-3 sm:gap-4 mt-2">
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-[#1A1F2E] flex items-center justify-center hover:bg-primary transition-all group"
                aria-label="Twitter"
              >
                <svg className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400 group-hover:text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </a>
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-[#1A1F2E] flex items-center justify-center hover:bg-primary transition-all group"
                aria-label="YouTube"
              >
                <svg className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400 group-hover:text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                </svg>
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-[#1A1F2E] flex items-center justify-center hover:bg-primary transition-all group"
                aria-label="Instagram"
              >
                <svg className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400 group-hover:text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                </svg>
              </a>
              <a
                href="/rss"
                className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-[#1A1F2E] flex items-center justify-center hover:bg-primary transition-all group"
                aria-label="RSS Feed"
              >
                <svg className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400 group-hover:text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M6.18 15.64a2.18 2.18 0 0 1 2.18 2.18C8.36 19 7.38 20 6.18 20C5 20 4 19 4 17.82a2.18 2.18 0 0 1 2.18-2.18M4 4.44A15.56 15.56 0 0 1 19.56 20h-2.83A12.73 12.73 0 0 0 4 7.27V4.44m0 5.66a9.9 9.9 0 0 1 9.9 9.9h-2.83A7.07 7.07 0 0 0 4 12.93V10.1z" />
                </svg>
              </a>
            </div>
            <div className="mt-6 sm:mt-8 bg-[#1A1F2E]/50 p-3 sm:p-4 rounded-lg border border-[#2A3441] hidden sm:block">
              <p className="text-[10px] sm:text-xs text-gray-400 italic">
                Stay connected for exclusive content and early news access.
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-6 sm:pt-8 border-t border-[#2A3441] flex flex-col sm:flex-row justify-between items-center gap-3 sm:gap-4">
          <p className="text-[10px] sm:text-xs text-gray-400 font-medium tracking-wide text-center sm:text-left">
            © {new Date().getFullYear()} <span className="text-white">FanverseDaily</span>. All rights reserved.
          </p>
          <div className="flex gap-6">
            <span className="text-[8px] sm:text-[10px] text-gray-500 uppercase font-black tracking-widest">
              Designed for the fans
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
