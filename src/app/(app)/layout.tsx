import { AppLayout } from '@/components/app-layout';
import { AuthGuard } from '@/components/auth-guard';

export default function AppPagesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthGuard>
      <AppLayout>{children}</AppLayout>
    </AuthGuard>
  );
}
