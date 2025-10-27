import { Metadata } from 'next';
import { FeatureDesignerClient } from '@/components/feature-designer-client';

export const metadata: Metadata = {
  title: 'AI Feature Designer | CertAI Prep',
};

export default function DesignerPage() {
  return <FeatureDesignerClient />;
}

