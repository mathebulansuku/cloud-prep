'use client';

import * as React from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import {
  BookCopy,
  LayoutDashboard,
  FileQuestion,
  Layers3,
  Lightbulb,
  Search,
  LayoutGrid,
  List,
  Plus,
} from 'lucide-react';

import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
  SidebarInset,
  SidebarTrigger,
} from '@/components/ui/sidebar';
import { AppLogo } from '@/components/app-logo';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

const navItems = [
    { href: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { href: '/study-sets', icon: BookCopy, label: 'Study Sets' },
    { href: '/flashcards', icon: Layers3, label: 'Flashcards' },
    { href: '/quiz', icon: FileQuestion, label: 'Quizzes' },
    { href: '/designer', icon: Lightbulb, label: 'AI Designer' },
];

export function AppLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const router = useRouter();
    const [email, setEmail] = React.useState<string | null>(null);

    React.useEffect(() => {
        try {
            const raw = localStorage.getItem('certai-user');
            if (raw) {
                const user = JSON.parse(raw);
                setEmail(user?.email ?? null);
            }
        } catch {}
    }, []);

    const handleSignOut = React.useCallback(() => {
        try {
            localStorage.removeItem('certai-user');
        } catch {}
        router.replace('/');
    }, [router]);
    
    return (
        <SidebarProvider>
            <Sidebar>
                <SidebarHeader className="p-3">
                    <AppLogo className="text-[hsl(var(--sidebar-foreground))]" />
                </SidebarHeader>
                <SidebarContent>
                    <SidebarMenu>
                        {navItems.map((item) => (
                            <SidebarMenuItem key={item.label}>
                                <SidebarMenuButton
                                    asChild
                                    isActive={pathname.startsWith(item.href)}
                                    tooltip={{ children: item.label }}
                                >
                                    <Link href={item.href}>
                                        <item.icon />
                                        <span>{item.label}</span>
                                    </Link>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        ))}
                    </SidebarMenu>
                </SidebarContent>
                <SidebarFooter>
                    <div className="px-3 py-2 text-xs text-muted-foreground">
                        {email ? <span>Signed in as <span className="text-foreground font-medium">{email}</span></span> : <span>Not signed in</span>}
                    </div>
                    <div className="px-3 pb-3">
                        <Button variant="default" className="w-full" onClick={handleSignOut}>Sign out</Button>
                    </div>
                </SidebarFooter>
            </Sidebar>
            <SidebarInset>
                <header className="flex h-14 items-center gap-4 border-b bg-background/80 px-4 sticky top-0 z-30 backdrop-blur-sm lg:h-[60px] lg:px-6">
                    <SidebarTrigger className="md:hidden" />
                    <div className="hidden md:block">
                        <h1 className="font-headline text-lg font-semibold md:text-2xl">
                            {navItems.find(item => pathname.startsWith(item.href))?.label || 'Dashboard'}
                        </h1>
                    </div>
                    <div className="flex flex-1 items-center justify-center">
                        <div className="flex w-full max-w-xl items-center gap-2 rounded-full border bg-background px-3 py-1.5 shadow-sm">
                            <Search className="h-4 w-4 text-muted-foreground" />
                            <Input placeholder="Search..." className="h-8 border-0 shadow-none focus-visible:ring-0" />
                        </div>
                    </div>
                    <div className="hidden md:flex items-center gap-2">
                        <Button variant="ghost" size="icon" className="rounded-full"><LayoutGrid className="h-4 w-4" /></Button>
                        <Button variant="ghost" size="icon" className="rounded-full"><List className="h-4 w-4" /></Button>
                        <Button asChild className="rounded-full">
                            <Link href="/study-sets"><Plus className="mr-2 h-4 w-4"/>Add Study Set</Link>
                        </Button>
                    </div>
                </header>
                <main className="flex-1 p-4 md:p-6 lg:p-8 bg-background">
                    {children}
                </main>
            </SidebarInset>
        </SidebarProvider>
    );
}
