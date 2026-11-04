import { analytics } from '../data/mockData';
import { request } from './client';
export const getAnalytics = () => request('/api/analytics', () => analytics);
