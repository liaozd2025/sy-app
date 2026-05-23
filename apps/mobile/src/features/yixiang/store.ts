import type { LiveFilter } from './types';

import { create } from 'zustand';
import { createSelectors } from '@/lib/utils';
import { healthContents, liveSessions, todayQuiz } from './mock-data';

type PrototypeState = {
  activeLiveFilter: LiveFilter;
  favoriteContentIds: string[];
  followedCreatorIds: string[];
  likedFeedIds: string[];
  pointsClaimed: boolean;
  quizAnswers: Record<string, string>;
  reservedSessionIds: string[];
  savedFeedIds: string[];
  answerQuestion: (questionId: string, optionId: string) => void;
  setLiveFilter: (filter: LiveFilter) => void;
  toggleFavorite: (contentId: string) => void;
  toggleFollowCreator: (creatorId: string) => void;
  toggleLikeFeed: (feedId: string) => void;
  togglePoints: () => void;
  toggleReservation: (sessionId: string) => void;
  toggleSaveFeed: (feedId: string) => void;
};

const defaultReservedSessionIds = liveSessions
  .filter(session => session.status === 'scheduled')
  .slice(0, 1)
  .map(session => session.id);

const defaultFavoriteContentIds = healthContents
  .slice(0, 2)
  .map(content => content.id);

const _usePrototypeStore = create<PrototypeState>(set => ({
  activeLiveFilter: 'all',
  favoriteContentIds: defaultFavoriteContentIds,
  followedCreatorIds: ['林静营养师'],
  likedFeedIds: ['sleep-feed'],
  pointsClaimed: false,
  quizAnswers: {},
  reservedSessionIds: defaultReservedSessionIds,
  savedFeedIds: ['sleep-feed'],
  answerQuestion: (questionId, optionId) => {
    set((state) => {
      if (state.quizAnswers[questionId]) {
        return state;
      }

      return {
        quizAnswers: {
          ...state.quizAnswers,
          [questionId]: optionId,
        },
      };
    });
  },
  setLiveFilter: activeLiveFilter => set({ activeLiveFilter }),
  toggleFavorite: (contentId) => {
    set(state => ({
      favoriteContentIds: toggleId(state.favoriteContentIds, contentId),
    }));
  },
  toggleFollowCreator: (creatorId) => {
    set(state => ({
      followedCreatorIds: toggleId(state.followedCreatorIds, creatorId),
    }));
  },
  toggleLikeFeed: (feedId) => {
    set(state => ({
      likedFeedIds: toggleId(state.likedFeedIds, feedId),
    }));
  },
  togglePoints: () => {
    set(state => ({ pointsClaimed: !state.pointsClaimed }));
  },
  toggleReservation: (sessionId) => {
    set(state => ({
      reservedSessionIds: toggleId(state.reservedSessionIds, sessionId),
    }));
  },
  toggleSaveFeed: (feedId) => {
    set(state => ({
      savedFeedIds: toggleId(state.savedFeedIds, feedId),
    }));
  },
}));

function toggleId(ids: string[], id: string) {
  return ids.includes(id)
    ? ids.filter(item => item !== id)
    : [...ids, id];
}

export const usePrototypeStore = createSelectors(_usePrototypeStore);

export const currentQuestionId = todayQuiz.id;
