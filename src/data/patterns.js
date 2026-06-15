export const patternsData = {
  'sliding-window': {
    name: 'Sliding Window',
    concept: 'Maintains a dynamic subarray interval over linear collections to resolve subsegment bounds without O(N²) nested comparisons.',
    template: `def sliding_window(nums, k):
    left = 0
    current_sum = 0
    max_sum = 0
    for right in range(len(nums)):
        current_sum += nums[right]
        if right >= k - 1:
            max_sum = max(max_sum, current_sum)
            current_sum -= nums[left]
            left += 1
    return max_sum`,
    problems: [
      { id: 3, title: 'Longest Substring Without Repeating Characters', difficulty: 'Medium' },
      { id: 76, title: 'Minimum Window Substring', difficulty: 'Hard' },
      { id: 209, title: 'Minimum Size Subarray Sum', difficulty: 'Medium' }
    ],
    complexity: { time: 'O(N)', space: 'O(1) or O(K)' },
    vizType: 'window'
  },
  'binary-search': {
    name: 'Binary Search',
    concept: 'Recursively halves sorted search spaces. Reduces calculations from linear O(N) to logarithmic O(log N) operations.',
    template: `def binary_search(arr, target):
    left, right = 0, len(arr) - 1
    while left <= right:
        mid = (left + right) // 2
        if arr[mid] == target:
            return mid
        elif arr[mid] < target:
            left = mid + 1
        else:
            right = mid - 1
    return -1`,
    problems: [
      { id: 33, title: 'Search in Rotated Sorted Array', difficulty: 'Medium' },
      { id: 4, title: 'Median of Two Sorted Arrays', difficulty: 'Hard' },
      { id: 278, title: 'First Bad Version', difficulty: 'Easy' }
    ],
    complexity: { time: 'O(log N)', space: 'O(1)' },
    vizType: 'binary'
  },
  'two-pointers': {
    name: 'Two Pointers',
    concept: 'Uses two indices moving toward each other or at different speeds to solve problems on linear lists with minimal memory footprints.',
    template: `def two_pointers(heights):
    left = 0
    right = len(heights) - 1
    max_area = 0
    while left < right:
        width = right - left
        h = min(heights[left], heights[right])
        max_area = max(max_area, width * h)
        if heights[left] < heights[right]:
            left += 1
        else:
            right -= 1
    return max_area`,
    problems: [
      { id: 11, title: 'Container With Most Water', difficulty: 'Medium' },
      { id: 15, title: '3Sum', difficulty: 'Medium' },
      { id: 42, title: 'Trapping Rain Water', difficulty: 'Hard' }
    ],
    complexity: { time: 'O(N)', space: 'O(1)' },
    vizType: 'pointers'
  },
  'bfs': {
    name: 'Breadth-First Search',
    concept: 'Explores adjacent nodes level by level using FIFO queue buffers. Essential for finding shortest paths in unweighted graphs.',
    template: `from collections import deque
def bfs(graph, start):
    visited = {start}
    queue = deque([start])
    while queue:
        node = queue.popleft()
        for neighbor in graph[node]:
            if neighbor not in visited:
                visited.add(neighbor)
                queue.append(neighbor)`,
    problems: [
      { id: 102, title: 'Binary Tree Level Order Traversal', difficulty: 'Medium' },
      { id: 127, title: 'Word Ladder', difficulty: 'Hard' },
      { id: 200, title: 'Number of Islands', difficulty: 'Medium' }
    ],
    complexity: { time: 'O(V + E)', space: 'O(V)' },
    vizType: 'bfs'
  },
  'dfs': {
    name: 'Depth-First Search',
    concept: 'Traverses nodes as deeply as possible along each branch before backtracking. Typically written using recursion or stack buffers.',
    template: `def dfs(node, visited):
    if node in visited:
        return
    visited.add(node)
    for neighbor in node.neighbors:
        dfs(neighbor, visited)`,
    problems: [
      { id: 200, title: 'Number of Islands', difficulty: 'Medium' },
      { id: 133, title: 'Clone Graph', difficulty: 'Medium' },
      { id: 98, title: 'Validate Binary Search Tree', difficulty: 'Medium' }
    ],
    complexity: { time: 'O(V + E)', space: 'O(V) recursion depth' },
    vizType: 'dfs'
  },
  'dp': {
    name: 'Dynamic Programming',
    concept: 'Resolves complex recurring relations by breaking them down into simpler subproblems and caching their results in lookup tables.',
    template: `def dp_fib(n):
    if n <= 1: return n
    dp = [0] * (n + 1)
    dp[1] = 1
    for i in range(2, n + 1):
        dp[i] = dp[i-1] + dp[i-2]
    return dp[n]`,
    problems: [
      { id: 70, title: 'Climbing Stairs', difficulty: 'Easy' },
      { id: 322, title: 'Coin Change', difficulty: 'Medium' },
      { id: 1143, title: 'Longest Common Subsequence', difficulty: 'Medium' }
    ],
    complexity: { time: 'O(N)', space: 'O(N) or O(1) optimized' },
    vizType: 'dp'
  }
};
