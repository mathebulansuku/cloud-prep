'use server';

import {
  generateCertificationQuiz,
  GenerateCertificationQuizInput,
} from '@/ai/flows/generate-certification-quiz';
import {
  generateAIFlashcards,
  GenerateAIFlashcardsInput,
} from '@/ai/flows/generate-ai-flashcards';
import {
  provideAdaptiveFeedback,
  ProvideAdaptiveFeedbackInput,
} from '@/ai/flows/provide-adaptive-feedback';
import { z } from 'zod';
import type { QuizQuestion, Flashcard } from './types';

const quizInputSchema = z.object({
  studyMaterial: z.string().min(500, "Please provide at least 500 words of study material."),
  numberOfQuestions: z.coerce.number().min(1, "Please enter at least 1 question.").max(20, "You can generate a maximum of 20 questions."),
  questionTypes: z.array(z.string()).min(1, "Please select at least one question type."),
  difficultyLevel: z.string(),
});

export async function createQuizAction(
  prevState: any,
  formData: FormData
): Promise<{ message?: string; error?: string; quiz?: QuizQuestion[] }> {
  
  const validatedFields = quizInputSchema.safeParse({
    studyMaterial: formData.get('studyMaterial'),
    numberOfQuestions: formData.get('numberOfQuestions'),
    questionTypes: formData.getAll('questionTypes'),
    difficultyLevel: formData.get('difficultyLevel'),
  });

  if (!validatedFields.success) {
    const firstError = Object.values(validatedFields.error.flatten().fieldErrors)[0]?.[0];
    return {
      error: firstError ?? "Invalid input. Please check the form and try again."
    };
  }
  
  try {
    const input: GenerateCertificationQuizInput = validatedFields.data;
    const result = await generateCertificationQuiz(input);
    if (!result.quizQuestions || result.quizQuestions.length === 0) {
      return { error: 'The AI could not generate a quiz from the provided material. Please try again with different content.' };
    }
    return { message: 'Quiz generated successfully!', quiz: result.quizQuestions };
  } catch (e) {
    console.error(e);
    return { error: 'An unexpected error occurred while generating the quiz. Please try again later.' };
  }
}

const flashcardInputSchema = z.object({
    studyMaterials: z.string().min(100, "Please provide at least 100 words of study material."),
    numberOfFlashcards: z.coerce.number().min(1, "Please enter at least 1 flashcard.").max(50, "You can generate a maximum of 50 flashcards."),
});

export async function createFlashcardsAction(
    prevState: any,
    formData: FormData
): Promise<{ message?: string; error?: string; flashcards?: Flashcard[] }> {
    const validatedFields = flashcardInputSchema.safeParse({
        studyMaterials: formData.get('studyMaterials'),
        numberOfFlashcards: formData.get('numberOfFlashcards'),
    });

    if (!validatedFields.success) {
        const firstError = Object.values(validatedFields.error.flatten().fieldErrors)[0]?.[0];
        return {
            error: firstError ?? "Invalid input. Please check the form and try again."
        };
    }

    try {
        const input: GenerateAIFlashcardsInput = validatedFields.data;
        const result = await generateAIFlashcards(input);
        if (!result.flashcards || result.flashcards.length === 0) {
            return { error: 'The AI could not generate flashcards from the provided material. Please try again with different content.' };
        }
        return { message: 'Flashcards generated successfully!', flashcards: result.flashcards };
    } catch (e) {
        console.error(e);
        return { error: 'An unexpected error occurred while generating flashcards. Please try again later.' };
    }
}

export async function getFeedbackAction(
  input: ProvideAdaptiveFeedbackInput
): Promise<{ feedback?: string; isCorrect?: boolean; error?: string }> {
  if (!input.question || !input.studentAnswer || !input.correctAnswer) {
    return { error: 'Missing required information to get feedback.' };
  }
  try {
    const result = await provideAdaptiveFeedback(input);
    return { feedback: result.feedback, isCorrect: result.isCorrect };
  } catch (e) {
    console.error(e);
    return { error: 'Failed to get AI feedback. Please try again.' };
  }
}
