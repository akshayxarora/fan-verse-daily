'use client';

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Search } from "lucide-react";
import { ThemeToggle } from "./ThemeToggle";

const navLinks = [
  { label: "Gaming", href: "/blog?category=gaming" },
  { label: "Movies", href: "/blog?category=movies" },
  { label: "TV", href: "/blog?category=tv" },
  { label: "Anime", href: "/blog?category=anime" },
];

// FanverseDaily Logo SVG
const FanverseLogo = () => (
  <svg fill="currentColor" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg" className="w-6 h-6">
    <path d="M42.4379 44C42.4379 44 36.0744 33.9038 41.1692 24C46.8624 12.9336 42.2078 4 42.2078 4L7.01134 4C7.01134 4 11.6577 12.932 5.96912 23.9969C0.876273 33.9029 7.27094 44 7.27094 44L42.4379 44Z" />
  </svg>
);

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-border bg-background/80 backdrop-blur-md">
      <div className="max-w-[1200px] mx-auto px-4 md:px-10 py-3">
        <nav className="flex items-center justify-between whitespace-nowrap">
          {/* Logo & Nav Links */}
          <div className="flex items-center gap-8">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 sm:gap-4 text-primary">
              <FanverseLogo />
              <h2 className="text-primary text-base sm:text-xl font-black leading-tight tracking-[-0.015em] hidden xs:block sm:block">
                FanverseDaily
              </h2>
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden md:flex items-center gap-6">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-foreground hover:text-primary transition-colors text-sm font-semibold leading-normal"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Right Side: Search, Subscribe, Profile */}
          <div className="flex flex-1 justify-end gap-4 items-center">
            {/* Search Bar - Hidden on mobile */}
            <label className="hidden sm:flex flex-col min-w-40 h-10 max-w-64">
              <div className="flex w-full flex-1 items-stretch rounded-lg h-full overflow-hidden border border-border">
                <div className="text-muted-foreground flex bg-card items-center justify-center pl-4">
                  <Search className="w-5 h-5" />
                </div>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="flex w-full min-w-0 flex-1 bg-card text-foreground focus:outline-none focus:ring-0 h-full placeholder:text-muted-foreground px-4 pl-2 text-sm font-normal border-none"
                  placeholder="Search Fanverse..."
                />
              </div>
            </label>

            {/* Subscribe Button */}
            <Link
              href="/subscribe"
              className="flex min-w-[84px] cursor-pointer items-center justify-center rounded-lg h-10 px-4 bg-primary text-white text-sm font-bold hover:brightness-110 transition-all"
            >
              Subscribe
            </Link>

            {/* Theme Toggle */}
            <ThemeToggle />

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden p-2 text-foreground"
              aria-label="Toggle menu"
            >
              {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </nav>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="md:hidden border-t border-border mt-3"
            >
              <div className="py-4 space-y-1">
                {/* Mobile Search */}
                <div className="px-4 pb-3">
                  <div className="flex w-full items-stretch rounded-lg h-10 overflow-hidden border border-border">
                    <div className="text-muted-foreground flex bg-card items-center justify-center pl-4">
                      <Search className="w-5 h-5" />
                    </div>
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="flex w-full min-w-0 flex-1 bg-card text-foreground focus:outline-none focus:ring-0 h-full placeholder:text-muted-foreground px-4 pl-2 text-sm font-normal border-none"
                      placeholder="Search Fanverse..."
                    />
                  </div>
                </div>

                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setIsOpen(false)}
                    className="block px-4 py-3 text-foreground hover:text-primary hover:bg-secondary/50 rounded-md transition-colors font-semibold"
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
};

export default Navigation;
