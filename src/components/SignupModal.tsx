'use client';

import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { settingsApi } from '@/lib/api/client';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import NewsletterForm from './NewsletterForm';

export default function SignupModal() {
  const [mounted, setMounted] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

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

  useEffect(() => {
    if (!mounted) return;
    // Show modal after 5 seconds, only once per session
    const hasShown = sessionStorage.getItem('signup_modal_shown');
    if (!hasShown) {
      const timer = setTimeout(() => {
        setIsOpen(true);
        sessionStorage.setItem('signup_modal_shown', 'true');
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [mounted]);

  if (!mounted) return null;

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{settings['signup_modal_title'] || 'Join the newsletter'}</DialogTitle>
          <DialogDescription>
            {settings['signup_modal_description'] || 'Get the latest updates and exclusive content straight to your inbox.'}
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <NewsletterForm source="modal" />
        </div>
      </DialogContent>
    </Dialog>
  );
}

