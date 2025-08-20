// stores/sentimentStore.js
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

// Helper to get initial state from localStorage
const getInitialState = () => {
  const stored = localStorage.getItem('sentiment-store');
  return stored ? JSON.parse(stored) : {
    negativeScore: 0,
    severity: 'low',
    shouldShowCounsellor: false,
    isSessionBlocked: false,
    lastReset: Date.now()
  };
};

export const useSentimentStore = create(
  persist(
    (set, get) => ({
      // Initial state
      negativeScore: 0,
      severity: 'low',
      shouldShowCounsellor: false,
      isSessionBlocked: false,
      lastReset: Date.now(),

      // Add sentiment score and check conditions
      addSentiment: (sentiment, score) => {
        if (sentiment === 'negative') {
          const currentState = get();
          const newScore = currentState.negativeScore + score;
          let newSeverity = 'low';
          let shouldShowCounsellor = false;
          let isSessionBlocked = false;

          if (newScore >= 5) {
            newSeverity = 'high';
            shouldShowCounsellor = true;
            isSessionBlocked = true;
          } else if (newScore >= 3) {
            newSeverity = 'medium';
          }

          set({
            negativeScore: newScore,
            severity: newSeverity,
            shouldShowCounsellor,
            isSessionBlocked
          });

          return { severity: newSeverity, isSessionBlocked, shouldShowCounsellor };
        }
        return null;
      },

      // Reset sentiment tracking (on logout)
      resetSentiment: () => {
        set({
          negativeScore: 0,
          severity: 'low',
          shouldShowCounsellor: false,
          isSessionBlocked: false,
          lastReset: Date.now()
        });
      },

      // Get current state
      getStatus: () => {
        const state = get();
        return {
          negativeScore: state.negativeScore,
          severity: state.severity,
          shouldShowCounsellor: state.shouldShowCounsellor,
          isSessionBlocked: state.isSessionBlocked,
          lastReset: state.lastReset
        };
      },

      // Force show counsellor (for testing)
      forceShowCounsellor: () => {
        set({
          negativeScore: 5,
          severity: 'high',
          shouldShowCounsellor: true,
          isSessionBlocked: true
        });
      },

      // Clear counsellor warning but keep tracking
      acknowledgeCounsellor: () => {
        set({
          shouldShowCounsellor: false,
          isSessionBlocked: false
        });
      }
    }),
    {
      name: 'sentiment-store',
      storage: createJSONStorage(() => localStorage),
    }
  )
);