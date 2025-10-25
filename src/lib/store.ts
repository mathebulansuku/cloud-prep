import React from 'react';
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { StudySet, Quiz, Flashcard, QuizAttempt } from '@/lib/types';

interface AppState {
  studySets: StudySet[];
  addStudySet: (set: Omit<StudySet, 'id' | 'createdAt'>) => void;
  removeStudySet: (id: string) => void;
  getStudySet: (id: string) => StudySet | undefined;

  quizzes: Quiz[];
  addQuiz: (quiz: Omit<Quiz, 'id' | 'createdAt'>) => string;

  quizAttempts: QuizAttempt[];
  addQuizAttempt: (attempt: Omit<QuizAttempt, 'id' | 'submittedAt'>) => string;
  updateFeedback: (attemptId: string, questionIndex: number, feedback: string) => void;

  generatedFlashcards: { [studySetId: string]: Flashcard[] };
  addFlashcards: (studySetId: string, flashcards: Flashcard[]) => void;
}

const useStore = create<AppState>()(
  persist(
    (set, get) => ({
      studySets: [],
      addStudySet: (newSet) =>
        set((state) => ({
          studySets: [
            ...state.studySets,
            { ...newSet, id: crypto.randomUUID(), createdAt: Date.now() },
          ],
        })),
      removeStudySet: (id) =>
        set((state) => ({
          studySets: state.studySets.filter((s) => s.id !== id),
          quizzes: state.quizzes.filter((q) => q.studySetId !== id),
          generatedFlashcards: Object.entries(state.generatedFlashcards).reduce((acc, [key, value]) => {
            if (key !== id) {
              acc[key] = value;
            }
            return acc;
          }, {} as { [studySetId: string]: Flashcard[] }),
        })),
      getStudySet: (id) => get().studySets.find((s) => s.id === id),
      
      quizzes: [],
      addQuiz: (newQuiz) => {
        const id = crypto.randomUUID();
        set((state) => ({
          quizzes: [
            ...state.quizzes,
            { ...newQuiz, id, createdAt: Date.now() },
          ],
        }));
        return id;
      },

      quizAttempts: [],
      addQuizAttempt: (newAttempt) => {
        const id = crypto.randomUUID();
        set((state) => ({
          quizAttempts: [
            ...state.quizAttempts,
            { ...newAttempt, id, submittedAt: Date.now() },
          ],
        }));
        return id;
      },
      
      updateFeedback: (attemptId, questionIndex, feedback) =>
        set((state) => ({
          quizAttempts: state.quizAttempts.map((attempt) => {
            if (attempt.id === attemptId) {
              const newFeedback = [...attempt.feedback];
              newFeedback[questionIndex] = feedback;
              return { ...attempt, feedback: newFeedback };
            }
            return attempt;
          }),
        })),

      generatedFlashcards: {},
      addFlashcards: (studySetId, flashcards) =>
        set((state) => ({
          generatedFlashcards: {
            ...state.generatedFlashcards,
            [studySetId]: flashcards,
          },
        })),
    }),
    {
      name: 'certai-prep-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);

// A helper hook to ensure store is mounted on client before usage
export const useAppStore = <T>(selector: (state: AppState) => T) => {
    const state = useStore(selector);
    const [isMounted, setIsMounted] = React.useState(false);

    React.useEffect(() => {
        setIsMounted(true);
    }, []);

    return isMounted ? state : (typeof selector(useStore.getState()) === 'boolean' ? false : undefined);
};
