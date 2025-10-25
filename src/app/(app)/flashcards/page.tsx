import { FlashcardsClient } from '@/components/flashcards-client';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Flashcards | CertAI Prep',
};

export default function FlashcardsPage() {
  return <FlashcardsClient />;
}
