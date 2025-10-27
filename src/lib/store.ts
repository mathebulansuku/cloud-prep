import React from 'react';
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { StudySet, Quiz, Flashcard, QuizAttempt, SRSData, QuizQuestion, StudyFolder } from '@/lib/types';

interface AppState {
  studySets: StudySet[];
  addStudySet: (set: Omit<StudySet, 'id' | 'createdAt'>) => void;
  updateStudySet: (id: string, updates: Partial<StudySet>) => void;
  removeStudySet: (id: string) => void;
  getStudySet: (id: string) => StudySet | undefined;

  folders: StudyFolder[];
  addFolder: (name: string, parentId?: string | null) => string;
  renameFolder: (id: string, name: string) => void;
  removeFolder: (id: string) => void; // moves sets to root

  quizzes: Quiz[];
  addQuiz: (quiz: Omit<Quiz, 'id' | 'createdAt'>) => string;
  questionBank: { [studySetId: string]: QuizQuestion[] };
  addToQuestionBank: (studySetId: string, questions: QuizQuestion[]) => void;

  quizAttempts: QuizAttempt[];
  addQuizAttempt: (attempt: Omit<QuizAttempt, 'id' | 'submittedAt'>) => string;
  updateFeedback: (attemptId: string, questionIndex: number, feedback: string) => void;

  generatedFlashcards: { [studySetId: string]: Flashcard[] };
  addFlashcards: (studySetId: string, flashcards: Flashcard[]) => void;
  srs: { [studySetId: string]: { [cardId: string]: SRSData } };
  reviewFlashcard: (studySetId: string, cardId: string, rating: 'again' | 'good' | 'easy') => void;
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
      updateStudySet: (id, updates) =>
        set((state) => ({
          studySets: state.studySets.map((s) => (s.id === id ? { ...s, ...updates } : s)),
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
          srs: Object.entries(state.srs).reduce((acc, [key, value]) => {
            if (key !== id) acc[key] = value;
            return acc;
          }, {} as { [studySetId: string]: { [cardId: string]: SRSData } }),
        })),
      getStudySet: (id) => get().studySets.find((s) => s.id === id),

      folders: [],
      addFolder: (name, parentId = null) => {
        const id = crypto.randomUUID();
        set((state) => ({ folders: [...state.folders, { id, name, parentId, createdAt: Date.now() }] }));
        return id;
      },
      renameFolder: (id, name) => set((state) => ({ folders: state.folders.map(f => f.id === id ? { ...f, name } : f) })),
      removeFolder: (id) => set((state) => ({
        folders: state.folders.filter(f => f.id !== id),
        studySets: state.studySets.map(s => s.folderId === id ? { ...s, folderId: null } : s),
      })),
      
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
      questionBank: {},
      addToQuestionBank: (studySetId, questions) =>
        set((state) => ({
          questionBank: {
            ...state.questionBank,
            [studySetId]: [...(state.questionBank[studySetId] || []), ...questions],
          },
        })),

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
      srs: {},
      addFlashcards: (studySetId, flashcards) =>
        set((state) => {
          const withIds = flashcards.map((fc) => ({
            ...fc,
            id: fc.id || crypto.randomUUID(),
            studySetId,
          }));
          const srsForSet = { ...(state.srs[studySetId] || {}) };
          withIds.forEach((fc) => {
            const cid = fc.id as string;
            if (!srsForSet[cid]) {
              srsForSet[cid] = {
                ease: 2.5,
                interval: 0,
                dueAt: Date.now(),
                repetitions: 0,
              };
            }
          });
          return {
            generatedFlashcards: {
              ...state.generatedFlashcards,
              [studySetId]: withIds,
            },
            srs: { ...state.srs, [studySetId]: srsForSet },
          };
        }),
      reviewFlashcard: (studySetId, cardId, rating) =>
        set((state) => {
          const setSrs = { ...(state.srs[studySetId] || {}) };
          const current = setSrs[cardId] || { ease: 2.5, interval: 0, dueAt: Date.now(), repetitions: 0 };
          // Simplified SM-2 variant
          let ease = current.ease;
          if (rating === 'again') ease = Math.max(1.3, ease - 0.2);
          if (rating === 'good') ease = ease + 0.0;
          if (rating === 'easy') ease = ease + 0.15;
          let repetitions = current.repetitions + 1;
          let interval = 0;
          if (rating === 'again') {
            repetitions = 0;
            interval = 0; // review again today
          } else if (current.repetitions === 0) {
            interval = 1;
          } else if (current.repetitions === 1) {
            interval = 3;
          } else {
            interval = Math.round(current.interval * ease);
          }
          const dueAt = Date.now() + interval * 24 * 60 * 60 * 1000;
          setSrs[cardId] = { ease, interval, dueAt, repetitions };
          return { srs: { ...state.srs, [studySetId]: setSrs } };
        }),
    }),
    {
      name: 'certai-prep-storage',
      storage: createJSONStorage(() => localStorage),
      version: 1,
      migrate: (persistedState: any, _version: number) => {
        // Ensure required containers exist after upgrade
        return {
          questionBank: {},
          srs: {},
          generatedFlashcards: {},
          quizzes: [],
          quizAttempts: [],
          studySets: [],
          folders: [],
          ...persistedState,
        };
      },
    }
  )
);

// A helper hook to ensure store is mounted on client before usage
export const useAppStore = <T>(selector: (state: AppState) => T) => {
  const selected = useStore(selector);
  const [hydrated, setHydrated] = React.useState(false);

  React.useEffect(() => {
    setHydrated(true);
  }, []);

  // Before hydration, return a selection from the initial store state
  // so callers can safely destructure without getting undefined.
  const initialSelection = React.useMemo(() => selector(useStore.getState()), [selector]);

  return hydrated ? selected : initialSelection;
};
