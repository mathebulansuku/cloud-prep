'use server';
/**
 * @fileOverview AI Flashcard Generator flow.
 *
 * - generateAIFlashcards - A function that generates flashcards from study materials.
 * - GenerateAIFlashcardsInput - The input type for the generateAIFlashcards function.
 * - GenerateAIFlashcardsOutput - The return type for the generateAIFlashcards function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateAIFlashcardsInputSchema = z.object({
  studyMaterials: z.string().describe('The study materials to generate flashcards from.'),
  numberOfFlashcards: z.number().optional().default(10).describe('The desired number of flashcards to generate.'),
});
export type GenerateAIFlashcardsInput = z.infer<typeof GenerateAIFlashcardsInputSchema>;

const GenerateAIFlashcardsOutputSchema = z.object({
  flashcards: z.array(z.object({
    question: z.string().describe('The question on the flashcard.'),
    answer: z.string().describe('The answer to the question on the flashcard.'),
  })).describe('The generated flashcards.'),
});
export type GenerateAIFlashcardsOutput = z.infer<typeof GenerateAIFlashcardsOutputSchema>;

export async function generateAIFlashcards(input: GenerateAIFlashcardsInput): Promise<GenerateAIFlashcardsOutput> {
  return generateAIFlashcardsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateAIFlashcardsPrompt',
  input: {schema: GenerateAIFlashcardsInputSchema},
  output: {schema: GenerateAIFlashcardsOutputSchema},
  prompt: `You are an AI flashcard generator. Generate flashcards from the following study materials. The number of flashcards to generate is {{{numberOfFlashcards}}}.\n\nStudy Materials: {{{studyMaterials}}}\n\nFlashcards:`,
});

const generateAIFlashcardsFlow = ai.defineFlow(
  {
    name: 'generateAIFlashcardsFlow',
    inputSchema: GenerateAIFlashcardsInputSchema,
    outputSchema: GenerateAIFlashcardsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
