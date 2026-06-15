import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from '@studio-freight/lenis';

// Register ScrollTrigger
gsap.registerPlugin(ScrollTrigger);

// Respect reduced motion accessibility setting
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const cursorDot = document.getElementById('custom-cursor');
const cursorFollower = document.getElementById('custom-cursor-follower');

// ==========================================
// 1. INITIALIZE LENIS SMOOTH SCROLL
// ==========================================
let lenis;
if (!prefersReducedMotion) {
  lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    direction: 'vertical',
    smooth: true,
    mouseMultiplier: 1,
  });

  lenis.on('scroll', ScrollTrigger.update);

  gsap.ticker.add((time) => {
    lenis.raf(time * 1000);
  });
  gsap.ticker.lagSmoothing(0);
}

// Header scrolled styling
const header = document.getElementById('header');
window.addEventListener('scroll', () => {
  if (window.scrollY > 40) {
    header.classList.add('scrolled');
  } else {
    header.classList.remove('scrolled');
  }
});

// Active nav indicator pill slide
const navContainer = document.querySelector('.nav-links-container');
const navLinks = document.querySelectorAll('.nav-link');
const navActivePill = document.getElementById('nav-active-pill');

if (navContainer && navActivePill) {
  navLinks.forEach(link => {
    link.addEventListener('mouseenter', () => {
      const linkRect = link.getBoundingClientRect();
      const containerRect = navContainer.getBoundingClientRect();
      gsap.to(navActivePill, {
        x: linkRect.left - containerRect.left,
        width: linkRect.width,
        opacity: 1,
        duration: 0.3,
        ease: 'power2.out'
      });
    });
  });

  navContainer.addEventListener('mouseleave', () => {
    gsap.to(navActivePill, {
      opacity: 0,
      duration: 0.3,
      ease: 'power2.out'
    });
  });
}

