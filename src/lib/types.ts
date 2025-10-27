export type StudySet = {
  id: string;
  title: string;
  content: string;
  createdAt: number;
  tags?: string[];
  folderId?: string | null;
};

export type SRSData = {
  ease: number; // ease factor
  interval: number; // days
  dueAt: number; // epoch ms
  repetitions: number;
};

export type StudyFolder = {
  id: string;
  name: string;
  parentId?: string | null;
  createdAt: number;
};

export type Flashcard = {
  id?: string;
  studySetId?: string;
  question: string;
  answer: string;
  srs?: SRSData;
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
  mode?: 'practice' | 'exam' | 'review';
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
