import { StudySetsClient } from '@/components/study-sets-client';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Study Sets | CertAI Prep',
};

export default function StudySetsPage() {
  return <StudySetsClient />;
}
