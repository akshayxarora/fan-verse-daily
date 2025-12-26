'use client';

// Code injection management page
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Code, Save, Plus, Trash2, Info } from 'lucide-react';
import { toast } from 'sonner';
import { codeInjectionApi } from '@/lib/api/client';
import { Input } from '@/components/ui/input';
import { ClientOnly } from '@/components/ClientOnly';

export default function AdminCodeInjection() {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    location: 'head' as 'head' | 'body' | 'footer',
    code: '',
    description: '',
    enabled: true,
  });

  const queryClient = useQueryClient();

  const { data: injectionsData, isLoading } = useQuery({
    queryKey: ['code-injections'],
    queryFn: () => codeInjectionApi.getAll(),
  });

  const injections = (injectionsData as any[]) || [];

  const saveMutation = useMutation({
    mutationFn: async (data: any) => {
      if (editingId) {
        return codeInjectionApi.update(editingId, data);
      } else {
        return codeInjectionApi.create(data);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['code-injections'] });
      toast.success(editingId ? 'Code injection updated' : 'Code injection created');
      setEditingId(null);
      setFormData({ location: 'head', code: '', description: '', enabled: true });
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to save code injection');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => codeInjectionApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['code-injections'] });
      toast.success('Code injection deleted');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to delete code injection');
    },
  });

  const handleSave = () => {
    if (!formData.code.trim()) {
      toast.error('Code is required');
      return;
    }
    saveMutation.mutate(formData);
  };

  const handleEdit = (injection: any) => {
    setEditingId(injection.id);
    setFormData({
      location: injection.location,
      code: injection.code,
      description: injection.description || '',
      enabled: injection.enabled,
    });
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this code injection?')) {
      deleteMutation.mutate(id);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Code Injection</h1>
        <p className="text-muted-foreground">Inject custom HTML, CSS, or JavaScript into your site</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Form */}
        <Card>
          <CardHeader>
            <CardTitle>{editingId ? 'Edit' : 'New'} Code Injection</CardTitle>
            <CardDescription>
              Add custom code that will be injected into your site
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="location">Location</Label>
              <ClientOnly>
                <Select
                  value={formData.location}
                  onValueChange={(value: any) => setFormData((prev) => ({ ...prev, location: value }))}
                >
                  <SelectTrigger suppressHydrationWarning>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="head">Head (before &lt;/head&gt;)</SelectItem>
                    <SelectItem value="body">Body (after &lt;body&gt;)</SelectItem>
                    <SelectItem value="footer">Footer (before &lt;/body&gt;)</SelectItem>
                  </SelectContent>
                </Select>
              </ClientOnly>
            </div>

            <div>
              <Label htmlFor="description">Description (Meta-tag)</Label>
              <Input
                id="description"
                value={formData.description}
                onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                placeholder="e.g. Google Analytics, Hubspot Chatbot"
              />
              <p className="text-[10px] text-muted-foreground mt-1">This description will be included as a comment in your HTML.</p>
            </div>

            <div>
              <Label htmlFor="code">Code</Label>
              <Textarea
                id="code"
                value={formData.code}
                onChange={(e) => setFormData((prev) => ({ ...prev, code: e.target.value }))}
                placeholder="<script>console.log('Hello');</script>"
                rows={10}
                className="font-mono text-sm"
              />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="enabled">Enabled</Label>
              <Switch
                id="enabled"
                checked={formData.enabled}
                onCheckedChange={(checked) => setFormData((prev) => ({ ...prev, enabled: checked }))}
              />
            </div>

            <div className="flex gap-2">
              <Button onClick={handleSave} disabled={saveMutation.isPending} className="flex-1">
                <Save className="w-4 h-4 mr-2" />
                {saveMutation.isPending ? 'Saving...' : 'Save'}
              </Button>
              {editingId && (
                <Button
                  variant="outline"
                  onClick={() => {
                    setEditingId(null);
                    setFormData({ location: 'head', code: '', description: '', enabled: true });
                  }}
                >
                  Cancel
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        {/* List */}
        <Card>
          <CardHeader>
            <CardTitle>Active Injections</CardTitle>
            <CardDescription>Manage your code injections</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <p className="text-muted-foreground">Loading...</p>
            ) : injections && injections.length > 0 ? (
              <div className="space-y-4">
                {injections.map((injection: any) => (
                  <div
                    key={injection.id}
                    className="p-4 border rounded-lg space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Code className="w-4 h-4 text-muted-foreground" />
                        <span className="font-medium">{injection.location}</span>
                        {injection.description && (
                          <span className="text-xs text-muted-foreground italic">— {injection.description}</span>
                        )}
                        {injection.enabled ? (
                          <span className="text-xs px-2 py-1 rounded bg-green-500/10 text-green-500">
                            Enabled
                          </span>
                        ) : (
                          <span className="text-xs px-2 py-1 rounded bg-gray-500/10 text-gray-500">
                            Disabled
                          </span>
                        )}
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEdit(injection)}
                        >
                          Edit
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDelete(injection.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                    <pre className="text-xs bg-secondary p-2 rounded overflow-x-auto">
                      {injection.code.substring(0, 100)}
                      {injection.code.length > 100 ? '...' : ''}
                    </pre>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground">No code injections yet</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

