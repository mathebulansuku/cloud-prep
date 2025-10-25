'use server';

/**
 * @fileOverview This file defines a Genkit flow for providing adaptive feedback on quiz answers.
 *
 * The flow evaluates a student's answer against the correct answer and provides detailed feedback,
 * including explanations and identification of misconceptions. The file exports:
 *
 * - `provideAdaptiveFeedback`: The main function to trigger the adaptive feedback flow.
 * - `ProvideAdaptiveFeedbackInput`: The input type for the `provideAdaptiveFeedback` function.
 * - `ProvideAdaptiveFeedbackOutput`: The output type for the `provideAdaptiveFeedback` function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

/**
 * Input schema for the adaptive feedback flow.
 */
const ProvideAdaptiveFeedbackInputSchema = z.object({
  question: z.string().describe('The quiz question.'),
  studentAnswer: z.string().describe('The student\'s answer to the question.'),
  correctAnswer: z.string().describe('The correct answer to the question.'),
  explanation: z.string().describe('A detailed explanation of the correct answer.'),
});

export type ProvideAdaptiveFeedbackInput = z.infer<
  typeof ProvideAdaptiveFeedbackInputSchema
>;

/**
 * Output schema for the adaptive feedback flow.
 */
const ProvideAdaptiveFeedbackOutputSchema = z.object({
  feedback: z.string().describe('Detailed feedback on the student\'s answer.'),
  isCorrect: z.boolean().describe('Whether the student\'s answer is correct.'),
});

export type ProvideAdaptiveFeedbackOutput = z.infer<
  typeof ProvideAdaptiveFeedbackOutputSchema
>;

/**
 * Main function to trigger the adaptive feedback flow.
 *
 * @param input - The input object containing the question, student's answer, correct answer, and explanation.
 * @returns A promise that resolves to the feedback object.
 */
export async function provideAdaptiveFeedback(
  input: ProvideAdaptiveFeedbackInput
): Promise<ProvideAdaptiveFeedbackOutput> {
  return provideAdaptiveFeedbackFlow(input);
}

const provideAdaptiveFeedbackPrompt = ai.definePrompt({
  name: 'provideAdaptiveFeedbackPrompt',
  input: {schema: ProvideAdaptiveFeedbackInputSchema},
  output: {schema: ProvideAdaptiveFeedbackOutputSchema},
  prompt: `You are an AI-powered tutor providing feedback to students on their quiz answers.

  Evaluate the student's answer and compare it to the correct answer. Provide detailed and constructive feedback.
  If the answer is incorrect, explain the meaning behind each potential answer and clearly identify the correct answer.
  Identify any nuanced understanding or misconceptions in the student's learning.

  Question: {{{question}}}
  Student's Answer: {{{studentAnswer}}}
  Correct Answer: {{{correctAnswer}}}
  Explanation: {{{explanation}}}

  Provide your feedback in a clear and concise manner. Also, set isCorrect to true or false. Focus on helping the student understand the concepts better.

  Ensure that the output matches the schema: { feedback: string, isCorrect: boolean }.
  `,
});

/**
 * Genkit flow definition for providing adaptive feedback.
 */
const provideAdaptiveFeedbackFlow = ai.defineFlow(
  {
    name: 'provideAdaptiveFeedbackFlow',
    inputSchema: ProvideAdaptiveFeedbackInputSchema,
    outputSchema: ProvideAdaptiveFeedbackOutputSchema,
  },
  async input => {
    const {output} = await provideAdaptiveFeedbackPrompt(input);
    return output!;
  }
);

