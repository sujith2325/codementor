import { sandboxData, allProblemsIndex } from '../data/problems.js';

export function highlightPython(code) {
  let escaped = code
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');

  const rules = [
    { regex: /(\#.*)/g, class: 'hl-comment' },
    { regex: /(".*?"|'.*?')/g, class: 'hl-string' },
    { regex: /\b(class|def|for|in|if|else|elif|return|import|from|and|or|not|as)\b/g, class: 'hl-keyword' },
    { regex: /\b(list|dict|int|str|bool|set|tuple|float)\b/g, class: 'hl-type' },
    { regex: /\b(enumerate|range|len|max|min|print|set)\b/g, class: 'hl-builtin' },
    { regex: /\b(Solution|self|True|False|None)\b/g, class: 'hl-def' },
    { regex: /\b(\d+)\b/g, class: 'hl-number' }
  ];

  rules.forEach(rule => {
    escaped = escaped.replace(rule.regex, (match) => {
      if (match.startsWith('&lt;span') || match.startsWith('<span') || match.endsWith('span>')) {
        return match;
      }
      return `<span class="${rule.class}">${match}</span>`;
    });
  });

  return escaped;
}

export const StoryEngine = {
  getOrSynthesizeProblemData(probKey) {
    if (sandboxData[probKey]) {
      return sandboxData[probKey];
    }
    
    const base = allProblemsIndex.find(p => p.key === probKey);
    if (!base) return null;
    
    const pattern = base.pattern;
    const title = base.title;
    
    let code = `class Solution:\n    def solve(self, input_data: any) -> any:\n        # Dynamic optimal O(N) solution using ${pattern}\n        pass`;
    let trace = [
      { variables: { state: 'Init', idx: 0 }, log: `Initializing optimal scan for ${title}...`, highlightLines: [1, 2] },
      { variables: { state: 'Processing', idx: 1 }, log: `Traversing data structures using ${pattern}. Comparing constraints...`, highlightLines: [3] },
      { variables: { state: 'Complete', result: 'Success' }, log: `Target found! Return optimal value. Solution Accepted.`, highlightLines: [4] }
    ];
    
    if (pattern === 'Binary Search') {
      code = `class Solution:
    def search(self, nums: list[int], target: int) -> int:
        left, right = 0, len(nums) - 1
        while left <= right:
            mid = (left + right) // 2
            if nums[mid] == target:
                return mid
            elif nums[mid] < target:
                left = mid + 1
            else:
                right = mid - 1
        return -1`;
      trace = [
        { variables: { left: 0, right: 9, mid: 4, val: 5 }, log: 'Scanning mid index 4: val = 5. Target is greater. Adjust left pointer.', highlightLines: [3, 4, 5, 7, 8], array: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10], activeIdx: 4, matchedIdx: -1 },
        { variables: { left: 5, right: 9, mid: 7, val: 8 }, log: 'Scanning mid index 7: val = 8. Target found! Returning index 7.', highlightLines: [3, 4, 5, 6], array: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10], activeIdx: 7, matchedIdx: 7 },
        { variables: { left: 5, right: 9, mid: 7, val: 8 }, log: 'Success! Return index 7. Solution Accepted.', highlightLines: [6], array: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10], activeIdx: 7, matchedIdx: 7 }
      ];
    }
    else if (pattern === 'LIFO Stack Operations') {
      code = `class Solution:
    def evaluate(self, s: str) -> bool:
        stack = []
        for char in s:
            if char == '(':
                stack.append(char)
            elif char == ')':
                if not stack: return False
                stack.pop()
        return not stack`;
      trace = [
        { variables: { char: '(', stack: '[]' }, log: 'Encountered \'(\'. Push to stack.', highlightLines: [4, 5], chars: ['(', ')'], activeIdx: 0, stack: ['('] },
        { variables: { char: ')', stack: '[\'(\']' }, log: 'Encountered \')\'. Pop top of stack.', highlightLines: [6, 7, 8], chars: ['(', ')'], activeIdx: 1, stack: [] },
        { variables: { char: 'None', stack: '[]' }, log: 'Stack is empty. Balanced. Return True. Solution Accepted.', highlightLines: [9], chars: ['(', ')'], activeIdx: 1, stack: [] }
      ];
    }
    else if (pattern === 'Sliding Window') {
      code = `class Solution:
    def maxSubArray(self, nums: list[int], k: int) -> int:
        left = 0
        current_sum = 0
        max_sum = 0
        for right, val in enumerate(nums):
            current_sum += val
            if right >= k - 1:
                max_sum = max(max_sum, current_sum)
                current_sum -= nums[left]
                left += 1
        return max_sum`;
      trace = [
        { variables: { left: 0, right: 0, current: 2, max: 2 }, log: 'Expanding sliding window right: val = 2. Current sum: 2.', highlightLines: [6, 7, 8], s: '2, 3, 1, 5', left: 0, right: 0 },
        { variables: { left: 0, right: 1, current: 5, max: 5 }, log: 'Expanding sliding window right: val = 3. Window size met. Max sum: 5.', highlightLines: [6, 7, 8, 9], s: '2, 3, 1, 5', left: 0, right: 1 },
        { variables: { left: 1, right: 2, current: 4, max: 5 }, log: 'Sliding window left: Subtract val at left index 0. Current sum: 4.', highlightLines: [10, 11], s: '2, 3, 1, 5', left: 1, right: 2 }
      ];
    }
    else if (pattern === 'Two Pointers') {
      code = `class Solution:
    def isPalindrome(self, s: str) -> bool:
        left, right = 0, len(s) - 1
        while left < right:
            if s[left] != s[right]:
                return False
            left += 1
            right -= 1
        return True`;
      trace = [
        { variables: { left: 0, right: 2, s_left: 'a', s_right: 'a' }, log: 'Compare left (index 0) and right (index 2). Equal. Move inward.', highlightLines: [3, 4, 6, 7], height: [5, 1, 5], left: 0, right: 2 },
        { variables: { left: 1, right: 1, s_left: 'b', s_right: 'b' }, log: 'Pointers crossed. Equal characters throughout. Return True.', highlightLines: [8], height: [5, 1, 5], left: 1, right: 1 }
      ];
    }
    else if (pattern === 'Breadth-First Search') {
      code = `class Solution:
    def levelOrder(self, root: TreeNode) -> list[list[int]]:
        if not root: return []
        queue = [root]
        result = []
        while queue:
            level = []
            for _ in range(len(queue)):
                node = queue.pop(0)
                level.append(node.val)
                if node.left: queue.append(node.left)
                if node.right: queue.append(node.right)
            result.append(level)
        return result`;
      trace = [
        { variables: { node: 'Root (1)', queue: '[Node(2), Node(3)]' }, log: 'Popped root node (1). Push children (2, 3) to queue.', highlightLines: [8, 9, 10, 11], list: ['Head', '[Root]', 'Tail'], cache: 'Root' },
        { variables: { node: 'Node (2)', queue: '[Node(3)]' }, log: 'Popped level node (2). No children. Queue: [3].', highlightLines: [8, 9], list: ['Head', '[2]', '[3]', 'Tail'], cache: 'Level 1' }
      ];
    }
  
    return {
      id: base.id,
      title: base.title,
      difficulty: base.difficulty,
      pattern: base.pattern,
      companies: base.companies,
      acceptanceRate: base.acceptanceRate,
      analysis: `Given the LeetCode challenge <b>${title}</b>, our objective is to compute the optimal answer under constrained runtime criteria.<br><br>Input limits demand an optimized structure avoiding brute-force comparisons.`,
      strategy: `We employ a high-performance <b>${pattern}</b> approach to traverse the input data structure in linear or logarithmic time.<br><br>This prevents nested loop redundancies and achieves a production-ready scale.`,
      complexity: {
        time: pattern === 'Binary Search' ? 'O(log N)' : 'O(N)',
        space: pattern === 'Two Pointers' ? 'O(1)' : 'O(N)',
        altTime: 'O(N²)',
        altSpace: 'O(1)',
        timePct: pattern === 'Binary Search' ? 8 : 18,
        altTimePct: 85
      },
      code: code,
      explanation: [
        { line: 1, text: `Declare solution class Solution for LeetCode signature matching.` },
        { line: 2, text: `Define entry point method with appropriate typing bounds.` },
        { line: 3, text: `Initialize state variables and memory caches for the ${pattern} execution.` },
        { line: 4, text: `Perform optimal loop traversal over the constraints.` }
      ],
      trace: trace,
      edgeCases: [
        { input: 'empty / null inputs', result: 'Returns base empty fallback value.' },
        { input: 'minimum bounds N = 1', result: 'Processed successfully without loops.' }
      ],
      commonMistakes: [
        { title: 'Infinite recursion / loops', p: 'Ensure that variables, windows or pointers advance monotonically toward exit criteria at each step.' }
      ],
      followUps: [
        { q: `Can you solve this with strict O(1) space?`, a: `If variables are stored in registers or input is sorted, yes, otherwise heap allocations are needed.` }
      ]
    };
  }
};
