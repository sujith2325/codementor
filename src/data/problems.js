export const sandboxData = {
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
      { line: 2, text: "Define Two Sum entry point method signature." },
      { line: 3, text: "Initialize seen dictionary to store value-to-index mappings." },
      { line: 4, text: "Iterate through elements retrieving current index i and val num." },
      { line: 5, text: "Compute need, the complement value (target - num)." },
      { line: 6, text: "Check if this complement has been recorded in our dictionary." },
      { line: 7, text: "If complement exists, return the stored index and current index." },
      { line: 8, text: "Otherwise, store current value and index in dictionary." },
      { line: 9, text: "Fallback returns empty list if no match exists." }
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
      { title: 'Reusing the same element', p: 'Ensure you check if the complement exists in the map BEFORE adding the current element. Otherwise, target=6, nums=[3] matches 3 with itself.' },
      { title: 'Nested loop O(N²) brute-force', p: 'Avoid double-loop comparisons as they exceed the time limit bounds.' }
    ],
    followUps: [
      { q: 'Can you solve this in O(1) space if the input is sorted?', a: 'Yes. We can use two pointers moving inward from ends, matching in O(N) time and O(1) space.' }
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
      { line: 4, text: "Creates a mapping dictionary where keys are closing brackets." },
      { line: 5, text: "Iterates through each character 'char' in string 's'." },
      { line: 6, text: "Checks if 'char' is a closing bracket." },
      { line: 7, text: "Pops stack top element, or dummy '#' if empty." },
      { line: 8, text: "Verifies if the popped opener matches the expected type." },
      { line: 9, text: "Returns False immediately if mismatch is detected." },
      { line: 10, text: "If opener bracket, appends it to stack." },
      { line: 11, text: "Returns True if stack is empty (all resolved), else False." }
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
      { q: 'Can you solve this with O(1) space if only one type of parentheses exists?', a: 'Yes! We can use a counter variable incrementing on "(" and decrementing on ")".' }
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
      { line: 3, text: "Initializes char_map dictionary to store character-to-index mappings." },
      { line: 4, text: "Sets the left boundary pointer of the sliding window to 0." },
      { line: 5, text: "Initializes max_length result tracker to 0." },
      { line: 6, text: "Iterates through the string using right pointer and character char." },
      { line: 7, text: "Checks if character exists in map and falls inside the current window." },
      { line: 8, text: "Shifts left pointer to the index after duplicate's last recorded position." },
      { line: 9, text: "Updates character's mapped index to current right position." },
      { line: 10, text: "Calculates current window size and updates max_length." },
      { line: 11, text: "Returns the maximum substring length." }
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
      { title: 'Incorrect duplicate check range', p: 'Ensure you check if index >= left, otherwise you might shift left backwards for old elements.' }
    ],
    followUps: [
      { q: 'Can you solve this with a set instead of a map?', a: 'Yes. By shifting left incrementally in a while loop rather than jumping, we can use a set to track window contents.' }
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
      { title: 'Incorrect pointer increment condition', p: 'Moving the pointer that points to the larger line instead of the smaller one. Shifting the taller pointer inward can only decrease the width while maintaining or decreasing the height limit.' }
    ],
    followUps: [
      { q: 'Does this greedy approach guarantee the globally optimal solution?', a: 'Yes. Moving the pointer of the shorter line inward is the only way to potentially find a taller boundary that offsets the width loss.' }
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
      { q: 'Why is a doubly linked list insufficient?', a: 'In a singly linked list, removing a node requires searching the list from the head to find its predecessor node, which would violate the O(1) time complexity requirement.' }
    ]
  }
};

export const allProblemsIndex = [];

export function initProblemsIndex() {
  allProblemsIndex.length = 0;
  
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

// Automatically seed list on compile import
initProblemsIndex();
