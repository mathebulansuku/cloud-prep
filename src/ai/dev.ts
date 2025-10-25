import { config } from 'dotenv';
config();

import '@/ai/flows/generate-ai-flashcards.ts';
import '@/ai/flows/generate-certification-quiz.ts';
import '@/ai/flows/provide-adaptive-feedback.ts';