import { request } from './client';

export const getAnalytics = (range = '30d') => request(`/api/analytics?range=${range}`);
