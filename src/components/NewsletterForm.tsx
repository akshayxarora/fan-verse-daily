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
}

export default function NewsletterForm({ 
  source = 'blog', 
  className = '',
  title,
  description
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

