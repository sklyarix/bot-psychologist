import type { DaySection } from '../components/AiCard/AiAnswer.tsx';

export type JobState = 'queued' | 'active' | 'completed' | 'failed';

export interface IUser {
  id: string;
  telegramId: string;
  username?: string | null;
  firstName: string;
  lastName?: string | null;
  photoUrl?: string | null;
  language: string;
  isPremium: boolean;
  lastActive: string; // ISO Date
  createdAt: string;
  updatedAt: string;

  aiGoals?: IAiGoal[];
  aiQuestionAnswers?: IAiQA[];
}

export interface IJob {
  id: string;
  name: string;
  state: JobState;
  errorLog?: string | null;
  createdAt: string;
  updatedAt: string;

  aiGoalId: string;
  aiGoal?: IAiGoal;
  aiQuestionAnswers?: IAiQA[];
}

export interface IAiGoal {
  id: string;
  title: string;
  description?: DaySection[] | null;
  status: JobState;
  createdAt: string;
  finishedAt?: string | null;
  updatedAt: string;

  userId?: string | null;
  user?: IUser | null;

  job?: IJob | null;
}

export interface IAiQA {
  id: string;
  question: string;
  answer: string;
  status: JobState;
  createdAt: string;
  updatedAt: string;

  userId?: string | null;
  user?: IUser | null;

  jobId?: string | null;
  job?: IJob | null;
}
