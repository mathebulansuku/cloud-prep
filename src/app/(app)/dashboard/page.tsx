import { DashboardClient } from '@/components/dashboard-client';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Dashboard | CertAI Prep',
};

export default function DashboardPage() {
  return <DashboardClient />;
}