// ==========================================
// 2. HELPER: PYTHON SYNTAX HIGHLIGHTING
// ==========================================
function highlightPython(code) {
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

// ==========================================
// 3. HERO AUTOMATED STREAM SOLVER MOCKUP
// ==========================================
const heroStreamContainer = document.getElementById('hero-console-stream');
const heroTwoSumOutput = `[ANALYZING INPUTS]
Input: nums = [2, 7, 11, 15], target = 9
Constraints: N <= 10^4, O(n) required.

[PATTERN DETECTED]
Complement lookup mapping using a Hash Table.

[GENERATING SOLUTION]
class Solution:
    def twoSum(self, nums: list[int], target: int) -> list[int]:
        seen = {}
        for i, num in enumerate(nums):
            need = target - num
            if need in seen:
                return [seen[need], i]
            seen[num] = i
        return []

[RUNNING STATE DRY RUN]
| Step | val | need | seen before check | Action |
|------|-----|------|-------------------|--------|
| 1    | 2   | 7    | {}                | Store 2:0 |
| 2    | 7   | 2    | {2: 0}            | Found 2! Return [0, 1] |

[VERIFICATION SUCCESSFUL]
Status: Accepted ✓`;

const streamHeroConsole = () => {
  if (!heroStreamContainer) return;
  let index = 0;
  const charsPerTick = 12; // super fast typing

  function tick() {
    if (index < heroTwoSumOutput.length) {
      index += charsPerTick;
      const sub = heroTwoSumOutput.substring(0, index);
      
      // Highlight inline python code inside the stream
      let html = sub
        .replace(/\n/g, '<br>')
        .replace(/\[(.*?)\]/g, '<span class="lbl-cyan">[$1]</span>');
        
      if (html.includes('class Solution:')) {
        const parts = html.split('class Solution:');
        const before = parts[0];
        const codeAndAfter = 'class Solution:' + parts[1];
        
        if (codeAndAfter.includes('[RUNNING STATE')) {
          const subparts = codeAndAfter.split('[RUNNING STATE');
          const code = subparts[0];
          const after = '[RUNNING STATE' + subparts[1];
          html = before + highlightPython(code.replace(/<br>/g, '\n')).replace(/\n/g, '<br>') + after;
        } else {
          html = before + highlightPython(codeAndAfter.replace(/<br>/g, '\n')).replace(/\n/g, '<br>');
        }
      }

      // Add glow status for checkmark
      if (html.includes('Accepted ✓')) {
        html = html.replace('Accepted ✓', '<span class="status-success" style="font-weight:800; font-size:14px; text-shadow:0 0 10px rgba(34,197,94,0.4)">Accepted ✓</span>');
      }

      heroStreamContainer.innerHTML = html;
      heroStreamContainer.scrollTop = heroStreamContainer.scrollHeight;
      setTimeout(tick, 10);
    }
  }

  tick();
};

window.addEventListener('load', () => {
  setTimeout(streamHeroConsole, 800);
});

// ==========================================
// 4. SECTION 2: THE PROBLEM (SCROLLYTELLING TEXT REVEALS)
// ==========================================
if (!prefersReducedMotion) {
  const problemContainer = document.querySelector('.problem-scroll-container');
  const panelMemorize = document.querySelector('.panel-memorize');
  const panelPatterns = document.querySelector('.panel-patterns');

  // Pin section 2 during vertical scroll
  ScrollTrigger.create({
    trigger: '#problem-sec',
    start: 'top top',
    end: '+=200%',
    pin: true,
    scrub: 1,
    invalidateOnRefresh: true,
  });

  // Cross-fade memorize panel to pattern panel
  gsap.timeline({
    scrollTrigger: {
      trigger: '#problem-sec',
      start: 'top top',
      end: '+=150%',
      scrub: true,
    }
  })
  .to(panelMemorize, { opacity: 0, yPercent: -15, ease: 'none' })
  .fromTo(panelPatterns, 
    { opacity: 0, yPercent: 15 },
    { opacity: 1, yPercent: 0, ease: 'none' }
  );
}

// ==========================================
// 5. SECTION 3: AI REASONING TIMELINE PATH TRACING
// ==========================================
const scrollPath = document.getElementById('scroll-path');
const timelineNodes = document.querySelectorAll('.timeline-node');

if (scrollPath) {
  const timelineSec = document.getElementById('timeline-sec');

  const updateScrollPathHeight = () => {
    const sectionHeight = timelineSec.clientHeight;
    scrollPath.setAttribute('d', `M 2 0 L 2 ${sectionHeight - 140}`);
    
    const pathLength = scrollPath.getTotalLength();
    scrollPath.style.strokeDasharray = pathLength;
    scrollPath.style.strokeDashoffset = pathLength;
    
    gsap.to(scrollPath, {
      strokeDashoffset: 0,
      ease: 'none',
      scrollTrigger: {
        trigger: timelineSec,
        start: 'top 30%',
        end: 'bottom 80%',
        scrub: true,
        invalidateOnRefresh: true
      }
    });
  };

  window.addEventListener('load', updateScrollPathHeight);
  window.addEventListener('resize', updateScrollPathHeight);
  setTimeout(updateScrollPathHeight, 150);

  // Timeline node highlights
  timelineNodes.forEach(node => {
    gsap.to(node, {
      scrollTrigger: {
        trigger: node,
        start: 'top 60%',
        end: 'bottom 40%',
        toggleClass: { targets: node, className: 'highlighted' }
      }
    });
  });
}

// ==========================================
// 6. SECTION 4: INTERACTIVE SOLVER SANDBOX
// ==========================================
const sandboxData = {
  'two-sum': {
    id: 1,
    title: 'Two Sum',
    difficulty: 'Easy',
    pattern: 'Hash Map Complement Lookup',
    companies: ['Amazon', 'Google', 'Meta', 'Netflix', 'Microsoft'],
    acceptanceRate: '53%',
    analysis: `Given an array of integers <b>nums</b> and an integer <b>target</b>, return indices of the two numbers such that they add up to target.<br><br>You may assume that each input would have exactly one solution, and you may not use the same element twice.`,
    strategy: `Instead of comparing each pair of numbers which takes O(N²) brute-force time, we utilize a Hash Map (dictionary) to perform complement lookups in O(1) time.<br><br>As we traverse the array, we calculate the "need" (target - current value) and check if it has already been seen. If so, we have found our match!`,
    complexity: {
      time: 'O(N)',
      space: 'O(N)',
      altTime: 'O(N²)',
      altSpace: 'O(1)',
      timePct: 15,
      altTimePct: 90
    },
    code: `class Solution:
    def twoSum(self, nums: list[int], target: int) -> list[int]:
        seen = {}
        for i, num in enumerate(nums):
            need = target - num
            if need in seen:
                return [seen[need], i]
            seen[num] = i
        return []`,
    explanation: [
      { line: 1, text: "Declare class Solution following the LeetCode template structure." },
      { line: 2, text: "Define method twoSum taking integer list 'nums' and target sum integer, returning a pair of index integers." },
      { line: 3, text: "Initialize an empty dictionary 'seen' to store value-to-index mappings for constant-time lookup." },
      { line: 4, text: "Iterate through the array, using enumerate to retrieve both the current index 'i' and the element value 'num'." },
      { line: 5, text: "Compute 'need', which is the required complement value (target - num) needed to satisfy the sum." },
      { line: 6, text: "Check if this complement ('need') has been seen before (already stored in the 'seen' map keys)." },
      { line: 7, text: "If found, return the index of the complement from the map seen[need] and the current index 'i' as a list." },
      { line: 8, text: "If complement is not seen, record the current number and its index in the 'seen' dictionary." },
      { line: 9, text: "Return an empty list if no pair matches (although constraints guarantee a solution)." }
    ],
    trace: [
      { variables: { i: 0, num: 2, need: 7, seen: '{}' }, log: 'Scanning index 0: val=2. Need complement target - val = 7. Not in seen map. Storing {2: 0}.', highlightLines: [4, 5, 6, 8], array: [2, 7, 11, 15], activeIdx: 0, matchedIdx: -1 },
      { variables: { i: 1, num: 7, need: 2, seen: '{2: 0}' }, log: 'Scanning index 1: val=7. Need complement target - val = 2. Complement 2 is in seen map at index 0!', highlightLines: [4, 5, 6, 7], array: [2, 7, 11, 15], activeIdx: 1, matchedIdx: 0 },
      { variables: { i: 1, num: 7, need: 2, seen: '{2: 0}' }, log: 'Success! Returning indices [0, 1]. Solution Accepted.', highlightLines: [7], array: [2, 7, 11, 15], activeIdx: 1, matchedIdx: 0 }
    ],
    edgeCases: [
      { input: 'nums = [3,3], target = 6', result: 'Returns [0,1]. Handled successfully.' },
      { input: 'nums = [-3,4,3,90], target = 0', result: 'Returns [0,2]. Negatives handled.' },
      { input: 'nums = [2,7], target = 9', result: 'Returns [0,1]. Base minimum handled.' }
    ],
    commonMistakes: [
      { title: 'Reusing the same element', p: 'Ensure you check if the complement exists in the map BEFORE adding the current element. Otherwise, a query like target=6 and nums=[3] would incorrectly match 3 with itself.' },
      { title: 'Nested loop O(N²) brute-force', p: 'Avoid double-loop comparisons as they fail the performance time limit on arrays of size N = 10⁴.' }
    ],
    followUps: [
      { q: 'Can you solve this in O(1) space if the input is sorted?', a: 'Yes. If sorted, we can use the Two Pointers technique (one at left, one at right) moving inward based on the current sum, resulting in O(N) time and O(1) space.' }
    ]
  },
  'valid-parentheses': {
    id: 20,
    title: 'Valid Parentheses',
    difficulty: 'Easy',
    pattern: 'LIFO Stack Operations',
    companies: ['Microsoft', 'Amazon', 'Apple', 'Uber'],
    acceptanceRate: '41%',
    analysis: `Given a string <b>s</b> containing just the characters '(', ')', '{', '}', '[' and ']', determine if the input string is valid.<br><br>An input string is valid if brackets close in the correct order and are of the matching types.`,
    strategy: `We traverse the string character by character. We use a Stack (LIFO) to keep track of opening brackets.<br><br>When a closing bracket is found, it must match the bracket type on top of the stack (which is popped). If it does not match, or the stack is empty, it is invalid.`,
    complexity: {
      time: 'O(N)',
      space: 'O(N)',
      altTime: 'O(N²)',
      altSpace: 'O(1)',
      timePct: 15,
      altTimePct: 80
    },
    code: `class Solution:
    def isValid(self, s: str) -> bool:
        stack = []
        mapping = {")": "(", "}": "{", "]": "["}
        for char in s:
            if char in mapping:
                top = stack.pop() if stack else '#'
                if mapping[char] != top:
                    return False
            else:
                stack.append(char)
        return not stack`,
    explanation: [
      { line: 1, text: "Declare class Solution following the LeetCode template structure." },
      { line: 2, text: "Defines method isValid taking string 's' and returning a boolean." },
      { line: 3, text: "Initializes an empty list 'stack' to store opening brackets." },
      { line: 4, text: "Creates a mapping dictionary where keys are closing brackets and values are opening ones." },
      { line: 5, text: "Iterates through each character 'char' in string 's'." },
      { line: 6, text: "Checks if 'char' is a closing bracket (exists in mapping keys)." },
      { line: 7, text: "Pops the top item if stack is not empty, otherwise assigns dummy '#' char." },
      { line: 8, text: "Checks if the popped character matches the expected opening character." },
      { line: 9, text: "If it doesn't match, returns False immediately." },
      { line: 10, text: "If it's an opening bracket, appends it to the stack." },
      { line: 11, text: "Returns True if stack is empty (all closed), False otherwise." }
    ],
    trace: [
      { variables: { char: '(', stack: '[]' }, log: 'Scanning \'(\': Opening bracket. Push to stack.', highlightLines: [5, 10], chars: ['(', '[', ']', ')'], activeIdx: 0, stack: ['('] },
      { variables: { char: '[', stack: '[\'(\']' }, log: 'Scanning \'[\': Opening bracket. Push to stack.', highlightLines: [5, 10], chars: ['(', '[', ']', ')'], activeIdx: 1, stack: ['(', '['] },
      { variables: { char: ']', stack: '[\'(\', \'[\']' }, log: 'Scanning \']\': Closing bracket. Pop top of stack (\'[\'). Matches mapping[\']\'].', highlightLines: [5, 6, 7, 8], chars: ['(', '[', ']', ')'], activeIdx: 2, stack: ['('] },
      { variables: { char: ')', stack: '[\'(\']' }, log: 'Scanning \')\': Closing bracket. Pop top of stack (\'(\'). Matches mapping[\')\'].', highlightLines: [5, 6, 7, 8], chars: ['(', '[', ']', ')'], activeIdx: 3, stack: [] },
      { variables: { char: 'None', stack: '[]' }, log: 'End of string. Stack is empty. Return True. Solution Accepted.', highlightLines: [11], chars: ['(', '[', ']', ')'], activeIdx: 3, stack: [] }
    ],
    edgeCases: [
      { input: 's = "]"', result: 'Returns False. Stack pop on empty returns mismatch.' },
      { input: 's = "((("', result: 'Returns False. Stack is not empty at end.' },
      { input: 's = "()[]{}"', result: 'Returns True. Standard valid nesting.' }
    ],
    commonMistakes: [
      { title: 'Popping from empty stack', p: 'Ensure you check if the stack is empty before popping, otherwise it throws an IndexError.' },
      { title: 'Not checking stack empty at end', p: 'Forgetting to check if stack is empty at the end. Strings like "(((" will incorrectly return True if not verified.' }
    ],
    followUps: [
      { q: 'Can you solve this with O(1) space if only one type of parentheses exists (e.g. only "(" and ")")?', a: 'Yes! We can just keep a counter. Increment on "(" and decrement on ")". If counter ever goes negative, return False. At the end, return counter == 0. This uses O(1) space.' }
    ]
  },
  'longest-substring': {
    id: 3,
    title: 'Longest Substring',
    difficulty: 'Medium',
    pattern: 'Sliding Window',
    companies: ['Google', 'Amazon', 'Meta', 'Adobe'],
    acceptanceRate: '35%',
    analysis: `Given a string <b>s</b>, find the length of the longest substring without repeating characters.`,
    strategy: `We use the Sliding Window technique with two pointers (left and right). We slide the right pointer to expand the window and use a hash map to store characters and their latest indices.<br><br>When a duplicate character is found in our current window, we shift the left pointer to the right of the duplicate's last position.`,
    complexity: {
      time: 'O(N)',
      space: 'O(min(A, N))',
      altTime: 'O(N²)',
      altSpace: 'O(1)',
      timePct: 20,
      altTimePct: 85
    },
    code: `class Solution:
    def lengthOfLongestSubstring(self, s: str) -> int:
        char_map = {}
        left = 0
        max_length = 0
        for right, char in enumerate(s):
            if char in char_map and char_map[char] >= left:
                left = char_map[char] + 1
            char_map[char] = right
            max_length = max(max_length, right - left + 1)
        return max_length`,
    explanation: [
      { line: 1, text: "Declare class Solution following the LeetCode template structure." },
      { line: 2, text: "Defines method lengthOfLongestSubstring taking string 's' and returning length." },
      { line: 3, text: "Initializes 'char_map' dictionary to store characters and their latest indices." },
      { line: 4, text: "Sets the 'left' boundary pointer of the sliding window to 0." },
      { line: 5, text: "Initializes 'max_length' result tracker to 0." },
      { line: 6, text: "Iterates through the string using 'right' pointer and character 'char'." },
      { line: 7, text: "Checks if character has been seen and falls within the current window boundary." },
      { line: 8, text: "If seen inside window, shifts 'left' to the index after the duplicate's last position." },
      { line: 9, text: "Updates the character's mapped index to the current 'right' position." },
      { line: 10, text: "Calculates current window size (right - left + 1) and updates 'max_length'." },
      { line: 11, text: "Returns the calculated maximum substring length." }
    ],
    trace: [
      { variables: { right: 0, left: 0, char: 'a', max_len: 1, map: '{}' }, log: 'Scanning \'a\' at index 0. First time seen. Window length: 1. Max: 1.', highlightLines: [6, 7, 9, 10], s: 'abcabcbb', left: 0, right: 0 },
      { variables: { right: 1, left: 0, char: 'b', max_len: 2, map: '{\'a\': 0}' }, log: 'Scanning \'b\' at index 1. First time seen. Window length: 2. Max: 2.', highlightLines: [6, 7, 9, 10], s: 'abcabcbb', left: 0, right: 1 },
      { variables: { right: 2, left: 0, char: 'c', max_len: 3, map: '{\'a\': 0, \'b\': 1}' }, log: 'Scanning \'c\' at index 2. First time seen. Window length: 3. Max: 3.', highlightLines: [6, 7, 9, 10], s: 'abcabcbb', left: 0, right: 2 },
      { variables: { right: 3, left: 1, char: 'a', max_len: 3, map: '{\'a\': 0, \'b\': 1, \'c\': 2}' }, log: 'Duplicate \'a\' found at index 0. Shift left pointer to 1. Window: "bca".', highlightLines: [6, 7, 8, 9, 10], s: 'abcabcbb', left: 1, right: 3 },
      { variables: { right: 4, left: 2, char: 'b', max_len: 3, map: '{\'a\': 3, \'b\': 1, \'c\': 2}' }, log: 'Duplicate \'b\' found at index 1. Shift left pointer to 2. Window: "cab".', highlightLines: [6, 7, 8, 9, 10], s: 'abcabcbb', left: 2, right: 4 }
    ],
    edgeCases: [
      { input: 's = ""', result: 'Returns 0. Empty string handled.' },
      { input: 's = "bbbbb"', result: 'Returns 1. Constant updates to left pointer.' },
      { input: 's = "pwwkew"', result: 'Returns 3 ("wke" substring).' }
    ],
    commonMistakes: [
      { title: 'Incorrect duplicate check range', p: 'Ensure you check if the character index in map is >= left. Otherwise, you might shift left backwards for duplicate characters that lie outside the current window!' }
    ],
    followUps: [
      { q: 'Can you solve this with a boolean array or set instead of a map?', a: 'Yes. By shifting the left pointer incrementally in a while loop rather than jumping, we can use a set to track window contents. It runs in O(2N) time which simplifies to O(N).' }
    ]
  },
  'container-water': {
    id: 11,
    title: 'Container With Water',
    difficulty: 'Medium',
    pattern: 'Two Pointers',
    companies: ['Amazon', 'Google', 'Meta', 'Bloomberg'],
    acceptanceRate: '54%',
    analysis: `You are given an integer array <b>height</b> of length n. Find two lines that together with the x-axis form a container, such that the container contains the most water.<br><br>Return the maximum amount of water a container can store.`,
    strategy: `We start with two pointers at the ends of the array. The width of our container is the index distance. The height is the minimum of the two lines.<br><br>To maximize area, we incrementally move the pointer pointing to the shorter line inward. Shifting the taller line inward cannot possibly increase the area, since height is limited by the shorter line.`,
    complexity: {
      time: 'O(N)',
      space: 'O(1)',
      altTime: 'O(N²)',
      altSpace: 'O(1)',
      timePct: 15,
      altTimePct: 90
    },
    code: `class Solution:
    def maxArea(self, height: list[int]) -> int:
        left = 0
        right = len(height) - 1
        max_water = 0
        while left < right:
            width = right - left
            current_height = min(height[left], height[right])
            max_water = max(max_water, width * current_height)
            if height[left] < height[right]:
                left += 1
            else:
                right -= 1
        return max_water`,
    explanation: [
      { line: 1, text: "Declare class Solution following the LeetCode template structure." },
      { line: 2, text: "Defines method maxArea accepting height list and returning max area integer." },
      { line: 3, text: "Initializes left pointer at index 0." },
      { line: 4, text: "Initializes right pointer at the end index (len(height) - 1)." },
      { line: 5, text: "Initializes max_water result variable to 0." },
      { line: 6, text: "Enters loop running while left pointer is less than right." },
      { line: 7, text: "Calculates the container width as the index distance (right - left)." },
      { line: 8, text: "Obtains the limiting height of the container using min()." },
      { line: 9, text: "Computes area (width * height) and updates max_water if it is larger." },
      { line: 10, text: "Checks if the left boundary is shorter than the right boundary." },
      { line: 11, text: "If left is shorter, moves left pointer inward (left += 1) to seek a taller line." },
      { line: 12, text: "Otherwise, moves right pointer inward (right -= 1)." },
      { line: 13, text: "Returns the maximum water container area calculated." }
    ],
    trace: [
      { variables: { left: 0, right: 8, area: 8, max_water: 8 }, log: 'Left=0, Right=8. Width: 8. Height limit: min(1,7)=1. Area = 8. H[0] < H[8] -> increment left.', highlightLines: [6, 7, 8, 9, 10, 11], height: [1, 8, 6, 2, 5, 4, 8, 3, 7], left: 0, right: 8 },
      { variables: { left: 1, right: 8, area: 49, max_water: 49 }, log: 'Left=1, Right=8. Width: 7. Height limit: min(8,7)=7. Area = 49. H[1] >= H[8] -> decrement right.', highlightLines: [6, 7, 8, 9, 10, 12], height: [1, 8, 6, 2, 5, 4, 8, 3, 7], left: 1, right: 8 },
      { variables: { left: 1, right: 7, area: 18, max_water: 49 }, log: 'Left=1, Right=7. Width: 6. Height limit: min(8,3)=3. Area = 18. H[1] >= H[7] -> decrement right.', highlightLines: [6, 7, 8, 9, 10, 12], height: [1, 8, 6, 2, 5, 4, 8, 3, 7], left: 1, right: 7 },
      { variables: { left: 1, right: 6, area: 40, max_water: 49 }, log: 'Left=1, Right=6. Width: 5. Height limit: min(8,8)=8. Area = 40. H[1] >= H[6] -> decrement right.', highlightLines: [6, 7, 8, 9, 10, 12], height: [1, 8, 6, 2, 5, 4, 8, 3, 7], left: 1, right: 6 }
    ],
    edgeCases: [
      { input: 'height = [1,1]', result: 'Returns 1. Smallest size handled.' },
      { input: 'height = [1000, 1000]', result: 'Returns 1000. Big values handled.' }
    ],
    commonMistakes: [
      { title: 'Incorrect pointer increment condition', p: 'Moving the pointer that points to the larger line instead of the smaller one. Shifting the taller pointer inward can only decrease the width while maintaining or decreasing the height limit, so it can never result in a larger container.' }
    ],
    followUps: [
      { q: 'Does this greedy approach guarantee the globally optimal solution?', a: 'Yes. Because moving the pointer of the shorter line inward is the only way to potentially find a taller boundary that offsets the width loss. We mathematically prove that we prune no valid states.' }
    ]
  },
  'lru-cache': {
    id: 146,
    title: 'LRU Cache',
    difficulty: 'Hard',
    pattern: 'Linked List + Hash Map',
    companies: ['Amazon', 'Google', 'Microsoft', 'Apple', 'Salesforce'],
    acceptanceRate: '43%',
    analysis: `Design a data structure that follows the constraints of a Least Recently Used (LRU) cache.<br><br>Implement the LRUCache class with get(key) and put(key, value) in O(1) time complexity.`,
    strategy: `We combine a Doubly Linked List and a Hash Map. The Doubly Linked List maintains the eviction queue order (Head is Least Recently Used, Tail is Most Recently Used).<br><br>The Hash Map maps keys to Linked List Node pointers, enabling O(1) pointer updates and evictions.`,
    complexity: {
      time: 'O(1)',
      space: 'O(N)',
      altTime: 'O(N) search',
      altSpace: 'O(N)',
      timePct: 10,
      altTimePct: 75
    },
    code: `class Node:
    def __init__(self, key: int, val: int):
        self.key = key
        self.val = val
        self.prev = None
        self.next = None

class LRUCache:
    def __init__(self, capacity: int):
        self.cap = capacity
        self.cache = {}
        self.head = Node(0, 0)
        self.tail = Node(0, 0)
        self.head.next = self.tail
        self.tail.prev = self.head

    def remove(self, node: Node):
        p, n = node.prev, node.next
        p.next, n.prev = n, p

    def insert(self, node: Node):
        p, n = self.tail.prev, self.tail
        p.next = n.prev = node
        node.prev, node.next = p, n

    def get(self, key: int) -> int:
        if key in self.cache:
            node = self.cache[key]
            self.remove(node)
            self.insert(node)
            return node.val
        return -1

    def put(self, key: int, value: int) -> None:
        if key in self.cache:
            self.remove(self.cache[key])
        node = Node(key, value)
        self.cache[key] = node
        self.insert(node)
        if len(self.cache) > self.cap:
            lru = self.head.next
            self.remove(lru)
            del self.cache[lru.key]`,
    explanation: [
      { line: 1, text: "Define helper class Node containing key, value, and previous/next pointers." },
      { line: 8, text: "Constructor initializes capacity limit, cache map, and head/tail sentinel boundaries." },
      { line: 17, text: "helper remove method detaches a node from its adjacent list neighbors." },
      { line: 21, text: "helper insert method inserts a node at the tail position (most recently used)." },
      { line: 26, text: "get method checks map. If hit, moves node to MRU tail and returns val." },
      { line: 34, text: "put method updates key by removing old node, inserts new node at tail, and evicts least recently used head.next node if capacity boundary is crossed." }
    ],
    trace: [
      { variables: { op: 'put(1, 1)', capacity: 2 }, log: 'Cache put(1, 1). Key 1 inserted. Cache size: 1/2.', highlightLines: [34, 38, 39], list: ['Head', '[1:1]', 'Tail'], cache: '\'1\': Node' },
      { variables: { op: 'put(2, 2)', capacity: 2 }, log: 'Cache put(2, 2). Key 2 inserted at tail. Cache size: 2/2.', highlightLines: [34, 38, 39], list: ['Head', '[1:1]', '[2:2]', 'Tail'], cache: '\'1\': Node, \'2\': Node' },
      { variables: { op: 'get(1)', output: 1 }, log: 'Cache get(1). Hit! Value 1 returned. Move Key 1 to tail (MRU).', highlightLines: [26, 27, 28, 29, 30], list: ['Head', '[2:2]', '[1:1]', 'Tail'], cache: '\'1\': Node, \'2\': Node' },
      { variables: { op: 'put(3, 3)', capacity: 2 }, log: 'Cache put(3, 3). Capacity exceeded. Evict Key 2 from head. Key 3 inserted at tail.', highlightLines: [34, 38, 39, 40, 41, 42, 43], list: ['Head', '[1:1]', '[3:3]', 'Tail'], cache: '\'1\': Node, \'3\': Node' }
    ],
    edgeCases: [
      { input: 'capacity = 1', result: 'Eviction triggers on every put operation.' },
      { input: 'put duplicate key', result: 'Overwrites existing value and marks key as MRU.' },
      { input: 'get non-existent key', result: 'Returns -1 without modifying list order.' }
    ],
    commonMistakes: [
      { title: 'Incorrect doubly list pointer binding', p: 'Ensure that during insert and remove operations, you link both the prev and next pointers of both neighboring nodes. Missing one pointer breaks the traversal list.' },
      { title: 'Forgetting to delete from cache map', p: 'When evicting the LRU node, you must delete the key from the dictionary in addition to removing it from the doubly linked list. Otherwise, cache map lookup hits dead nodes.' }
    ],
    followUps: [
      { q: 'Why is a singly linked list insufficient?', a: 'In a singly linked list, removing a node requires searching the list from the head to find its predecessor node, which would violate the O(1) time complexity requirement.' }
    ]
  }
};

let sandboxActiveProblem = 'two-sum';
let sandboxActiveTab = 'analysis'; // maintained for backward compatibility inside highlights
let sandboxTypingTimeout = null;
let compiledStateMap = {}; // Tracks compiled state per problem for localstorage resume
let traceActiveStep = 0;
let tracePlayInterval = null;
let isAiReadingMode = false;

const sandboxStreamBody = document.getElementById('sandbox-stream-body');
const sandboxRunBtn = document.querySelector('.btn-run-solve');
const sandboxStatusLabel = document.querySelector('.console-status-label');
const btnCopySandbox = document.getElementById('btn-copy-code');
const btnToggleMode = document.getElementById('btn-toggle-mode');
const consoleProgressBar = document.getElementById('console-progress-bar');
const consoleContextBar = document.getElementById('console-context-bar');
const contextProblemInfo = document.getElementById('context-problem-info');
const contextSectionInfo = document.getElementById('context-section-info');
const consoleToc = document.getElementById('console-toc');

// Dynamic 1,500+ Problems Index
const allProblemsIndex = [];
const sandboxProblemsList = document.getElementById('sandbox-problems-list');
const problemSearchInput = document.getElementById('problem-search');

function initProblemsIndex() {
  // 1. Core showcase problems
  allProblemsIndex.push(
    { key: 'two-sum', id: 1, title: 'Two Sum', difficulty: 'Easy', pattern: 'Hash Map Complement Lookup', companies: ['Amazon', 'Google', 'Meta'], acceptanceRate: '53%', desc: 'Find indices matching target sum.' },
    { key: 'valid-parentheses', id: 20, title: 'Valid Parentheses', difficulty: 'Easy', pattern: 'LIFO Stack Operations', companies: ['Microsoft', 'Amazon', 'Apple'], acceptanceRate: '41%', desc: 'Validate bracket nesting with stack.' },
    { key: 'longest-substring', id: 3, title: 'Longest Substring Without Repeating Characters', difficulty: 'Medium', pattern: 'Sliding Window', companies: ['Google', 'Amazon', 'Meta'], acceptanceRate: '35%', desc: 'Identify longest unique substring bounds.' },
    { key: 'container-water', id: 11, title: 'Container With Most Water', difficulty: 'Medium', pattern: 'Two Pointers', companies: ['Amazon', 'Google', 'Meta'], acceptanceRate: '54%', desc: 'Find two lines forming max area pool.' },
    { key: 'lru-cache', id: 146, title: 'LRU Cache', difficulty: 'Hard', pattern: 'Linked List + Hash Map', companies: ['Amazon', 'Google', 'Microsoft'], acceptanceRate: '43%', desc: 'Design O(1) Cache eviction policy.' }
  );

  // 2. Add some other well-known problems
  const seeds = [
    { id: 2, title: 'Add Two Numbers', difficulty: 'Medium', pattern: 'Linked List' },
    { id: 5, title: 'Longest Palindromic Substring', difficulty: 'Medium', pattern: 'Dynamic Programming' },
    { id: 21, title: 'Merge Two Sorted Lists', difficulty: 'Easy', pattern: 'Linked List' },
    { id: 33, title: 'Search in Rotated Sorted Array', difficulty: 'Medium', pattern: 'Binary Search' },
    { id: 42, title: 'Trapping Rain Water', difficulty: 'Hard', pattern: 'Two Pointers' },
    { id: 53, title: 'Maximum Subarray', difficulty: 'Medium', pattern: 'Dynamic Programming' },
    { id: 70, title: 'Climbing Stairs', difficulty: 'Easy', pattern: 'Dynamic Programming' },
    { id: 76, title: 'Minimum Window Substring', difficulty: 'Hard', pattern: 'Sliding Window' },
    { id: 98, title: 'Validate Binary Search Tree', difficulty: 'Medium', pattern: 'Depth-First Search' },
    { id: 102, title: 'Binary Tree Level Order Traversal', difficulty: 'Medium', pattern: 'Breadth-First Search' },
    { id: 121, title: 'Best Time to Buy and Sell Stock', difficulty: 'Easy', pattern: 'Array' },
    { id: 200, title: 'Number of Islands', difficulty: 'Medium', pattern: 'Depth-First Search' }
  ];

  seeds.forEach(s => {
    allProblemsIndex.push({
      key: `seed-${s.id}`,
      id: s.id,
      title: s.title,
      difficulty: s.difficulty,
      pattern: s.pattern,
      companies: ['Google', 'Meta', 'Amazon'],
      acceptanceRate: `${Math.floor(Math.random() * 25) + 35}%`,
      desc: `Solve ${s.title} using optimal ${s.pattern} principles.`
    });
  });

  // 3. Generate remaining up to 1,520 problems programmatically
  const patterns = ['Binary Search', 'Sliding Window', 'Two Pointers', 'LIFO Stack Operations', 'Breadth-First Search', 'Depth-First Search', 'Dynamic Programming', 'Linked List'];
  const difficulties = ['Easy', 'Medium', 'Hard'];
  const verbs = ['Find', 'Search', 'Design', 'Validate', 'Maximize', 'Merge', 'Calculate', 'Optimize', 'Count'];
  const nouns = ['Kth Element in', 'Subarray in', 'Duplicates in', 'Path in', 'Matrix Bounds of', 'Evictions in', 'Intervals of'];
  const structures = ['BST Tree', 'Undirected Graph', 'Sorted Matrix', 'Cyclic Grid', 'Weighted Tree', 'Circular Queue'];
  const companies = [['Google', 'Meta'], ['Amazon', 'Microsoft'], ['Apple', 'Netflix'], ['Bloomberg', 'Uber']];

  let currentId = 201;
  while (allProblemsIndex.length < 1520) {
    while ([1, 3, 11, 20, 146, 2, 5, 21, 33, 42, 53, 70, 76, 98, 102, 121, 200].includes(currentId)) {
      currentId++;
    }

    const verb = verbs[Math.floor(Math.random() * verbs.length)];
    const noun = nouns[Math.floor(Math.random() * nouns.length)];
    const struct = structures[Math.floor(Math.random() * structures.length)];
    const pattern = patterns[Math.floor(Math.random() * patterns.length)];
    const difficulty = difficulties[Math.floor(Math.random() * difficulties.length)];
    const comp = companies[Math.floor(Math.random() * companies.length)];
    
    allProblemsIndex.push({
      key: `gen-${currentId}`,
      id: currentId,
      title: `${verb} ${noun} ${struct}`,
      difficulty: difficulty,
      pattern: pattern,
      companies: comp,
      acceptanceRate: `${Math.floor(Math.random() * 30) + 30}%`,
      desc: `Optimize ${struct} processing using ${pattern}.`
    });
    
    currentId++;
  }
}

function renderProblemsList(list) {
  const limit = 40;
  const toRender = list.slice(0, limit);
  
  if (!sandboxProblemsList) return;
  sandboxProblemsList.innerHTML = '';
  
  if (toRender.length === 0) {
    sandboxProblemsList.innerHTML = `<span style="font-size:11px; color:var(--text-muted); text-align:center; padding:20px 0; font-family:var(--font-body);">No matching questions found.</span>`;
    return;
  }
  
  toRender.forEach(prob => {
    const card = document.createElement('div');
    card.className = `problem-option-card${prob.key === sandboxActiveProblem ? ' active' : ''}`;
    card.setAttribute('data-problem', prob.key);
    
    card.innerHTML = `
      <span class="difficulty-tag ${prob.difficulty.toLowerCase()}">${prob.difficulty}</span>
      <h4 style="font-family: var(--font-display); font-size: 13px; font-weight: 800; margin-bottom: 4px; color: #ffffff;">${prob.id}. ${prob.title}</h4>
      <p style="font-size: 11px; color: var(--text-secondary); line-height: 1.3; margin: 0; font-family: var(--font-body);">${prob.desc}</p>
    `;
    
    card.addEventListener('click', () => {
      if (sandboxTypingTimeout) clearTimeout(sandboxTypingTimeout);
      sandboxProblemsList.querySelectorAll('.problem-option-card').forEach(c => c.classList.remove('active'));
      card.classList.add('active');
      sandboxActiveProblem = prob.key;
      setSandboxStandby();
    });
    
    sandboxProblemsList.appendChild(card);
  });
  
  if (list.length > limit) {
    const truncatedBadge = document.createElement('div');
    truncatedBadge.style.cssText = 'font-size: 9.5px; color: var(--text-muted); text-align: center; padding: 6px 0; border-top: 1px solid rgba(255,255,255,0.02); font-family: var(--font-body);';
    truncatedBadge.innerText = `Showing 40 of ${list.length} results...`;
    sandboxProblemsList.appendChild(truncatedBadge);
  }
}

// Bind search input filter
function initSearchFilter() {
  if (!problemSearchInput) return;
  
  problemSearchInput.addEventListener('input', (e) => {
    const query = e.target.value.toLowerCase().trim();
    if (query === '') {
      renderProblemsList(allProblemsIndex);
      return;
    }
    
    const filtered = allProblemsIndex.filter(prob => {
      return prob.id.toString().includes(query) ||
             prob.title.toLowerCase().includes(query) ||
             prob.pattern.toLowerCase().includes(query) ||
             prob.difficulty.toLowerCase().includes(query);
    });
    
    renderProblemsList(filtered);
  });
}

// Dynamic Solution Synthesizer (Generates 12 sections on the fly for other 1,470+ problems)
function getOrSynthesizeProblemData(probKey) {
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

// Load stored progress if any
const loadProgressFromStorage = () => {
  try {
    const raw = localStorage.getItem('codementor_story_progress');
    if (raw) {
      compiledStateMap = JSON.parse(raw);
    }
  } catch (e) {
    console.error('Failed to load localStorage progress:', e);
  }
};
loadProgressFromStorage();

const saveProgressToStorage = (probKey, pct) => {
  try {
    compiledStateMap[probKey] = pct;
    localStorage.setItem('codementor_story_progress', JSON.stringify(compiledStateMap));
  } catch (e) {
    console.error('Failed to save localStorage progress:', e);
  }
};

const setSandboxStandby = () => {
  if (tracePlayInterval) {
    clearInterval(tracePlayInterval);
    tracePlayInterval = null;
  }
  
  const savedPct = compiledStateMap[sandboxActiveProblem] || 0;
  let resumeText = '';
  if (savedPct > 0) {
    resumeText = `<br><span style="color:var(--color-analysis); font-size:11px; cursor:pointer;" id="resume-trigger">↺ Last completed study session: ${savedPct}% (Click Compile to resume)</span>`;
  }
  
  sandboxStreamBody.innerHTML = `<span class="placeholder-text">// Select a target question on the left and click "Compile Solution" to stream the LeetCode Story Engine.${resumeText}</span>`;
  sandboxStatusLabel.innerHTML = `<span class="pulse-indicator"></span> Standby`;
  sandboxStatusLabel.className = 'console-status-label';
  consoleProgressBar.style.width = '0%';
  consoleContextBar.classList.remove('visible');
  
  // Disable TOC clicking during standby
  document.querySelectorAll('.toc-item').forEach(item => {
    item.classList.remove('enabled', 'active');
  });
};

initProblemsIndex();
renderProblemsList(allProblemsIndex);
initSearchFilter();
setSandboxStandby();

// Toggle Reading Mode
if (btnToggleMode) {
  btnToggleMode.addEventListener('click', () => {
    isAiReadingMode = !isAiReadingMode;
    if (isAiReadingMode) {
      btnToggleMode.classList.add('ai-mode');
      btnToggleMode.querySelector('.mode-text').innerText = 'AI Reading Mode';
      
      // Hide secondary sections
      document.querySelectorAll('.console-story-section').forEach(sec => {
        const secId = sec.getAttribute('id');
        if (['edges', 'mistakes', 'followups', 'export'].includes(secId)) {
          sec.classList.add('hidden-section');
        }
      });
      // Hide matching TOC items
      document.querySelectorAll('.toc-item').forEach(item => {
        const sec = item.getAttribute('data-sec');
        if (['edges', 'mistakes', 'followups', 'export'].includes(sec)) {
          item.style.display = 'none';
        }
      });
    } else {
      btnToggleMode.classList.remove('ai-mode');
      btnToggleMode.querySelector('.mode-text').innerText = 'Normal View';
      
      // Show all
      document.querySelectorAll('.console-story-section').forEach(sec => {
        sec.classList.remove('hidden-section');
      });
      document.querySelectorAll('.toc-item').forEach(item => {
        item.style.display = 'block';
      });
    }
    // Trigger scroll updates to adjust active class and progress bar height
    handleConsoleScroll();
  });
}

// Markdown Table Parser
function parseMarkdownTable(mdText) {
  const lines = mdText.split('\n').map(l => l.trim()).filter(l => l.length > 0);
  if (lines.length === 0) return '';
  
  let html = '<table>';
  let hasHeader = false;
  
  for (const line of lines) {
    if (line.replace(/[\s|:\-]/g, '') === '') continue;
    const cells = line.split('|').map(c => c.trim());
    if (cells[0] === '') cells.shift();
    if (cells[cells.length - 1] === '') cells.pop();
    
    if (!hasHeader) {
      html += '<thead><tr>' + cells.map(c => `<th>${c}</th>`).join('') + '</tr></thead><tbody>';
      hasHeader = true;
    } else {
      html += '<tr>' + cells.map(c => `<td>${c}</td>`).join('') + '</tr>';
    }
  }
  html += '</tbody></table>';
  return html;
}

// Markdown Downloader
function downloadMarkdownNotes(problemKey) {
  const data = sandboxData[problemKey];
  if (!data) return;
  
  let md = `# CodeMentor Study Notes: ${data.title} (${data.difficulty})\n\n`;
  md += `## Pattern\n${data.pattern}\n\n`;
  md += `## Acceptance Rate\n${data.acceptanceRate}\n\n`;
  md += `## Example Companies\n${data.companies.join(', ')}\n\n`;
  
  md += `## 1. Problem Breakdown\n${data.analysis.replace(/<br>/g, '\n')}\n\n`;
  md += `## 2. Strategy & Pattern Insight\n${data.strategy.replace(/<br>/g, '\n')}\n\n`;
  md += `## 3. Complexity analysis\n`;
  md += `- Time Complexity: ${data.complexity.time} (Alternative: ${data.complexity.altTime})\n`;
  md += `- Space Complexity: ${data.complexity.space} (Alternative: ${data.complexity.altSpace})\n\n`;
  
  md += `## 4. Optimal Python Solution\n\`\`\`python\n${data.code}\n\`\`\`\n\n`;
  
  md += `## 5. Line-by-Line Explanation\n`;
  data.explanation.forEach(item => {
    md += `- **Line ${item.line}**: ${item.text}\n`;
  });
  md += `\n`;
  
  md += `## 6. Edge Cases Verified\n`;
  data.edgeCases.forEach(item => {
    md += `- [x] **Input**: \`${item.input}\` → **Result**: ${item.result}\n`;
  });
  md += `\n`;
  
  md += `## 7. Common Pitfalls to Avoid\n`;
  data.commonMistakes.forEach(item => {
    md += `### ${item.title}\n${item.p}\n\n`;
  });
  
  md += `## 8. Interview Follow-Ups\n`;
  data.followUps.forEach(item => {
    md += `**Q: ${item.q}**\n*A: ${item.a}*\n\n`;
  });
  
  md += `---\n*Generated by CodeMentor. Stop memorizing. Start recognizing patterns.*`;
  
  const blob = new Blob([md], { type: 'text/markdown' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${data.title.toLowerCase().replace(/\s+/g, '-')}-study-notes.md`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

// Copy Text Helper
function copyTextToClipboard(text) {
  navigator.clipboard.writeText(text).then(() => {
    const originalText = btnCopySandbox.querySelector('span').innerText;
    btnCopySandbox.classList.add('copied');
    btnCopySandbox.querySelector('span').innerText = 'Copied!';
    setTimeout(() => {
      btnCopySandbox.classList.remove('copied');
      btnCopySandbox.querySelector('span').innerText = originalText;
    }, 1500);
  });
}

// Execution Trace Graphics Renderer
function renderTraceGraphics(problemKey, step) {
  const container = document.querySelector('.trace-viz-graphics');
  if (!container) return;
  container.innerHTML = '';
  
  if (problemKey === 'two-sum') {
    const arr = step.array;
    const active = step.activeIdx;
    const matched = step.matchedIdx;
    
    let html = `<div style="display:flex; gap:8px;">`;
    arr.forEach((val, i) => {
      let bg = 'rgba(255,255,255,0.02)';
      let border = 'rgba(255,255,255,0.06)';
      let shadow = 'none';
      if (i === active) {
        bg = 'rgba(139,92,246,0.15)';
        border = 'var(--color-ai)';
        shadow = '0 0 10px rgba(139,92,246,0.3)';
      } else if (i === matched) {
        bg = 'rgba(34,197,94,0.15)';
        border = 'var(--color-accepted)';
        shadow = '0 0 10px rgba(34,197,94,0.3)';
      }
      html += `<div style="width:32px; height:32px; display:flex; align-items:center; justify-content:center; background:${bg}; border:1px solid ${border}; border-radius:6px; font-weight:700; box-shadow:${shadow}; position:relative; font-size:11px;">
        ${val}
        ${i === active ? '<span style="position:absolute; bottom:-14px; font-size:9px; color:var(--color-ai); font-weight:bold;">i</span>' : ''}
        ${i === matched ? '<span style="position:absolute; bottom:-14px; font-size:9px; color:var(--color-accepted); font-weight:bold;">match</span>' : ''}
      </div>`;
    });
    html += `</div>`;
    container.innerHTML = html;
  }
  else if (problemKey === 'valid-parentheses') {
    const chars = step.chars;
    const active = step.activeIdx;
    const stack = step.stack;
    
    let html = `<div style="display:flex; flex-direction:column; align-items:center; gap:8px; width:100%;">`;
    
    html += `<div style="display:flex; gap:8px;">`;
    chars.forEach((char, i) => {
      let color = 'var(--text-secondary)';
      let weight = 'normal';
      let border = 'transparent';
      if (i === active) {
        color = 'var(--color-ai)';
        weight = 'bold';
        border = 'var(--color-ai)';
      }
      html += `<span style="font-family:monospace; font-size:13px; color:${color}; font-weight:${weight}; padding: 1px 4px; border-bottom: 2px solid ${border};">${char}</span>`;
    });
    html += `</div>`;
    
    html += `<div style="display:flex; flex-direction:column-reverse; width:100px; border:2px solid rgba(255,255,255,0.06); border-top:none; border-radius:0 0 6px 6px; padding:3px; min-height:40px; align-items:center; gap:3px; background:rgba(0,0,0,0.25);">`;
    if (!stack || stack.length === 0) {
      html += `<span style="font-size:8px; color:var(--text-muted); padding: 5px 0;">STACK EMPTY</span>`;
    } else {
      stack.forEach(item => {
        html += `<div style="width:100%; height:14px; background:rgba(139,92,246,0.15); border:1px solid rgba(139,92,246,0.3); border-radius:3px; display:flex; align-items:center; justify-content:center; font-family:monospace; font-size:9px; font-weight:bold; color:#ffffff;">${item}</div>`;
      });
    }
    html += `</div>`;
    
    html += `</div>`;
    container.innerHTML = html;
  }
  else if (problemKey === 'longest-substring') {
    const s = step.s;
    const left = step.left;
    const right = step.right;
    
    let html = `<div style="display:flex; flex-direction:column; align-items:center; gap:8px; width:100%;">`;
    
    html += `<div style="display:flex; gap:3px; position:relative; padding:12px 0;">`;
    s.split('').forEach((char, i) => {
      let isWindow = (i >= left && i <= right);
      let bg = isWindow ? 'rgba(6,182,212,0.1)' : 'transparent';
      let border = isWindow ? 'rgba(6,182,212,0.3)' : 'transparent';
      if (i === right) {
        border = 'var(--color-analysis)';
      }
      
      html += `<div style="width:20px; height:20px; display:flex; align-items:center; justify-content:center; background:${bg}; border:1px solid ${border}; border-radius:4px; font-family:monospace; font-size:11px; position:relative;">
        ${char}
        ${i === left ? '<span style="position:absolute; top:-12px; font-size:8px; color:var(--color-accepted); font-weight:bold;">L</span>' : ''}
        ${i === right ? '<span style="position:absolute; bottom:-12px; font-size:8px; color:var(--color-analysis); font-weight:bold;">R</span>' : ''}
      </div>`;
    });
    html += `</div>`;
    
    html += `</div>`;
    container.innerHTML = html;
  }
  else if (problemKey === 'container-water') {
    const height = step.height;
    const left = step.left;
    const right = step.right;
    const maxVal = Math.max(...height);
    
    let html = `<div style="display:flex; flex-direction:column; align-items:center; gap:4px; width:100%;">`;
    
    html += `<div style="display:flex; align-items:flex-end; gap:6px; height:50px; padding:0 8px;">`;
    height.forEach((h, i) => {
      let hPx = (h / maxVal) * 40;
      let bg = 'rgba(255,255,255,0.05)';
      let border = 'rgba(255,255,255,0.1)';
      let isWindow = (i >= left && i <= right);
      
      if (i === left || i === right) {
        bg = 'rgba(139,92,246,0.3)';
        border = 'var(--color-ai)';
      } else if (isWindow) {
        bg = 'rgba(6,182,212,0.15)';
        border = 'rgba(6,182,212,0.3)';
      }
      
      html += `<div style="width:12px; height:${hPx}px; background:${bg}; border:1px solid ${border}; border-radius:2px 2px 0 0; position:relative;">
        ${i === left ? '<span style="position:absolute; top:-12px; left:1px; font-size:7px; color:var(--color-ai); font-weight:bold;">L</span>' : ''}
        ${i === right ? '<span style="position:absolute; top:-12px; left:1px; font-size:7px; color:var(--color-ai); font-weight:bold;">R</span>' : ''}
      </div>`;
    });
    html += `</div>`;
    
    html += `</div>`;
    container.innerHTML = html;
  }
  else if (problemKey === 'lru-cache') {
    const list = step.list;
    const cache = step.cache;
    
    let html = `<div style="display:flex; flex-direction:column; align-items:center; gap:6px; width:100%;">`;
    
    html += `<div style="display:flex; align-items:center; gap:4px; flex-wrap:wrap; justify-content:center;">`;
    list.forEach((node, i) => {
      let bg = 'rgba(255,255,255,0.02)';
      let border = 'rgba(255,255,255,0.06)';
      let color = 'var(--text-secondary)';
      if (node === 'Head' || node === 'Tail') {
        color = 'var(--text-muted)';
      } else {
        bg = 'rgba(139,92,246,0.1)';
        border = 'rgba(139,92,246,0.3)';
        color = '#ffffff';
      }
      
      html += `<div style="padding:2px 5px; background:${bg}; border:1px solid ${border}; border-radius:4px; font-family:monospace; font-size:9px; color:${color}; font-weight:bold;">${node}</div>`;
      if (i < list.length - 1) {
        html += `<span style="color:rgba(255,255,255,0.15); font-size:9px;">⇄</span>`;
      }
    });
    html += `</div>`;
    
    html += `<div style="font-size:9px; color:var(--text-secondary);">Cache Map Keys: <span style="font-family:monospace; color:#ffffff; font-weight:bold;">{${cache}}</span></div>`;
    
    html += `</div>`;
    container.innerHTML = html;
  }
}

// Active section detector & scroll tracker
function handleConsoleScroll() {
  const consoleBody = sandboxStreamBody;
  if (!consoleBody.children.length) return;
  
  // Update progress bar width
  const scrollTotal = consoleBody.scrollHeight - consoleBody.clientHeight;
  if (scrollTotal > 0) {
    const pct = Math.round((consoleBody.scrollTop / scrollTotal) * 100);
    consoleProgressBar.style.width = `${pct}%`;
    
    // Save progress to localstorage
    saveProgressToStorage(sandboxActiveProblem, pct);
  }
  
  // Show context bar if scrolled down
  if (consoleBody.scrollTop > 30) {
    consoleContextBar.classList.add('visible');
  } else {
    consoleContextBar.classList.remove('visible');
  }
  
  // Detect active section
  const sections = Array.from(consoleBody.querySelectorAll('.console-story-section'));
  const viewportTop = consoleBody.getBoundingClientRect().top + 45; // Offset for context bar
  let activeSecId = '';
  
  for (const sec of sections) {
    if (sec.classList.contains('hidden-section')) continue;
    const rect = sec.getBoundingClientRect();
    if (rect.top <= viewportTop + 20 && rect.bottom >= viewportTop) {
      activeSecId = sec.getAttribute('data-sec');
      break;
    }
  }
  
  if (activeSecId) {
    // Update sticky context text
    const data = getOrSynthesizeProblemData(sandboxActiveProblem);
    contextProblemInfo.innerText = `Problem #${data.id} — ${data.title}`;
    
    const secLabelMap = {
      'overview': '01 Overview',
      'breakdown': '02 Breakdown',
      'pattern': '03 Pattern',
      'complexity': '04 Complexity',
      'strategy': '05 Strategy',
      'code': '06 Solution Code',
      'trace': '07 Execution Trace',
      'explanation': '08 Explanation',
      'edges': '09 Edge Cases',
      'mistakes': '10 Pitfalls',
      'followups': '11 Follow-Ups',
      'export': '12 Export Notes'
    };
    contextSectionInfo.innerText = `Section: ${secLabelMap[activeSecId] || activeSecId}`;
    
    // Highlight TOC
    document.querySelectorAll('.toc-item').forEach(item => {
      if (item.getAttribute('data-sec') === activeSecId) {
        item.classList.add('active');
      } else {
        item.classList.remove('active');
      }
    });
  }
}

// Code & Explanation hover linking binder
function bindHoverLinkages() {
  const codeLines = sandboxStreamBody.querySelectorAll('.code-line');
  const expLines = sandboxStreamBody.querySelectorAll('.exp-line');
  
  codeLines.forEach(line => {
    line.addEventListener('mouseenter', () => {
      const lineNum = line.getAttribute('data-line');
      line.classList.add('active-hl');
      const targetExp = sandboxStreamBody.querySelector(`.exp-line[data-line="${lineNum}"]`);
      if (targetExp) {
        targetExp.classList.add('active-hl');
        // Scroll explanation into view within console body if needed
      }
    });
    
    line.addEventListener('mouseleave', () => {
      const lineNum = line.getAttribute('data-line');
      line.classList.remove('active-hl');
      const targetExp = sandboxStreamBody.querySelector(`.exp-line[data-line="${lineNum}"]`);
      if (targetExp) targetExp.classList.remove('active-hl');
    });
  });
  
  expLines.forEach(item => {
    item.addEventListener('mouseenter', () => {
      const lineNum = item.getAttribute('data-line');
      item.classList.add('active-hl');
      const targetLine = sandboxStreamBody.querySelector(`.code-line[data-line="${lineNum}"]`);
      if (targetLine) {
        targetLine.classList.add('active-hl');
      }
    });
    
    item.addEventListener('mouseleave', () => {
      const lineNum = item.getAttribute('data-line');
      item.classList.remove('active-hl');
      const targetLine = sandboxStreamBody.querySelector(`.code-line[data-line="${lineNum}"]`);
      if (targetLine) targetLine.classList.remove('active-hl');
    });
  });
}

// Trace Player State Updates
function updateTraceFrame(problemKey, frameIdx) {
  const data = getOrSynthesizeProblemData(problemKey);
  if (!data || !data.trace || data.trace.length === 0) return;
  
  traceActiveStep = frameIdx;
  const frame = data.trace[frameIdx];
  
  // Update scrubber value
  const slider = sandboxStreamBody.querySelector('.trace-slider');
  if (slider) slider.value = frameIdx;
  
  // Update step badge
  const badge = sandboxStreamBody.querySelector('.trace-step-badge');
  if (badge) badge.innerText = `Step ${frameIdx + 1} of ${data.trace.length}`;
  
  // Update state variables UI
  const varBox = sandboxStreamBody.querySelector('.trace-viz-variables');
  if (varBox) {
    let varHtml = '';
    for (const [key, val] of Object.entries(frame.variables)) {
      varHtml += `<span class="trace-var"><span class="trace-var-name">${key}</span> = <span class="trace-var-val">${val}</span></span>`;
    }
    varBox.innerHTML = varHtml;
  }
  
  // Update log message
  const logBox = sandboxStreamBody.querySelector('.trace-log-msg');
  if (logBox) logBox.innerHTML = `&gt; ${frame.log}`;
  
  // Highlight code lines active in trace step
  const codeLines = sandboxStreamBody.querySelectorAll('.code-line');
  codeLines.forEach(line => {
    const lineNum = parseInt(line.getAttribute('data-line'));
    if (frame.highlightLines && frame.highlightLines.includes(lineNum)) {
      line.classList.add('active-hl');
    } else {
      line.classList.remove('active-hl');
    }
  });
  
  // Render visual graphics representation
  renderTraceGraphics(problemKey, frame);
  
  // Update player buttons disabled state
  const btnPrev = sandboxStreamBody.querySelector('#btn-trace-prev');
  const btnNext = sandboxStreamBody.querySelector('#btn-trace-next');
  if (btnPrev) btnPrev.disabled = (frameIdx === 0);
  if (btnNext) btnNext.disabled = (frameIdx === data.trace.length - 1);
}

// Bind Scrubber slider events
function bindTracePlayerEvents(problemKey) {
  const slider = sandboxStreamBody.querySelector('.trace-slider');
  const btnPrev = sandboxStreamBody.querySelector('#btn-trace-prev');
  const btnNext = sandboxStreamBody.querySelector('#btn-trace-next');
  const btnPlay = sandboxStreamBody.querySelector('#btn-trace-play');
  const btnReplay = sandboxStreamBody.querySelector('#btn-trace-replay');
  const data = getOrSynthesizeProblemData(problemKey);
  
  if (slider) {
    slider.addEventListener('input', (e) => {
      if (tracePlayInterval) {
        clearInterval(tracePlayInterval);
        tracePlayInterval = null;
        if (btnPlay) btnPlay.innerText = 'Play';
      }
      updateTraceFrame(problemKey, parseInt(e.target.value));
    });
  }
  
  if (btnPrev) {
    btnPrev.addEventListener('click', () => {
      if (tracePlayInterval) {
        clearInterval(tracePlayInterval);
        tracePlayInterval = null;
        if (btnPlay) btnPlay.innerText = 'Play';
      }
      if (traceActiveStep > 0) {
        updateTraceFrame(problemKey, traceActiveStep - 1);
      }
    });
  }
  
  if (btnNext) {
    btnNext.addEventListener('click', () => {
      if (tracePlayInterval) {
        clearInterval(tracePlayInterval);
        tracePlayInterval = null;
        if (btnPlay) btnPlay.innerText = 'Play';
      }
      if (traceActiveStep < data.trace.length - 1) {
        updateTraceFrame(problemKey, traceActiveStep + 1);
      }
    });
  }
  
  if (btnPlay) {
    btnPlay.addEventListener('click', () => {
      if (tracePlayInterval) {
        clearInterval(tracePlayInterval);
        tracePlayInterval = null;
        btnPlay.innerText = 'Play';
      } else {
        if (traceActiveStep >= data.trace.length - 1) {
          traceActiveStep = 0;
        }
        btnPlay.innerText = 'Pause';
        tracePlayInterval = setInterval(() => {
          if (traceActiveStep < data.trace.length - 1) {
            updateTraceFrame(problemKey, traceActiveStep + 1);
          } else {
            clearInterval(tracePlayInterval);
            tracePlayInterval = null;
            btnPlay.innerText = 'Play';
          }
        }, 1500);
      }
    });
  }
  
  if (btnReplay) {
    btnReplay.addEventListener('click', () => {
      if (tracePlayInterval) {
        clearInterval(tracePlayInterval);
        tracePlayInterval = null;
        if (btnPlay) btnPlay.innerText = 'Play';
      }
      updateTraceFrame(problemKey, 0);
    });
  }
}

// Line-by-Line Section Streaming Engine
sandboxRunBtn.addEventListener('click', async () => {
  if (sandboxTypingTimeout) clearTimeout(sandboxTypingTimeout);
  if (tracePlayInterval) {
    clearInterval(tracePlayInterval);
    tracePlayInterval = null;
  }
  
  sandboxRunBtn.disabled = true;
  sandboxRunBtn.innerText = 'PROCESSING...';
  sandboxStatusLabel.innerHTML = `<span class="pulse-indicator"></span> SOLVING PROBLEM...`;
  sandboxStatusLabel.className = 'console-status-label solving';
  
  const data = sandboxData[sandboxActiveProblem];
  sandboxStreamBody.innerHTML = '';
  consoleProgressBar.style.width = '0%';
  
  // 1. Setup Scroll Listener
  sandboxStreamBody.addEventListener('scroll', handleConsoleScroll);
  
  // 2. Render Signature Intro first
  const introEl = document.createElement('div');
  introEl.className = 'senior-intro-card';
  introEl.innerHTML = `<h3>How a Senior Engineer Thinks</h3><p id="intro-line-reveal">Analyzing target inputs... checking boundaries... mapping constraints...</p>`;
  sandboxStreamBody.appendChild(introEl);
  
  await new Promise(r => setTimeout(r, 600));
  const introText = introEl.querySelector('#intro-line-reveal');
  introText.innerHTML = `Candidates rush to write brute-force loops.<br>Experienced engineers stop to <strong>identify patterns</strong> and observe complexity limits first.`;
  sandboxStreamBody.scrollTop = sandboxStreamBody.scrollHeight;
  
  await new Promise(r => setTimeout(r, 600));
  
  // 12 story blocks definitions
  const sections = [
    {
      id: 'overview',
      label: 'Problem Overview',
      html: `
        <div class="overview-grid">
          <div class="overview-stat"><span class="overview-stat-lbl">LeetCode ID</span><span class="overview-stat-val">#${data.id}</span></div>
          <div class="overview-stat"><span class="overview-stat-lbl">Difficulty</span><span class="difficulty-tag ${data.difficulty.toLowerCase()}">${data.difficulty}</span></div>
          <div class="overview-stat"><span class="overview-stat-lbl">Pattern</span><span class="overview-stat-val">${data.pattern}</span></div>
          <div class="overview-stat"><span class="overview-stat-lbl">Acceptance</span><span class="overview-stat-val">${data.acceptanceRate}</span></div>
          <div class="overview-companies">
            ${data.companies.map(c => `<span class="company-badge">${c}</span>`).join('')}
          </div>
        </div>
      `
    },
    {
      id: 'breakdown',
      label: 'Problem Breakdown',
      html: `<div class="story-card-wrapper">${data.analysis}</div>`
    },
    {
      id: 'pattern',
      label: 'Pattern Recognition',
      html: `
        <div class="story-card-wrapper">
          <div class="pattern-flow-chart">
            <div class="flow-node">Constraint limits: N &le; 10⁵</div>
            <div class="flow-arrow">↓</div>
            <div class="flow-node">Required timebound: O(N) linear</div>
            <div class="flow-arrow">↓</div>
            <div class="flow-node active-node">${data.pattern}</div>
          </div>
        </div>
      `
    },
    {
      id: 'complexity',
      label: 'Complexity Analysis',
      html: `
        <div class="complexity-cards-grid">
          <div class="complexity-visual-card">
            <h5>Time Complexity</h5>
            <div class="complexity-bar-wrapper">
              <div class="complexity-bar-label"><span>Brute Force</span><span>${data.complexity.altTime}</span></div>
              <div class="complexity-bar-outer"><div class="complexity-bar-inner bad" style="width:${data.complexity.altTimePct}%"></div></div>
            </div>
            <div class="complexity-bar-wrapper">
              <div class="complexity-bar-label"><span>Optimal</span><span>${data.complexity.time}</span></div>
              <div class="complexity-bar-outer"><div class="complexity-bar-inner good" style="width:${data.complexity.timePct}%"></div></div>
            </div>
          </div>
          <div class="complexity-visual-card">
            <h5>Space Complexity</h5>
            <div class="complexity-bar-wrapper">
              <div class="complexity-bar-label"><span>Max Auxiliary Space</span><span>${data.complexity.space}</span></div>
              <div class="complexity-bar-outer"><div class="complexity-bar-inner good" style="width:${data.complexity.timePct}%"></div></div>
            </div>
          </div>
        </div>
      `
    },
    {
      id: 'strategy',
      label: 'Optimal Strategy',
      html: `<div class="story-card-wrapper">${data.strategy}</div>`
    },
    {
      id: 'code',
      label: 'Optimal Code Solution',
      html: `
        <div class="code-story-container">
          <div class="code-story-header">
            <span>optimal_solution.py</span>
            <button class="btn-expand-code" id="btn-toggle-expand">Expand</button>
          </div>
          <div class="code-story-viewport collapsed" id="code-story-viewport">
            ${data.code.split('\n').map((lineText, idx) => {
              // Convert text to highlighted line content
              const lineNum = idx + 1;
              return `<div class="code-line" data-line="${lineNum}">
                <div class="code-line-num">${lineNum}</div>
                <div class="code-line-content">${highlightPython(lineText)}</div>
              </div>`;
            }).join('')}
          </div>
        </div>
      `
    },
    {
      id: 'trace',
      label: 'Interactive Execution Trace',
      html: `
        <div class="trace-container">
          <div class="trace-controls">
            <button class="trace-btn" id="btn-trace-prev" disabled>Prev</button>
            <button class="trace-btn" id="btn-trace-play">Play</button>
            <button class="trace-btn" id="btn-trace-replay">Replay</button>
            <button class="trace-btn" id="btn-trace-next">Next</button>
            <div class="trace-scrubber-wrapper">
              <input type="range" class="trace-slider" min="0" max="${data.trace.length - 1}" value="0">
              <span class="trace-step-badge">Step 1 of ${data.trace.length}</span>
            </div>
          </div>
          <div class="trace-visualizer">
            <div class="trace-viz-variables"></div>
            <div class="trace-viz-graphics"></div>
            <div class="trace-log-msg">&gt; Standby</div>
          </div>
        </div>
      `
    },
    {
      id: 'explanation',
      label: 'Line-by-Line Explanation',
      html: `
        <div class="explanation-story-list">
          ${data.explanation.map(item => `
            <div class="exp-line" data-line="${item.line}">
              <div class="exp-line-header">Line ${item.line}</div>
              <div class="exp-line-body">${item.text}</div>
            </div>
          `).join('')}
        </div>
      `
    },
    {
      id: 'edges',
      label: 'Edge Case Validation',
      html: `
        <div class="edges-passes-list">
          ${data.edgeCases.map(item => `
            <div class="edge-pass-item">
              <span class="edge-pass-check">✓</span>
              <span class="edge-pass-input">${item.input}</span>
              <span class="edge-pass-result">${item.result}</span>
            </div>
          `).join('')}
        </div>
      `
    },
    {
      id: 'mistakes',
      label: 'Common Mistakes',
      html: `
        <div class="mistakes-grid">
          ${data.commonMistakes.map(item => `
            <div class="mistake-warning-card">
              <span class="warn-icon">⚠</span>
              <div>
                <h5>${item.title}</h5>
                <p>${item.p}</p>
              </div>
            </div>
          `).join('')}
        </div>
      `
    },
    {
      id: 'followups',
      label: 'Interview Follow-Ups',
      html: `
        <div class="followups-story-list">
          ${data.followUps.map(item => `
            <div class="followup-story-item">
              <div class="followup-q">Q: ${item.q}</div>
              <div class="followup-a">A: ${item.a}</div>
            </div>
          `).join('')}
        </div>
      `
    },
    {
      id: 'export',
      label: 'Study Export Center',
      html: `
        <div class="export-options-grid">
          <button class="export-btn" id="btn-export-code-val">Copy Code</button>
          <button class="export-btn" id="btn-export-notes-val">Export Study Notes (.md)</button>
        </div>
      `
    }
  ];
  
  // Stream sections sequentially (line-by-line / block-by-block reveal)
  for (let i = 0; i < sections.length; i++) {
    const sec = sections[i];
    
    const secEl = document.createElement('section');
    secEl.className = 'console-story-section';
    secEl.setAttribute('id', sec.id);
    secEl.setAttribute('data-sec', sec.id);
    
    // Hide sections that shouldn't show in AI Reading Mode
    if (isAiReadingMode && ['edges', 'mistakes', 'followups', 'export'].includes(sec.id)) {
      secEl.classList.add('hidden-section');
    }
    
    secEl.innerHTML = `
      <div class="story-sec-title">
        <span class="sec-num">${String(i + 1).padStart(2, '0')}</span>
        <span>${sec.label}</span>
      </div>
      <div class="story-sec-content">${sec.html}</div>
    `;
    
    sandboxStreamBody.appendChild(secEl);
    
    // Animate compile progress bar (0 to 100%)
    const pct = Math.round(((i + 1) / sections.length) * 100);
    consoleProgressBar.style.width = `${pct}%`;
    
    // Custom logic on dynamic instantiation during streaming
    if (sec.id === 'code') {
      // Bind expand/collapse events for code block
      const btnExpand = secEl.querySelector('#btn-toggle-expand');
      const viewport = secEl.querySelector('#code-story-viewport');
      if (btnExpand && viewport) {
        btnExpand.addEventListener('click', () => {
          if (viewport.classList.contains('collapsed')) {
            viewport.classList.remove('collapsed');
            btnExpand.innerText = 'Collapse';
          } else {
            viewport.classList.add('collapsed');
            btnExpand.innerText = 'Expand';
          }
        });
      }
    }
    
    if (sec.id === 'trace') {
      // Initialize first frame of trace visualizer
      updateTraceFrame(sandboxActiveProblem, 0);
      bindTracePlayerEvents(sandboxActiveProblem);
    }
    
    if (sec.id === 'export') {
      // Bind export button clicks
      const btnExpCode = secEl.querySelector('#btn-export-code-val');
      const btnExpNotes = secEl.querySelector('#btn-export-notes-val');
      if (btnExpCode) {
        btnExpCode.addEventListener('click', () => {
          copyTextToClipboard(data.code);
        });
      }
      if (btnExpNotes) {
        btnExpNotes.addEventListener('click', () => {
          downloadMarkdownNotes(sandboxActiveProblem);
        });
      }
    }
    
    sandboxStreamBody.scrollTop = sandboxStreamBody.scrollHeight;
    await new Promise(r => setTimeout(r, 120)); // stream line delay
  }
  
  // 3. Enable TOC items
  document.querySelectorAll('.toc-item').forEach(item => {
    item.classList.add('enabled');
  });
  
  // 4. Bind Line highlight linkage hover events
  bindHoverLinkages();
  
  // 5. Finalize Solver Compile state
  sandboxRunBtn.disabled = false;
  sandboxRunBtn.innerText = 'Compile Solution';
  sandboxStatusLabel.innerHTML = `<span class="pulse-indicator"></span> SOLUTION ACCEPTED`;
  sandboxStatusLabel.className = 'console-status-label done';
  
  // Save 100% completed compilation
  saveProgressToStorage(sandboxActiveProblem, 100);
  
  // Scroll to last saved position if any
  const savedPct = compiledStateMap[sandboxActiveProblem] || 0;
  if (savedPct > 0 && savedPct < 100) {
    const scrollTotal = sandboxStreamBody.scrollHeight - sandboxStreamBody.clientHeight;
    sandboxStreamBody.scrollTop = (savedPct / 100) * scrollTotal;
  }
  
  // Trigger initial scroll tracking bounds check
  handleConsoleScroll();
});

// Clipboard Copy logic for sandbox header bar
if (btnCopySandbox) {
  btnCopySandbox.addEventListener('click', () => {
    const data = getOrSynthesizeProblemData(sandboxActiveProblem);
    if (data) {
      copyTextToClipboard(data.code);
    }
  });
}

// ==========================================
// 7. SECTION 5: ALGORITHM PATTERN SHOWCASE (HORIZONTAL PINNED SCROLL)
// ==========================================
if (!prefersReducedMotion && window.innerWidth > 768) {
  const pinWrap = document.querySelector('.showcase-pin-wrap');
  
  gsap.to(pinWrap, {
    x: () => -(pinWrap.scrollWidth - window.innerWidth),
    ease: 'none',
    scrollTrigger: {
      trigger: '#showcase-sec',
      pin: true,
      scrub: 1,
      start: 'top top',
      end: () => `+=${pinWrap.scrollWidth - window.innerWidth}`,
      invalidateOnRefresh: true,
    }
  });

  // Apply reverse parallax visual translation to card visual containers inside panels
  const cards = gsap.utils.toArray('.showcase-panel:not(.panel-intro) .showcase-card');
  cards.forEach(card => {
    const viz = card.querySelector('.card-right');
    gsap.fromTo(viz,
      { xPercent: -15 },
      {
        xPercent: 15,
        ease: 'none',
        scrollTrigger: {
          trigger: card,
          containerAnimation: gsap.globalTimeline.getChildren().find(t => t.vars.trigger === '#showcase-sec'), // Sync to horizontal scroll tween
          start: 'left right',
          end: 'right left',
          scrub: true
        }
      }
    );
  });
}

// ==========================================
// 8. MINI-VISUALIZERS ANIMATION LOOP ENGINES
// ==========================================

// Viz 1: Sliding Window
const runSlidingWindowViz = () => {
  const target = document.getElementById('window-viz-target');
  if (!target) return;

  const array = [1, 5, 2, 9, 3, 7, 4, 8];
  let windowSize = 3;
  let index = 0;

  function render() {
    target.innerHTML = `
      <div class="array-flex">
        ${array.map((val, i) => {
          let cls = 'array-node';
          let ptr = '';
          if (i >= index && i < index + windowSize) {
            if (i === index || i === index + windowSize - 1) {
              cls += ' edge-window';
            } else {
              cls += ' active-window';
            }
          }
          if (i === index) ptr = '<span class="node-ptr-lbl ptr-cyan">L</span>';
          if (i === index + windowSize - 1) ptr = '<span class="node-ptr-lbl ptr-amber">R</span>';
          return `<div class="${cls}">${val}${ptr}</div>`;
        }).join('')}
      </div>
      <div class="viz-footer-bar">
        <span>Window size: ${windowSize}</span>
        <span>Left index: ${index}</span>
      </div>
    `;

    index = (index + 1) % (array.length - windowSize + 1);
  }

  render();
  setInterval(render, 1600);
};

// Viz 2: Binary Search
const runBinarySearchViz = () => {
  const target = document.getElementById('binary-viz-target');
  if (!target) return;

  const array = [1, 3, 5, 7, 9, 11, 13, 15, 17];
  const targetVal = 13;
  let L = 0;
  let R = array.length - 1;
  let M = Math.floor((L + R) / 2);

  function render() {
    target.innerHTML = `
      <div class="array-flex">
        ${array.map((val, i) => {
          let cls = 'array-node';
          let ptr = '';
          if (i === L) {
            cls += ' left-pointer';
            ptr += '<span class="node-ptr-lbl ptr-purple">L</span>';
          }
          if (i === R) {
            cls += ' right-pointer';
            ptr += '<span class="node-ptr-lbl ptr-amber">R</span>';
          }
          if (i === M) {
            cls += ' edge-window';
            ptr += '<span class="node-ptr-lbl ptr-cyan">M</span>';
          }
          if (val === targetVal && i === M) {
            cls = 'array-node found-node';
          }
          return `<div class="${cls}">${val}${ptr}</div>`;
        }).join('')}
      </div>
      <div class="viz-footer-bar">
        <span>Left: ${L}</span>
        <span>Mid: ${M}</span>
        <span>Right: ${R}</span>
      </div>
    `;

    if (array[M] === targetVal) {
      L = 0;
      R = array.length - 1;
      M = Math.floor((L + R) / 2);
    } else {
      if (array[M] < targetVal) {
        L = M + 1;
      } else {
        R = M - 1;
      }
      M = Math.floor((L + R) / 2);
    }
  }

  render();
  setInterval(render, 1600);
};

// Viz 3: BFS Node Traversal
const runBFSViz = () => {
  const target = document.getElementById('bfs-viz-target');
  if (!target) return;

  // Render static levels tree
  target.innerHTML = `
    <div class="bfs-tree-flow">
      <div class="bfs-level">
        <div class="bfs-circle-node" id="bfs-n-1">1</div>
      </div>
      <div class="bfs-level">
        <div class="bfs-circle-node" id="bfs-n-2">2</div>
        <div class="bfs-circle-node" id="bfs-n-3">3</div>
      </div>
      <div class="bfs-level">
        <div class="bfs-circle-node" id="bfs-n-4">4</div>
        <div class="bfs-circle-node" id="bfs-n-5">5</div>
        <div class="bfs-circle-node" id="bfs-n-6">6</div>
        <div class="bfs-circle-node" id="bfs-n-7">7</div>
      </div>
    </div>
    <div class="viz-footer-bar">
      <span id="bfs-queue-text">Queue: [ ]</span>
    </div>
  `;

  const order = [1, 2, 3, 4, 5, 6, 7];
  let step = 0;

  function tick() {
    document.querySelectorAll('#bfs-viz-target .bfs-circle-node').forEach(node => {
      node.className = 'bfs-circle-node';
    });

    const activeVal = order[step];
    
    // Color visited nodes
    for (let i = 0; i < step; i++) {
      document.getElementById(`bfs-n-${order[i]}`).classList.add('visited');
    }

    // Color active node
    document.getElementById(`bfs-n-${activeVal}`).classList.add('active-bfs');

    // Update queue display text
    const queue = order.slice(step + 1, step + 4);
    document.getElementById('bfs-queue-text').innerText = `Queue: [ ${queue.join(', ')} ]`;

    step = (step + 1) % order.length;
  }

  tick();
  setInterval(tick, 1300);
};

// Viz 4: DP Grid Table Fill
const runDPGridViz = () => {
  const target = document.getElementById('dp-viz-target');
  if (!target) return;

  target.innerHTML = `
    <div class="dp-grid-table" id="dp-grid-wrapper">
      <!-- Grid filled dynamically -->
    </div>
    <div class="viz-footer-bar">
      <span id="dp-equation-text">dp[r][c] = dp[r-1][c] + dp[r][c-1]</span>
    </div>
  `;

  const gridWrapper = document.getElementById('dp-grid-wrapper');
  for (let r = 0; r < 5; r++) {
    for (let c = 0; c < 5; c++) {
      gridWrapper.innerHTML += `<div class="dp-table-cell" id="dp-c-${r}-${c}">0</div>`;
    }
  }

  let row = 0;
  let col = 0;

  function tick() {
    document.querySelectorAll('#dp-viz-target .dp-table-cell').forEach(cell => {
      cell.classList.remove('calculating', 'dependency');
    });

    const cell = document.getElementById(`dp-c-${row}-${col}`);
    
    if (row === 0 || col === 0) {
      cell.innerText = '1';
      cell.classList.add('filled', 'calculating');
      document.getElementById('dp-equation-text').innerText = `dp[${row}][${col}] = 1 (Base)`;
    } else {
      const dep1 = document.getElementById(`dp-c-${row-1}-${col}`);
      const dep2 = document.getElementById(`dp-c-${row}-${col-1}`);

      dep1.classList.add('dependency');
      dep2.classList.add('dependency');
      cell.classList.add('calculating');

      const val = parseInt(dep1.innerText) + parseInt(dep2.innerText);
      cell.innerText = val;
      cell.classList.add('filled');

      document.getElementById('dp-equation-text').innerText = `dp[${row}][${col}] = dp[${row-1}][${col}] (${dep1.innerText}) + dp[${row}][${col-1}] (${dep2.innerText}) = ${val}`;
    }

    col++;
    if (col >= 5) {
      col = 0;
      row++;
    }

    if (row >= 5) {
      row = 0;
      col = 0;
      setTimeout(() => {
        document.querySelectorAll('#dp-viz-target .dp-table-cell').forEach(cell => {
          cell.innerText = '0';
          cell.className = 'dp-table-cell';
        });
      }, 2000);
    }
  }

  tick();
  setInterval(tick, 1000);
};

// Initial triggers
runSlidingWindowViz();
runBinarySearchViz();
runBFSViz();
runDPGridViz();

// ==========================================
// 9. METRICS COUNTERS AND TILT EFFECTS
// ==========================================
const metrics = document.querySelectorAll('.metric-val');
metrics.forEach(metric => {
  const targetVal = parseInt(metric.getAttribute('data-val'));
  if (isNaN(targetVal)) return;

  ScrollTrigger.create({
    trigger: metric,
    start: 'top 85%',
    once: true,
    onEnter: () => {
      const counter = { val: 0 };
      gsap.to(counter, {
        val: targetVal,
        duration: 2,
        ease: 'power3.out',
        onUpdate: () => {
          metric.innerText = Math.floor(counter.val) + (metric.id === 'metric-problems' ? '+' : metric.id === 'metric-speed' ? '%' : '');
        }
      });
    }
  });
});

// Card tilting effect
const initTiltEffects = () => {
  if (prefersReducedMotion) return;
  const cards = document.querySelectorAll('[data-tilt]');
  cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      
      const rotateX = -y / 15;
      const rotateY = x / 15;
      
      gsap.to(card, {
        rotateX: rotateX,
        rotateY: rotateY,
        y: -5,
        duration: 0.35,
        ease: 'power2.out',
        overwrite: 'auto'
      });
    });

    card.addEventListener('mouseleave', () => {
      gsap.to(card, {
        rotateX: 0,
        rotateY: 0,
        y: 0,
        duration: 0.5,
        ease: 'power3.out',
        overwrite: 'auto'
      });
    });
  });
};

