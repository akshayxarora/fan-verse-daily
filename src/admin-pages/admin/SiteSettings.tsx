// Site settings management page
import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { settingsApi } from '@/lib/api/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Layout, MessageSquare, Info, Globe, Mail, Save } from 'lucide-react';
import { toast } from 'sonner';

export default function SiteSettings() {
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState<Record<string, string>>({});

  const { data: settings, isLoading } = useQuery({
    queryKey: ['settings'],
    queryFn: async () => {
      const result = await settingsApi.getAll();
      return Array.isArray(result) ? result : [];
    },
  });

  useEffect(() => {
    if (settings) {
      const initialData: Record<string, string> = {};
      settings.forEach((s: any) => {
        initialData[s.key] = s.value;
      });
      setFormData(initialData);
    }
  }, [settings]);

  const updateMutation = useMutation({
    mutationFn: async ({ key, value, group }: { key: string; value: string; group: string }) => {
      return settingsApi.update(key, value, 'string', group);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['settings'] });
      toast.success('Setting updated successfully');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to update setting');
    },
  });

  const handleSave = (key: string, group: string) => {
    updateMutation.mutate({ key, value: formData[key] || '', group });
  };

  const handleInputChange = (key: string, value: string) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  if (isLoading) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Loading settings...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Site Settings</h1>
        <p className="text-muted-foreground">Manage your website content and SEO</p>
      </div>

      <Tabs defaultValue="homepage" className="space-y-4">
        <TabsList>
          <TabsTrigger value="homepage">
            <Layout className="w-4 h-4 mr-2" />
            Home Page
          </TabsTrigger>
          <TabsTrigger value="blog">
            <MessageSquare className="w-4 h-4 mr-2" />
            Blog Page
          </TabsTrigger>
          <TabsTrigger value="newsletter">
            <Mail className="w-4 h-4 mr-2" />
            Newsletter & Modal
          </TabsTrigger>
          <TabsTrigger value="seo">
            <Globe className="w-4 h-4 mr-2" />
            SEO & Footer
          </TabsTrigger>
        </TabsList>

        <TabsContent value="homepage" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Home Page Content</CardTitle>
              <CardDescription>Update the texts on your landing page</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="home_hero_title">Hero Title</Label>
                <Textarea
                  id="home_hero_title"
                  value={formData['home_hero_title'] || ''}
                  onChange={(e) => handleInputChange('home_hero_title', e.target.value)}
                  placeholder="e.g., GTM Engineering&#10;Blog & Resources"
                  rows={2}
                />
                <p className="text-[10px] text-muted-foreground italic">Use a newline to create the bicolor effect (first line is white, second line is teal).</p>
                <Button size="sm" onClick={() => handleSave('home_hero_title', 'homepage')}>
                  <Save className="w-4 h-4 mr-2" /> Save
                </Button>
              </div>
              <div className="space-y-2">
                <Label htmlFor="home_hero_description">Hero Description</Label>
                <Textarea
                  id="home_hero_description"
                  value={formData['home_hero_description'] || ''}
                  onChange={(e) => handleInputChange('home_hero_description', e.target.value)}
                  placeholder="e.g., Technical deep-dives, systems breakdowns, and real-world GTM engineering insights."
                />
                <Button size="sm" onClick={() => handleSave('home_hero_description', 'homepage')}>
                  <Save className="w-4 h-4 mr-2" /> Save
                </Button>
              </div>
              <div className="space-y-2">
                <Label htmlFor="home_latest_posts_title">Latest Posts Section Title</Label>
                <Input
                  id="home_latest_posts_title"
                  value={formData['home_latest_posts_title'] || ''}
                  onChange={(e) => handleInputChange('home_latest_posts_title', e.target.value)}
                  placeholder="e.g., Latest from the blog"
                />
                <Button size="sm" onClick={() => handleSave('home_latest_posts_title', 'homepage')}>
                  <Save className="w-4 h-4 mr-2" /> Save
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="blog" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Blog Page Content</CardTitle>
              <CardDescription>Update the texts on your blog archive page</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="blog_title">Blog Title</Label>
                <Textarea
                  id="blog_title"
                  value={formData['blog_title'] || ''}
                  onChange={(e) => handleInputChange('blog_title', e.target.value)}
                  placeholder="e.g., Opinions&#10;backed by systems"
                  rows={2}
                />
                <p className="text-[10px] text-muted-foreground italic">Use a newline to create the bicolor effect (first line is white, second line is teal).</p>
                <Button size="sm" onClick={() => handleSave('blog_title', 'blog')}>
                  <Save className="w-4 h-4 mr-2" /> Save
                </Button>
              </div>
              <div className="space-y-2">
                <Label htmlFor="blog_description">Blog Description</Label>
                <Textarea
                  id="blog_description"
                  value={formData['blog_description'] || ''}
                  onChange={(e) => handleInputChange('blog_description', e.target.value)}
                  placeholder="e.g., Insights and guides on GTM systems and engineering."
                />
                <Button size="sm" onClick={() => handleSave('blog_description', 'blog')}>
                  <Save className="w-4 h-4 mr-2" /> Save
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="newsletter" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Newsletter & Signup Modal</CardTitle>
              <CardDescription>Update the texts for newsletter subscription and modals</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="signup_modal_title">Signup Modal Title</Label>
                <Input
                  id="signup_modal_title"
                  value={formData['signup_modal_title'] || ''}
                  onChange={(e) => handleInputChange('signup_modal_title', e.target.value)}
                  placeholder="e.g., Join the newsletter"
                />
                <Button size="sm" onClick={() => handleSave('signup_modal_title', 'newsletter')}>
                  <Save className="w-4 h-4 mr-2" /> Save
                </Button>
              </div>
              <div className="space-y-2">
                <Label htmlFor="signup_modal_description">Signup Modal Description</Label>
                <Textarea
                  id="signup_modal_description"
                  value={formData['signup_modal_description'] || ''}
                  onChange={(e) => handleInputChange('signup_modal_description', e.target.value)}
                  placeholder="e.g., Get the latest updates and exclusive content straight to your inbox."
                />
                <Button size="sm" onClick={() => handleSave('signup_modal_description', 'newsletter')}>
                  <Save className="w-4 h-4 mr-2" /> Save
                </Button>
              </div>
              <div className="space-y-2">
                <Label htmlFor="newsletter_cta_title">Newsletter CTA Title (Home)</Label>
                <Input
                  id="newsletter_cta_title"
                  value={formData['newsletter_cta_title'] || ''}
                  onChange={(e) => handleInputChange('newsletter_cta_title', e.target.value)}
                  placeholder="e.g., Stay Updated"
                />
                <Button size="sm" onClick={() => handleSave('newsletter_cta_title', 'newsletter')}>
                  <Save className="w-4 h-4 mr-2" /> Save
                </Button>
              </div>
              <div className="space-y-2">
                <Label htmlFor="newsletter_cta_description">Newsletter CTA Description (Home)</Label>
                <Textarea
                  id="newsletter_cta_description"
                  value={formData['newsletter_cta_description'] || ''}
                  onChange={(e) => handleInputChange('newsletter_cta_description', e.target.value)}
                  placeholder="e.g., Get the latest GTM engineering insights delivered to your inbox."
                />
                <Button size="sm" onClick={() => handleSave('newsletter_cta_description', 'newsletter')}>
                  <Save className="w-4 h-4 mr-2" /> Save
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="seo" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>SEO & Global Content</CardTitle>
              <CardDescription>Update site-wide descriptions and footer</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="site_meta_description">Website Landing Meta Description</Label>
                <Textarea
                  id="site_meta_description"
                  value={formData['site_meta_description'] || ''}
                  onChange={(e) => handleInputChange('site_meta_description', e.target.value)}
                  placeholder="e.g., Marketing With Vibes - GTM Engineering Blog and Resources for technical marketing teams."
                />
                <Button size="sm" onClick={() => handleSave('site_meta_description', 'seo')}>
                  <Save className="w-4 h-4 mr-2" /> Save
                </Button>
              </div>
              <div className="space-y-2">
                <Label htmlFor="footer_description">Footer Description</Label>
                <Textarea
                  id="footer_description"
                  value={formData['footer_description'] || ''}
                  onChange={(e) => handleInputChange('footer_description', e.target.value)}
                  placeholder="e.g., Technical deep-dives, systems breakdowns, and real-world GTM engineering insights."
                />
                <Button size="sm" onClick={() => handleSave('footer_description', 'seo')}>
                  <Save className="w-4 h-4 mr-2" /> Save
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
