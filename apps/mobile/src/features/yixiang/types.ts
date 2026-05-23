import type { Href } from 'expo-router';

export type LiveStatus = 'live' | 'scheduled' | 'replay';

export type LiveFilter = 'all' | LiveStatus;

export type LiveSession = {
  id: string;
  title: string;
  teacher: string;
  subtitle: string;
  timeLabel: string;
  status: LiveStatus;
  audience?: string;
  progress?: number;
  durationLabel?: string;
  h5Url?: string;
  topic: string;
  description: string;
};

export type ContentKind = 'article' | 'video';

export type HealthCategory = 'sleep' | 'diet' | 'exercise';

export type EncyclopediaCategory = 'all' | 'food' | 'habit' | 'season';

export type DiscoveryFeedItem = {
  id: string;
  author: string;
  avatar: string;
  channel: string;
  comments: string;
  description: string;
  favorites: string;
  likes: string;
  primaryAction: string;
  route: Href;
  secondaryAction: string;
  tone: 'food' | 'live' | 'sleep';
  title: string;
};

export type EncyclopediaEntry = {
  id: string;
  category: Exclude<EncyclopediaCategory, 'all'>;
  description: string;
  tag: string;
  title: string;
};

export type HealthContent = {
  id: string;
  title: string;
  summary: string;
  category: HealthCategory;
  kind: ContentKind;
  durationLabel?: string;
  readTimeLabel?: string;
  body: string[];
};

export type QuizOption = {
  id: string;
  label: string;
};

export type QuizQuestion = {
  id: string;
  topic: string;
  index: number;
  total: number;
  prompt: string;
  options: QuizOption[];
  answerId: string;
  explanation: string;
};

export type CourseChapter = {
  id: string;
  duration: string;
  status: 'complete' | 'current' | 'pending';
  title: string;
};

export type LiveMaterial = {
  id: string;
  description: string;
  label: string;
  title: string;
};

export type ChatMessage = {
  id: string;
  author: string;
  host?: boolean;
  message: string;
};

export type ProfileSummary = {
  name: string;
  memberLabel: string;
  streakDays: number;
  reservedCount: number;
  favoriteCount: number;
  quizProgress: number;
};