initTiltEffects();

// ==========================================
// 10. VELOCITY JELLY CURSOR & MAGNETIC snappings
// ==========================================
if (window.matchMedia('(pointer: fine)').matches && cursorDot && cursorFollower && !prefersReducedMotion) {
  gsap.set([cursorDot, cursorFollower], { xPercent: -50, yPercent: -50, x: -100, y: -100 });

  const pos = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
  const mouse = { x: pos.x, y: pos.y };

  window.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
    gsap.set(cursorDot, { x: mouse.x, y: mouse.y });
  });

  let activeSnapTarget = null;
  const dt = 0.15; // trailing factor

  gsap.ticker.add(() => {
    if (activeSnapTarget) {
      const rect = activeSnapTarget.getBoundingClientRect();
      const targetCenterX = rect.left + rect.width / 2;
      const targetCenterY = rect.top + rect.height / 2;
      
      pos.x += (targetCenterX - pos.x) * 0.25;
      pos.y += (targetCenterY - pos.y) * 0.25;
      
      gsap.set(cursorFollower, {
        x: pos.x,
        y: pos.y,
        width: rect.width + 12,
        height: rect.height + 12,
        scaleX: 1,
        scaleY: 1,
        rotation: 0
      });
    } else {
      const velocityX = mouse.x - pos.x;
      const velocityY = mouse.y - pos.y;
      
      pos.x += velocityX * dt;
      pos.y += velocityY * dt;
      
      const speed = Math.sqrt(velocityX * velocityX + velocityY * velocityY);
      
      const maxStretch = 0.45;
      const maxSquash = 0.35;
      const stretch = 1 + Math.min(speed / 90, maxStretch);
      const squash = 1 - Math.min(speed / 90, maxSquash);
      
      const angle = Math.atan2(velocityY, velocityX) * 180 / Math.PI;
      
      gsap.set(cursorFollower, {
        x: pos.x,
        y: pos.y,
        width: 32,
        height: 32,
        scaleX: stretch,
        scaleY: squash,
        rotation: angle
      });
    }
  });

  // Setup magnetic hover snapping bounds
  const setupMagneticSnaps = () => {
    const magneticElements = document.querySelectorAll('[data-magnetic]');
    magneticElements.forEach(el => {
      el.addEventListener('mouseenter', () => {
        activeSnapTarget = el;
        cursorDot.classList.add('magnet-locked');
        cursorFollower.classList.add('magnet-locked');
        
        const style = window.getComputedStyle(el);
        gsap.to(cursorFollower, {
          borderRadius: style.borderRadius,
          duration: 0.3,
          ease: 'power2.out'
        });
      });

      el.addEventListener('mouseleave', () => {
        activeSnapTarget = null;
        cursorDot.classList.remove('magnet-locked');
        cursorFollower.classList.remove('magnet-locked');
        
        gsap.to(cursorFollower, {
          borderRadius: '50%',
          duration: 0.3,
          ease: 'power2.out'
        });
        
        gsap.to(el, { x: 0, y: 0, duration: 0.45, ease: 'power3.out' });
      });

      el.addEventListener('mousemove', (e) => {
        const rect = el.getBoundingClientRect();
        const pullX = e.clientX - rect.left - rect.width / 2;
        const pullY = e.clientY - rect.top - rect.height / 2;
        
        gsap.to(el, {
          x: pullX * 0.3,
          y: pullY * 0.3,
          duration: 0.2,
          ease: 'power2.out',
          overwrite: 'auto'
        });
      });
    });
  };

  setupMagneticSnaps();
} else {
  if (typeof cursorDot !== 'undefined' && cursorDot) cursorDot.style.display = 'none';
  if (typeof cursorFollower !== 'undefined' && cursorFollower) cursorFollower.style.display = 'none';
}

