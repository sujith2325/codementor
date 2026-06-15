import { allProblemsIndex } from '../data/problems.js';

export const SearchEngine = {
  searchProblems(query) {
    let q = query.toLowerCase().trim();
    if (!q) return allProblemsIndex;
    
    const aliases = {
      bfs: "breadth-first search",
      dfs: "depth-first search",
      dp: "dynamic programming",
      bs: "binary search",
      sw: "sliding window",
      uf: "union find"
    };

    if (aliases[q]) {
      q = aliases[q];
    } else {
      q = q.split(/\s+/).map(word => aliases[word] || word).join(' ');
    }
    
    return allProblemsIndex.filter(prob => {
      return prob.id.toString().includes(q) ||
             prob.title.toLowerCase().includes(q) ||
             prob.pattern.toLowerCase().includes(q) ||
             prob.difficulty.toLowerCase().includes(q);
    });
  },
  
  getProblemByKey(key) {
    return allProblemsIndex.find(p => p.key === key);
  },

  getProblemById(id) {
    const parsedId = parseInt(id);
    return allProblemsIndex.find(p => p.id === parsedId);
  },

  getProblemBySlug(slug) {
    // Slugs are in the format "1-two-sum"
    const match = slug.match(/^(\d+)-/);
    if (!match) return null;
    const id = parseInt(match[1]);
    return this.getProblemById(id);
  },

  getSlugForProblem(prob) {
    if (!prob) return '';
    // Generate URL friendly slug e.g. "1-two-sum"
    const cleanedTitle = prob.title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .trim()
      .replace(/\s+/g, '-');
    return `${prob.id}-${cleanedTitle}`;
  }
};
