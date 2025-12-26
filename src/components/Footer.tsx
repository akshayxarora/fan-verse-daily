'use client';

import Link from "next/link";
import { Terminal, Github, Twitter, Linkedin } from "lucide-react";
import { useQuery } from '@tanstack/react-query';
import { settingsApi } from '@/lib/api/client';
import { useEffect, useState } from 'react';

const footerLinks = {
  product: [
    { label: "My LinkedIn", href: "https://www.linkedin.com/in/kuldeep-paul/" },
  ],
  resources: [
    { label: "Blog", href: "/blog" },
  ],
  company: [
    { label: "About", href: "/about" },
  ],
};

const Footer = () => {
  const [mounted, setMounted] = useState(false);
  const { data: settingsData } = useQuery({
    queryKey: ['settings'],
    queryFn: () => settingsApi.getAll(),
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  const settings = Array.isArray(settingsData) 
    ? settingsData.reduce((acc: any, s: any) => ({ ...acc, [s.key]: s.value }), {})
    : {};

  if (!mounted) {
    return null;
  }

  return (
    <footer className="border-t border-border bg-card">
      <div className="container px-4 md:px-6 py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 lg:gap-12">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded bg-primary flex items-center justify-center">
                <Terminal className="w-4 h-4 text-primary-foreground" />
              </div>
              <span className="font-bold text-foreground">
                MWV
              </span>
            </Link>
            <p className="text-sm text-muted-foreground mb-6 max-w-xs">
              {settings['footer_description'] || 'Building reliable GTM strategies powered by AI and Data-Driven Decisions.'}
            </p>
            <div className="flex items-center gap-3">
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-lg bg-secondary flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-secondary/80 transition-colors"
              >
                <Twitter className="w-4 h-4" />
              </a>
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-lg bg-secondary flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-secondary/80 transition-colors"
              >
                <Github className="w-4 h-4" />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-lg bg-secondary flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-secondary/80 transition-colors"
              >
                <Linkedin className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Product Links */}
          <div>
            <h4 className="font-semibold text-foreground mb-4 text-sm">Links</h4>
            <ul className="space-y-3">
              {footerLinks.product.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources Links */}
          <div>
            <h4 className="font-semibold text-foreground mb-4 text-sm">Resources</h4>
            <ul className="space-y-3">
              {footerLinks.resources.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company Links */}
          <div>
            <h4 className="font-semibold text-foreground mb-4 text-sm">Company</h4>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-16 pt-8 border-t border-border flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} MarketingWithVibes. All rights reserved.
          </p>
          <p className="text-xs text-muted-foreground font-mono">
            Built with systems, not opinions.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
