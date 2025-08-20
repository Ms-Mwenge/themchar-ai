// utils/sentimentTracker.js
import { useSentimentStore } from '../stores/sentimentStore';

export const processMessageSentiment = (message) => {
  if (message.sentiment === 'negative') {
    const sentimentStore = useSentimentStore.getState();
    const result = sentimentStore.addSentiment(message.sentiment, message.sentimentScore);
    
    return result;
  }
  return null;
};

export const shouldBlockSession = () => {
  return useSentimentStore.getState().isSessionBlocked;
};

export const shouldShowCounsellor = () => {
  return useSentimentStore.getState().shouldShowCounsellor;
};

export const getSentimentStatus = () => {
  return useSentimentStore.getState().getStatus();
};

export const resetSentimentTracking = () => {
  useSentimentStore.getState().resetSentiment();
};