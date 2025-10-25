import { QuizClient } from '@/components/quiz-client';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Quizzes | CertAI Prep',
};

export default function QuizPage() {
  return <QuizClient />;
}
