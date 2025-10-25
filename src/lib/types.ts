export type StudySet = {
  id: string;
  title: string;
  content: string;
  createdAt: number;
};

export type Flashcard = {
  question: string;
  answer: string;
};

export type QuizQuestion = {
  question: string;
  type: string;
  answers: string[];
  correctAnswer: string;
};

export type Quiz = {
  id: string;
  studySetId: string;
  studySetTitle: string;
  questions: QuizQuestion[];
  createdAt: number;
};

export type QuizAttempt = {
  id: string;
  quizId: string;
  answers: (string | string[])[];
  score: number;
  submittedAt: number;
  feedback: (string | null)[];
  isCorrect: boolean[];
};