// Copy clipboard handler
function handleCopy(button, textToCopy) {
  navigator.clipboard.writeText(textToCopy).then(() => {
    const span = button.querySelector('span');
    const originalText = span.innerText;
    
    button.classList.add('copied');
    span.innerText = 'Copied!';
    
    setTimeout(() => {
      button.classList.remove('copied');
      span.innerText = originalText;
    }, 1500);
  }).catch(err => {
    console.error('Copy failed:', err);
  });
}

// ==========================================
// 11. SECTION 8: VISUAL ARCHITECTURE SHOWCASE CONNECTIONS
// ==========================================
const drawArchitectureLines = () => {
  const canvas = document.getElementById('arch-canvas');
  if (!canvas || window.innerWidth <= 768) return;

  const ctx = canvas.getContext('2d');
  canvas.width = canvas.parentElement.clientWidth;
  canvas.height = canvas.parentElement.clientHeight;

  // Connection links coordinate mappings
  const links = [
    { from: 'arch-n-1', to: 'arch-n-2' },
    { from: 'arch-n-2', to: 'arch-n-3' },
    { from: 'arch-n-3', to: 'arch-n-4' },
    { from: 'arch-n-4', to: 'arch-n-5' },
    { from: 'arch-n-5', to: 'arch-n-6' },
  ];

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const canvasRect = canvas.getBoundingClientRect();

    links.forEach(link => {
      const fromEl = document.getElementById(link.from);
      const toEl = document.getElementById(link.to);
      if (!fromEl || !toEl) return;

      const fromRect = fromEl.getBoundingClientRect();
      const toRect = toEl.getBoundingClientRect();

      // Find center offset coordinates relative to SVG canvas
      const x1 = (fromRect.left + fromRect.width / 2) - canvasRect.left;
      const y1 = (fromRect.top + fromRect.height / 2) - canvasRect.top;
      const x2 = (toRect.left + toRect.width / 2) - canvasRect.left;
      const y2 = (toRect.top + toRect.height / 2) - canvasRect.top;

      // Draw glowing connection path
      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.bezierCurveTo(x1 + (x2 - x1) / 2, y1, x1 + (x2 - x1) / 2, y2, x2, y2);
      
      // Shadow glow
      ctx.strokeStyle = 'rgba(139, 92, 246, 0.2)';
      ctx.lineWidth = 4;
      ctx.stroke();

      // Core line
      ctx.strokeStyle = 'rgba(6, 182, 212, 0.4)';
      ctx.lineWidth = 1.5;
      ctx.stroke();
    });
  }

  draw();
  window.addEventListener('resize', () => {
    canvas.width = canvas.parentElement.clientWidth;
    canvas.height = canvas.parentElement.clientHeight;
    draw();
  });
};

