import { patternsData } from '../data/patterns.js';

export const PatternEngine = {
  getPatternByKey(key) {
    return patternsData[key];
  },
  
  getAllPatterns() {
    return Object.entries(patternsData).map(([key, val]) => ({ key, ...val }));
  }
};
