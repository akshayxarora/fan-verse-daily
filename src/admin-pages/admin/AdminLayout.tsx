'use client';

// Admin panel layout component
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState } from 'react';
import {
  LayoutDashboard,
  FileText,
  Wrench,
  Settings,
  Users,
  Mail,
  Layout,
  Code,
  LogOut,
  Menu,
  X,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const adminNavItems = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/admin' },
  { icon: FileText, label: 'Posts', path: '/admin/posts' },
  { icon: Mail, label: 'Newsletter', path: '/admin/newsletter' },
  { icon: Layout, label: 'Site Settings', path: '/admin/themes' },
  { icon: Code, label: 'Code Injection', path: '/admin/code-injection' },
  { icon: Settings, label: 'System Settings', path: '/admin/settings' },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  const isEditorView = pathname?.includes('/admin/posts/') && (pathname.includes('/edit') || pathname.includes('/new'));

  const handleLogout = () => {
    localStorage.removeItem('auth_token');
    router.push('/');
  };

  return (
    <div className="h-screen bg-background flex flex-col overflow-hidden">
      {/* Mobile sidebar toggle */}
      {!isEditorView && (
        <div className="lg:hidden fixed top-0 left-0 right-0 z-50 border-b border-border bg-background/80 backdrop-blur-lg">
          <div className="flex items-center justify-between p-4">
            <h1 className="text-lg font-bold">Admin Panel</h1>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
          </div>
        </div>
      )}

      <div className={cn("flex flex-1 overflow-hidden", !isEditorView && "pt-16 lg:pt-0")}>
        {/* Sidebar */}
        {!isEditorView && (
          <aside
            className={cn(
              'fixed lg:static left-0 z-40 w-64 bg-card border-r border-border transform transition-transform duration-200 ease-in-out lg:translate-x-0',
              sidebarOpen ? 'translate-x-0' : '-translate-x-full',
              'top-16 lg:top-0 bottom-0 h-[calc(100vh-4rem)] lg:h-full'
            )}
          >
            <div className="flex flex-col h-full">
              <div className="p-4 border-b border-border flex-shrink-0">
                <h2 className="text-xl font-bold">Admin Panel</h2>
              </div>

              <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
                {adminNavItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.path}
                      href={item.path}
                      onClick={() => setSidebarOpen(false)}
                      className={cn(
                        "flex items-center gap-3 px-4 py-2 rounded-lg transition-colors",
                        pathname === item.path
                          ? "text-foreground bg-secondary"
                          : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                      )}
                    >
                      <Icon className="w-5 h-5" />
                      <span>{item.label}</span>
                    </Link>
                  );
                })}
              </nav>

              <div className="p-4 border-t border-border flex-shrink-0">
                <Button
                  variant="ghost"
                  className="w-full justify-start"
                  onClick={handleLogout}
                >
                  <LogOut className="w-5 h-5 mr-3" />
                  Logout
                </Button>
              </div>
            </div>
          </aside>
        )}

        {/* Main content */}
        <main className="flex-1 overflow-y-auto lg:ml-0">
          <div className={cn("container mx-auto", isEditorView ? "p-0 max-w-none" : "p-6")}>
            {children}
          </div>
        </main>
      </div>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-background/80 backdrop-blur-sm z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
}