window.addEventListener('load', () => {
  setTimeout(drawArchitectureLines, 500);
});

// ==========================================================
// 12. CODEMENTOR V2: INTERACTIVE AUTH CONTROLLER
// ==========================================================

const sessionKey = 'codementor_user_session';

// Helper to extract uppercase initials from a name (e.g. "Sarah Jenkins" -> "SJ")
function getInitials(name) {
  if (!name) return 'CM';
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

// Synchronize visual state of the header actions
function updateAuthState(user) {
  const btnSigninNav = document.getElementById('btn-signin-nav');
  const userAvatarWrap = document.getElementById('user-avatar-wrap');
  const userAvatar = document.getElementById('user-avatar');
  const userDropdownName = document.getElementById('user-dropdown-name');
  const userDropdownEmail = document.getElementById('user-dropdown-email');
  
  if (user) {
    if (btnSigninNav) btnSigninNav.style.display = 'none';
    if (userAvatarWrap) userAvatarWrap.style.display = 'block';
    if (userAvatar) userAvatar.textContent = getInitials(user.name);
    if (userDropdownName) userDropdownName.textContent = user.name;
    if (userDropdownEmail) userDropdownEmail.textContent = user.email;
  } else {
    if (btnSigninNav) btnSigninNav.style.display = 'block';
    if (userAvatarWrap) userAvatarWrap.style.display = 'none';
    if (userAvatar) userAvatar.textContent = '';
    if (userDropdownName) userDropdownName.textContent = '';
    if (userDropdownEmail) userDropdownEmail.textContent = '';
  }
}

// Initial session hydration
const storedSession = localStorage.getItem(sessionKey);
if (storedSession) {
  try {
    const user = JSON.parse(storedSession);
    updateAuthState(user);
  } catch (e) {
    localStorage.removeItem(sessionKey);
    updateAuthState(null);
  }
}

// Modal and panels DOM elements
const authModal = document.getElementById('auth-modal');
const btnSigninNav = document.getElementById('btn-signin-nav');
const btnAuthClose = document.getElementById('btn-auth-close');
const authPanelsSlider = document.getElementById('auth-panels-slider');
const linkGoSignup = document.getElementById('link-go-signup');
const linkGoSignin = document.getElementById('link-go-signin');
const btnLogout = document.getElementById('btn-logout');

function openAuthModal() {
  if (!authModal) return;
  authModal.classList.add('active');
  // Reset slider translation to sign-in panel on open
  if (authPanelsSlider) {
    authPanelsSlider.style.transform = 'translateX(0%)';
  }
  resetAuthErrors();
}

function closeAuthModal() {
  if (!authModal) return;
  authModal.classList.remove('active');
}

if (btnSigninNav) {
  btnSigninNav.addEventListener('click', openAuthModal);
}

if (btnAuthClose) {
  btnAuthClose.addEventListener('click', closeAuthModal);
}

// Dismiss modal when clicking on background backdrop
if (authModal) {
  authModal.addEventListener('click', (e) => {
    if (e.target === authModal) {
      closeAuthModal();
    }
  });
}

// Translate forms horizontally for modal panel switching
if (linkGoSignup && authPanelsSlider) {
  linkGoSignup.addEventListener('click', (e) => {
    e.preventDefault();
    authPanelsSlider.style.transform = 'translateX(-50%)';
    resetAuthErrors();
  });
}

if (linkGoSignin && authPanelsSlider) {
  linkGoSignin.addEventListener('click', (e) => {
    e.preventDefault();
    authPanelsSlider.style.transform = 'translateX(0%)';
    resetAuthErrors();
  });
}

// Logout event handler
if (btnLogout) {
  btnLogout.addEventListener('click', (e) => {
    e.preventDefault();
    localStorage.removeItem(sessionKey);
    updateAuthState(null);
  });
}

// Validation Visual Helpers
function showError(inputEl, errorEl, msg) {
  if (inputEl) inputEl.style.borderColor = '#ef4444';
  if (errorEl) {
    errorEl.textContent = msg;
    errorEl.classList.add('active');
  }
}

function resetAuthErrors() {
  const inputs = document.querySelectorAll('.auth-card input');
  const errors = document.querySelectorAll('.auth-card .error-msg');
  inputs.forEach(input => {
    input.style.borderColor = '';
  });
  errors.forEach(err => {
    err.textContent = '';
    err.classList.remove('active');
  });
}

function triggerCardShake() {
  const card = document.querySelector('.auth-card');
  if (card) {
    card.classList.add('shake');
    setTimeout(() => {
      card.classList.remove('shake');
    }, 400);
  }
}

// Sign In submission handler
const formSignin = document.getElementById('form-signin');
const btnSigninSubmit = document.getElementById('btn-signin-submit');

if (formSignin) {
  formSignin.addEventListener('submit', (e) => {
    e.preventDefault();
    resetAuthErrors();
    
    const emailEl = document.getElementById('signin-email');
    const passwordEl = document.getElementById('signin-password');
    const errEmail = document.getElementById('err-signin-email');
    const errPass = document.getElementById('err-signin-password');
    
    let hasError = false;
    const emailVal = emailEl ? emailEl.value.trim() : '';
    const passwordVal = passwordEl ? passwordEl.value : '';
    
    if (!emailVal) {
      showError(emailEl, errEmail, 'Email is required');
      hasError = true;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailVal)) {
      showError(emailEl, errEmail, 'Please enter a valid email address');
      hasError = true;
    }
    
    if (!passwordVal) {
      showError(passwordEl, errPass, 'Password is required');
      hasError = true;
    } else if (passwordVal.length < 6) {
      showError(passwordEl, errPass, 'Password must be at least 6 characters');
      hasError = true;
    }
    
    if (hasError) {
      triggerCardShake();
      return;
    }
    
    // Simulate API authorization response latency
    if (btnSigninSubmit) btnSigninSubmit.classList.add('loading');
    
    setTimeout(() => {
      if (btnSigninSubmit) btnSigninSubmit.classList.remove('loading');
      
      const mockUser = {
        name: emailVal.split('@')[0],
        email: emailVal
      };
      
      localStorage.setItem(sessionKey, JSON.stringify(mockUser));
      updateAuthState(mockUser);
      closeAuthModal();
      
      // Clear forms
      if (emailEl) emailEl.value = '';
      if (passwordEl) passwordEl.value = '';
    }, 1200);
  });
}

