// Admin settings page
import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Key, Save, Eye, EyeOff } from 'lucide-react';
import { toast } from 'sonner';

export default function AdminSettings() {
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const updatePasswordMutation = useMutation({
    mutationFn: async (data: { currentPassword: string; newPassword: string }) => {
      const token = localStorage.getItem('auth_token');
      
      // Verify current password
      const verifyResponse = await fetch('/api/auth/verify-password', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ password: data.currentPassword }),
      });

      if (!verifyResponse.ok) {
        throw new Error('Current password is incorrect');
      }

      // Update password
      const response = await fetch('/api/auth/update-password', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ newPassword: data.newPassword }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to update password');
      }

      return response.json();
    },
    onSuccess: () => {
      toast.success('Password updated successfully');
      setPasswordForm({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to update password');
    },
  });

  const handlePasswordUpdate = () => {
    if (!passwordForm.currentPassword || !passwordForm.newPassword || !passwordForm.confirmPassword) {
      toast.error('All fields are required');
      return;
    }

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }

    if (passwordForm.newPassword.length < 8) {
      toast.error('Password must be at least 8 characters');
      return;
    }

    updatePasswordMutation.mutate({
      currentPassword: passwordForm.currentPassword,
      newPassword: passwordForm.newPassword,
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="text-muted-foreground">Manage your account settings</p>
      </div>

      {/* Password Reset */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Key className="w-5 h-5" />
            <CardTitle>Change Password</CardTitle>
          </div>
          <CardDescription>Update your admin password</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="current-password">Current Password</Label>
            <div className="relative">
              <Input
                id="current-password"
                type={showCurrent ? 'text' : 'password'}
                value={passwordForm.currentPassword}
                onChange={(e) =>
                  setPasswordForm((prev) => ({ ...prev, currentPassword: e.target.value }))
                }
                placeholder="Enter current password"
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute right-0 top-0 h-full"
                onClick={() => setShowCurrent(!showCurrent)}
              >
                {showCurrent ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </Button>
            </div>
          </div>

          <div>
            <Label htmlFor="new-password">New Password</Label>
            <div className="relative">
              <Input
                id="new-password"
                type={showNew ? 'text' : 'password'}
                value={passwordForm.newPassword}
                onChange={(e) =>
                  setPasswordForm((prev) => ({ ...prev, newPassword: e.target.value }))
                }
                placeholder="Enter new password (min 8 characters)"
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute right-0 top-0 h-full"
                onClick={() => setShowNew(!showNew)}
              >
                {showNew ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </Button>
            </div>
          </div>

          <div>
            <Label htmlFor="confirm-password">Confirm New Password</Label>
            <div className="relative">
              <Input
                id="confirm-password"
                type={showConfirm ? 'text' : 'password'}
                value={passwordForm.confirmPassword}
                onChange={(e) =>
                  setPasswordForm((prev) => ({ ...prev, confirmPassword: e.target.value }))
                }
                placeholder="Confirm new password"
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute right-0 top-0 h-full"
                onClick={() => setShowConfirm(!showConfirm)}
              >
                {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </Button>
            </div>
          </div>

          <Button
            onClick={handlePasswordUpdate}
            disabled={updatePasswordMutation.isPending}
          >
            <Save className="w-4 h-4 mr-2" />
            {updatePasswordMutation.isPending ? 'Updating...' : 'Update Password'}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

