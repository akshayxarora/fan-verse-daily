// Newsletter management page
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { newsletterApi } from '@/lib/api/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Mail, Trash2, Send, Users, Plus } from 'lucide-react';
import { toast } from 'sonner';
import NotionEditor from '@/components/admin/NotionEditor';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';


export default function AdminNewsletter() {
  const [sendForm, setSendForm] = useState({ subject: '', html: '', testEmail: '' });
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['newsletter-subscribers'],
    queryFn: () => newsletterApi.getSubscribers(),
  });

  const sendMutation = useMutation({
    mutationFn: (data: { subject: string; html: string; testEmail?: string }) =>
      newsletterApi.send(data.subject, data.html, data.testEmail),
    onSuccess: (data: any) => {
      toast.success((data as { message?: string })?.message || 'Newsletter sent successfully');
      setSendForm({ subject: '', html: '', testEmail: '' });
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to send newsletter');
    },
  });

  const removeMutation = useMutation({
    mutationFn: (email: string) => newsletterApi.remove(email),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['newsletter-subscribers'] });
      toast.success('Subscriber removed');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to remove subscriber');
    },
  });

  const handleSend = (isTest: boolean) => {
    if (!sendForm.subject || !sendForm.html) {
      toast.error('Subject and content are required');
      return;
    }

    if (isTest && !sendForm.testEmail) {
      toast.error('Test email is required');
      return;
    }

    sendMutation.mutate({
      subject: sendForm.subject,
      html: sendForm.html,
      testEmail: isTest ? sendForm.testEmail : undefined,
    });
  };

  const subscribersData = (data as { subscribers?: any[]; total?: number }) || {};
  const subscribers = subscribersData.subscribers || [];
  const totalSubscribers = subscribersData.total || 0;
  const activeSubscribers = subscribers.filter((s: any) => s.status === 'active').length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Newsletter</h1>
        <p className="text-muted-foreground">Manage subscribers and send newsletters</p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Subscribers</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalSubscribers}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active</CardTitle>
            <Mail className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeSubscribers}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Unsubscribed</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalSubscribers - activeSubscribers}</div>
          </CardContent>
        </Card>
      </div>

      {/* Send Newsletter */}
      <Card>
        <CardHeader>
          <CardTitle>Send Newsletter</CardTitle>
          <CardDescription>Compose and send a newsletter to all subscribers</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="test-email">Test Email (optional)</Label>
            <Input
              id="test-email"
              type="email"
              placeholder="test@example.com"
              value={sendForm.testEmail}
              onChange={(e) => setSendForm((prev) => ({ ...prev, testEmail: e.target.value }))}
            />
          </div>
          <div>
            <Label htmlFor="subject">Subject *</Label>
            <Input
              id="subject"
              value={sendForm.subject}
              onChange={(e) => setSendForm((prev) => ({ ...prev, subject: e.target.value }))}
              placeholder="Newsletter subject"
            />
          </div>
          <div>
            <Label htmlFor="html">Content *</Label>
            <NotionEditor
              content={sendForm.html}
              onChange={(html) => setSendForm((prev) => ({ ...prev, html }))}
              placeholder="Write your newsletter content here..."
              className="mt-2"
            />
            <p className="text-xs text-muted-foreground mt-2">
              The newsletter will automatically include the MarketingWithVibes branding and styling. Images and formatting are supported.
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              onClick={() => handleSend(true)}
              disabled={sendMutation.isPending}
              variant="outline"
            >
              <Send className="w-4 h-4 mr-2" />
              Send Test
            </Button>
            <Button
              onClick={() => handleSend(false)}
              disabled={sendMutation.isPending}
            >
              <Send className="w-4 h-4 mr-2" />
              {sendMutation.isPending ? 'Sending...' : `Send to ${activeSubscribers} Subscribers`}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Subscribers List */}
      <Card>
        <CardHeader>
          <CardTitle>Subscribers</CardTitle>
          <CardDescription>Manage your newsletter subscribers</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <p className="text-muted-foreground">Loading subscribers...</p>
          ) : subscribers.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Email</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Subscribed</TableHead>
                  <TableHead>Source</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {subscribers.map((subscriber: any) => (
                  <TableRow key={subscriber.id}>
                    <TableCell>{subscriber.email}</TableCell>
                    <TableCell>
                      <span
                        className={`text-xs px-2 py-1 rounded ${
                          subscriber.status === 'active'
                            ? 'bg-green-500/10 text-green-500'
                            : 'bg-gray-500/10 text-gray-500'
                        }`}
                      >
                        {subscriber.status}
                      </span>
                    </TableCell>
                    <TableCell>
                      {new Date(subscriber.subscribed_at).toLocaleDateString()}
                    </TableCell>
                    <TableCell>{subscriber.source || 'website'}</TableCell>
                    <TableCell>
                      {subscriber.status === 'active' && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            if (confirm(`Remove ${subscriber.email}?`)) {
                              removeMutation.mutate(subscriber.email);
                            }
                          }}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <p className="text-muted-foreground">No subscribers yet</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