// Sign Up submission handler
const formSignup = document.getElementById('form-signup');
const btnSignupSubmit = document.getElementById('btn-signup-submit');

if (formSignup) {
  formSignup.addEventListener('submit', (e) => {
    e.preventDefault();
    resetAuthErrors();
    
    const nameEl = document.getElementById('signup-name');
    const emailEl = document.getElementById('signup-email');
    const passwordEl = document.getElementById('signup-password');
    const confirmEl = document.getElementById('signup-confirm-password');
    
    const errName = document.getElementById('err-signup-name');
    const errEmail = document.getElementById('err-signup-email');
    const errPass = document.getElementById('err-signup-password');
    const errConfirm = document.getElementById('err-signup-confirm-password');
    
    let hasError = false;
    const nameVal = nameEl ? nameEl.value.trim() : '';
    const emailVal = emailEl ? emailEl.value.trim() : '';
    const passwordVal = passwordEl ? passwordEl.value : '';
    const confirmVal = confirmEl ? confirmEl.value : '';
    
    if (!nameVal) {
      showError(nameEl, errName, 'Full name is required');
      hasError = true;
    }
    
    if (!emailVal) {
      showError(emailEl, errEmail, 'Email is required');
      hasError = true;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailVal)) {
      showError(emailEl, errEmail, 'Please enter a valid email address');
      hasError = true;
    }
    
    if (!passwordVal) {
      showError(passwordEl, errPass, 'Password is required');
      hasError = true;
    } else if (passwordVal.length < 6) {
      showError(passwordEl, errPass, 'Password must be at least 6 characters');
      hasError = true;
    }
    
    if (!confirmVal) {
      showError(confirmEl, errConfirm, 'Confirm password is required');
      hasError = true;
    } else if (confirmVal !== passwordVal) {
      showError(confirmEl, errConfirm, 'Passwords do not match');
      hasError = true;
    }
    
    if (hasError) {
      triggerCardShake();
      return;
    }
    
    // Simulate API registration latency
    if (btnSignupSubmit) btnSignupSubmit.classList.add('loading');
    
    setTimeout(() => {
      if (btnSignupSubmit) btnSignupSubmit.classList.remove('loading');
      
      const mockUser = {
        name: nameVal,
        email: emailVal
      };
      
      localStorage.setItem(sessionKey, JSON.stringify(mockUser));
      updateAuthState(mockUser);
      closeAuthModal();
      
      // Clear forms
      if (nameEl) nameEl.value = '';
      if (emailEl) emailEl.value = '';
      if (passwordEl) passwordEl.value = '';
      if (confirmEl) confirmEl.value = '';
    }, 1200);
  });
}

// Google and GitHub mockup authentication click bindings
const socialLogins = [
  { id: 'btn-oauth-google-in', name: 'Google Developer', email: 'dev.google@gmail.com' },
  { id: 'btn-oauth-github-in', name: 'GitHub Wizard', email: 'wizard.github@github.com' },
  { id: 'btn-oauth-google-up', name: 'Google Developer', email: 'dev.google@gmail.com' },
  { id: 'btn-oauth-github-up', name: 'GitHub Wizard', email: 'wizard.github@github.com' }
];

socialLogins.forEach(social => {
  const btn = document.getElementById(social.id);
  if (btn) {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      btn.style.opacity = '0.7';
      btn.style.pointerEvents = 'none';
      
      setTimeout(() => {
        btn.style.opacity = '';
        btn.style.pointerEvents = '';
        
        const mockUser = {
          name: social.name,
          email: social.email
        };
        
        localStorage.setItem(sessionKey, JSON.stringify(mockUser));
        updateAuthState(mockUser);
        closeAuthModal();
      }, 800);
    });
  }
});

