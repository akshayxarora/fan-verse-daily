'use client';

// Newsletter subscription form component
import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { newsletterApi } from '@/lib/api/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';

interface NewsletterFormProps {
  source?: string;
  className?: string;
  title?: string;
  description?: string;
  variant?: 'default' | 'compact';
}

export default function NewsletterForm({
  source = 'blog',
  className = '',
  title,
  description,
  variant = 'default'
}: NewsletterFormProps) {
  const [email, setEmail] = useState('');

  const subscribeMutation = useMutation({
    mutationFn: () => newsletterApi.subscribe(email, source),
    onSuccess: () => {
      toast.success('Successfully subscribed to newsletter!');
      setEmail('');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to subscribe');
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      toast.error('Please enter your email address');
      return;
    }
    subscribeMutation.mutate();
  };

  // Compact variant for sidebar (white on red background)
  if (variant === 'compact') {
    return (
      <form onSubmit={handleSubmit} className={`flex flex-col gap-3 ${className}`}>
        <input
          type="email"
          placeholder="email@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={subscribeMutation.isPending}
          className="bg-white/20 border border-white/20 rounded-lg text-sm placeholder:text-white/60 focus:ring-0 focus:border-white/40 text-white px-4 py-2"
        />
        <button
          type="submit"
          disabled={subscribeMutation.isPending}
          className="bg-white text-primary font-bold py-2 rounded-lg text-sm hover:bg-gray-100 transition-colors disabled:opacity-50"
        >
          {subscribeMutation.isPending ? 'Signing up...' : 'Sign Up'}
        </button>
      </form>
    );
  }

  // Default variant
  return (
    <div className={className}>
      {title && <h2 className="text-2xl font-bold mb-2">{title}</h2>}
      {description && <p className="text-muted-foreground mb-6">{description}</p>}
      <form onSubmit={handleSubmit} className="flex justify-center items-center gap-3">
        <Input
          type="email"
          placeholder="you@company.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={subscribeMutation.isPending}
          className="w-64"
        />
        <Button type="submit" disabled={subscribeMutation.isPending}>
          {subscribeMutation.isPending ? 'Subscribing...' : 'Subscribe'}
        </Button>
      </form>
    </div>
  );
}
