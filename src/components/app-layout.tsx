'use client';

import * as React from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import {
  BookCopy,
  LayoutDashboard,
  FileQuestion,
  Layers3,
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

const navItems = [
    { href: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { href: '/study-sets', icon: BookCopy, label: 'Study Sets' },
    { href: '/flashcards', icon: Layers3, label: 'Flashcards' },
    { href: '/quiz', icon: FileQuestion, label: 'Quizzes' },
];

export function AppLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    
    return (
        <SidebarProvider>
            <Sidebar>
                <SidebarHeader className="p-3">
                    <AppLogo />
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
                    {/* User profile section can go here */}
                </SidebarFooter>
            </Sidebar>
            <SidebarInset>
                <header className="flex h-14 items-center gap-4 border-b bg-background/80 px-4 sticky top-0 z-30 backdrop-blur-sm lg:h-[60px] lg:px-6">
                    <SidebarTrigger className="md:hidden" />
                    <div className="flex-1">
                        <h1 className="font-headline text-lg font-semibold md:text-2xl">
                            {navItems.find(item => pathname.startsWith(item.href))?.label || 'Dashboard'}
                        </h1>
                    </div>
                </header>
                <main className="flex-1 p-4 md:p-6 lg:p-8 bg-background">
                    {children}
                </main>
            </SidebarInset>
        </SidebarProvider>
    );
}
