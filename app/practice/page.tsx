"use client";

import { useState, useEffect, useMemo } from "react";
import {
    ExternalLink,
    CheckCircle,
    RefreshCw,
    Sparkles,
    ArrowRight,
} from "lucide-react";

interface Question {
    id: number;
    title: string;
    difficulty: "Easy" | "Medium" | "Hard";
    topics: string[];
    platform: string;
    url: string;
}

const QUESTION_BANK: Question[] = [
    // --- Easy ---
    { id: 1, title: "Two Sum", difficulty: "Easy", topics: ["Array", "Hash Map"], platform: "LeetCode", url: "https://leetcode.com/problems/two-sum/" },
    { id: 2, title: "Valid Parentheses", difficulty: "Easy", topics: ["Stack", "String"], platform: "LeetCode", url: "https://leetcode.com/problems/valid-parentheses/" },
    { id: 3, title: "Merge Two Sorted Lists", difficulty: "Easy", topics: ["Linked List", "Recursion"], platform: "LeetCode", url: "https://leetcode.com/problems/merge-two-sorted-lists/" },
    { id: 4, title: "Climbing Stairs", difficulty: "Easy", topics: ["DP", "Math"], platform: "LeetCode", url: "https://leetcode.com/problems/climbing-stairs/" },
    { id: 5, title: "Binary Tree Inorder Traversal", difficulty: "Easy", topics: ["Tree", "DFS", "Stack"], platform: "LeetCode", url: "https://leetcode.com/problems/binary-tree-inorder-traversal/" },
    { id: 6, title: "Best Time to Buy and Sell Stock", difficulty: "Easy", topics: ["Array", "DP"], platform: "LeetCode", url: "https://leetcode.com/problems/best-time-to-buy-and-sell-stock/" },
    { id: 7, title: "Valid Palindrome", difficulty: "Easy", topics: ["String", "Two Pointers"], platform: "LeetCode", url: "https://leetcode.com/problems/valid-palindrome/" },
    { id: 8, title: "Linked List Cycle", difficulty: "Easy", topics: ["Linked List", "Two Pointers"], platform: "LeetCode", url: "https://leetcode.com/problems/linked-list-cycle/" },
    { id: 9, title: "Reverse Linked List", difficulty: "Easy", topics: ["Linked List", "Recursion"], platform: "LeetCode", url: "https://leetcode.com/problems/reverse-linked-list/" },
    { id: 10, title: "Maximum Depth of Binary Tree", difficulty: "Easy", topics: ["Tree", "DFS", "BFS"], platform: "LeetCode", url: "https://leetcode.com/problems/maximum-depth-of-binary-tree/" },
    { id: 11, title: "Contains Duplicate", difficulty: "Easy", topics: ["Array", "Hash Map"], platform: "LeetCode", url: "https://leetcode.com/problems/contains-duplicate/" },
    { id: 12, title: "Invert Binary Tree", difficulty: "Easy", topics: ["Tree", "DFS", "BFS"], platform: "LeetCode", url: "https://leetcode.com/problems/invert-binary-tree/" },
    { id: 13, title: "Roman to Integer", difficulty: "Easy", topics: ["String", "Math"], platform: "LeetCode", url: "https://leetcode.com/problems/roman-to-integer/" },
    { id: 14, title: "Single Number", difficulty: "Easy", topics: ["Bit Manipulation", "Array"], platform: "LeetCode", url: "https://leetcode.com/problems/single-number/" },
    { id: 15, title: "Move Zeroes", difficulty: "Easy", topics: ["Array", "Two Pointers"], platform: "LeetCode", url: "https://leetcode.com/problems/move-zeroes/" },
    { id: 16, title: "Symmetric Tree", difficulty: "Easy", topics: ["Tree", "DFS", "BFS"], platform: "LeetCode", url: "https://leetcode.com/problems/symmetric-tree/" },
    { id: 17, title: "Missing Number", difficulty: "Easy", topics: ["Array", "Bit Manipulation"], platform: "LeetCode", url: "https://leetcode.com/problems/missing-number/" },
    { id: 18, title: "Palindrome Number", difficulty: "Easy", topics: ["Math"], platform: "LeetCode", url: "https://leetcode.com/problems/palindrome-number/" },
    { id: 19, title: "Majority Element", difficulty: "Easy", topics: ["Array", "Sorting", "Hash Map"], platform: "LeetCode", url: "https://leetcode.com/problems/majority-element/" },
    { id: 20, title: "Intersection of Two Arrays II", difficulty: "Easy", topics: ["Array", "Hash Map", "Sorting"], platform: "LeetCode", url: "https://leetcode.com/problems/intersection-of-two-arrays-ii/" },
    // --- Medium ---
    { id: 21, title: "Add Two Numbers", difficulty: "Medium", topics: ["Linked List", "Math"], platform: "LeetCode", url: "https://leetcode.com/problems/add-two-numbers/" },
    { id: 22, title: "Longest Substring Without Repeating Characters", difficulty: "Medium", topics: ["String", "Sliding Window"], platform: "LeetCode", url: "https://leetcode.com/problems/longest-substring-without-repeating-characters/" },
    { id: 23, title: "Longest Palindromic Substring", difficulty: "Medium", topics: ["String", "DP"], platform: "LeetCode", url: "https://leetcode.com/problems/longest-palindromic-substring/" },
    { id: 24, title: "Container With Most Water", difficulty: "Medium", topics: ["Array", "Two Pointers"], platform: "LeetCode", url: "https://leetcode.com/problems/container-with-most-water/" },
    { id: 25, title: "3Sum", difficulty: "Medium", topics: ["Array", "Two Pointers", "Sorting"], platform: "LeetCode", url: "https://leetcode.com/problems/3sum/" },
    { id: 26, title: "Maximum Subarray", difficulty: "Medium", topics: ["Array", "DP", "Divide and Conquer"], platform: "LeetCode", url: "https://leetcode.com/problems/maximum-subarray/" },
    { id: 27, title: "Number of Islands", difficulty: "Medium", topics: ["Graph", "BFS", "DFS"], platform: "LeetCode", url: "https://leetcode.com/problems/number-of-islands/" },
    { id: 28, title: "Course Schedule", difficulty: "Medium", topics: ["Graph", "Topological Sort", "BFS"], platform: "LeetCode", url: "https://leetcode.com/problems/course-schedule/" },
    { id: 29, title: "Word Break", difficulty: "Medium", topics: ["DP", "Hash Map", "String"], platform: "LeetCode", url: "https://leetcode.com/problems/word-break/" },
    { id: 30, title: "Merge Intervals", difficulty: "Medium", topics: ["Array", "Sorting"], platform: "LeetCode", url: "https://leetcode.com/problems/merge-intervals/" },
    { id: 31, title: "Edit Distance", difficulty: "Medium", topics: ["String", "DP"], platform: "LeetCode", url: "https://leetcode.com/problems/edit-distance/" },
    { id: 32, title: "Group Anagrams", difficulty: "Medium", topics: ["String", "Hash Map", "Sorting"], platform: "LeetCode", url: "https://leetcode.com/problems/group-anagrams/" },
    { id: 33, title: "Product of Array Except Self", difficulty: "Medium", topics: ["Array", "Prefix Sum"], platform: "LeetCode", url: "https://leetcode.com/problems/product-of-array-except-self/" },
    { id: 34, title: "Top K Frequent Elements", difficulty: "Medium", topics: ["Array", "Hash Map", "Heap"], platform: "LeetCode", url: "https://leetcode.com/problems/top-k-frequent-elements/" },
    { id: 35, title: "Validate Binary Search Tree", difficulty: "Medium", topics: ["Tree", "DFS", "BST"], platform: "LeetCode", url: "https://leetcode.com/problems/validate-binary-search-tree/" },
    { id: 36, title: "Binary Tree Level Order Traversal", difficulty: "Medium", topics: ["Tree", "BFS"], platform: "LeetCode", url: "https://leetcode.com/problems/binary-tree-level-order-traversal/" },
    { id: 37, title: "Coin Change", difficulty: "Medium", topics: ["DP", "BFS"], platform: "LeetCode", url: "https://leetcode.com/problems/coin-change/" },
    { id: 38, title: "Rotate Image", difficulty: "Medium", topics: ["Array", "Matrix", "Math"], platform: "LeetCode", url: "https://leetcode.com/problems/rotate-image/" },
    { id: 39, title: "Search in Rotated Sorted Array", difficulty: "Medium", topics: ["Array", "Binary Search"], platform: "LeetCode", url: "https://leetcode.com/problems/search-in-rotated-sorted-array/" },
    { id: 40, title: "Letter Combinations of a Phone Number", difficulty: "Medium", topics: ["String", "Backtracking"], platform: "LeetCode", url: "https://leetcode.com/problems/letter-combinations-of-a-phone-number/" },
    { id: 41, title: "Subsets", difficulty: "Medium", topics: ["Array", "Backtracking"], platform: "LeetCode", url: "https://leetcode.com/problems/subsets/" },
    { id: 42, title: "Permutations", difficulty: "Medium", topics: ["Array", "Backtracking"], platform: "LeetCode", url: "https://leetcode.com/problems/permutations/" },
    { id: 43, title: "Kth Smallest Element in a BST", difficulty: "Medium", topics: ["Tree", "DFS", "BST"], platform: "LeetCode", url: "https://leetcode.com/problems/kth-smallest-element-in-a-bst/" },
    { id: 44, title: "Lowest Common Ancestor of a Binary Tree", difficulty: "Medium", topics: ["Tree", "DFS"], platform: "LeetCode", url: "https://leetcode.com/problems/lowest-common-ancestor-of-a-binary-tree/" },
    { id: 45, title: "Decode Ways", difficulty: "Medium", topics: ["String", "DP"], platform: "LeetCode", url: "https://leetcode.com/problems/decode-ways/" },
    { id: 46, title: "Unique Paths", difficulty: "Medium", topics: ["DP", "Math"], platform: "LeetCode", url: "https://leetcode.com/problems/unique-paths/" },
    { id: 47, title: "House Robber", difficulty: "Medium", topics: ["Array", "DP"], platform: "LeetCode", url: "https://leetcode.com/problems/house-robber/" },
    { id: 48, title: "Set Matrix Zeroes", difficulty: "Medium", topics: ["Array", "Matrix"], platform: "LeetCode", url: "https://leetcode.com/problems/set-matrix-zeroes/" },
    { id: 49, title: "Spiral Matrix", difficulty: "Medium", topics: ["Array", "Matrix"], platform: "LeetCode", url: "https://leetcode.com/problems/spiral-matrix/" },
    { id: 50, title: "Clone Graph", difficulty: "Medium", topics: ["Graph", "BFS", "DFS"], platform: "LeetCode", url: "https://leetcode.com/problems/clone-graph/" },
    // --- Hard ---
    { id: 51, title: "Median of Two Sorted Arrays", difficulty: "Hard", topics: ["Array", "Binary Search"], platform: "LeetCode", url: "https://leetcode.com/problems/median-of-two-sorted-arrays/" },
    { id: 52, title: "Trapping Rain Water", difficulty: "Hard", topics: ["Array", "Two Pointers", "Stack"], platform: "LeetCode", url: "https://leetcode.com/problems/trapping-rain-water/" },
    { id: 53, title: "Serialize and Deserialize Binary Tree", difficulty: "Hard", topics: ["Tree", "DFS", "BFS", "Design"], platform: "LeetCode", url: "https://leetcode.com/problems/serialize-and-deserialize-binary-tree/" },
    { id: 54, title: "Minimum Window Substring", difficulty: "Hard", topics: ["String", "Sliding Window", "Hash Map"], platform: "LeetCode", url: "https://leetcode.com/problems/minimum-window-substring/" },
    { id: 55, title: "Word Ladder", difficulty: "Hard", topics: ["String", "BFS", "Hash Map"], platform: "LeetCode", url: "https://leetcode.com/problems/word-ladder/" },
    { id: 56, title: "Merge k Sorted Lists", difficulty: "Hard", topics: ["Linked List", "Heap", "Divide and Conquer"], platform: "LeetCode", url: "https://leetcode.com/problems/merge-k-sorted-lists/" },
    { id: 57, title: "Largest Rectangle in Histogram", difficulty: "Hard", topics: ["Array", "Stack", "Monotonic Stack"], platform: "LeetCode", url: "https://leetcode.com/problems/largest-rectangle-in-histogram/" },
    { id: 58, title: "Regular Expression Matching", difficulty: "Hard", topics: ["String", "DP", "Recursion"], platform: "LeetCode", url: "https://leetcode.com/problems/regular-expression-matching/" },
    { id: 59, title: "LRU Cache", difficulty: "Hard", topics: ["Hash Map", "Linked List", "Design"], platform: "LeetCode", url: "https://leetcode.com/problems/lru-cache/" },
    { id: 60, title: "Alien Dictionary", difficulty: "Hard", topics: ["Graph", "Topological Sort", "BFS"], platform: "LeetCode", url: "https://leetcode.com/problems/alien-dictionary/" },
];

export default function PracticePage() {
    const [completed, setCompleted] = useState<number[]>([]);
    const [saving, setSaving] = useState<number | null>(null);
    const [filter, setFilter] = useState<"All" | "Easy" | "Medium" | "Hard">("All");

    useEffect(() => {
        const stored = localStorage.getItem("devtrack_completed_questions");
        if (stored) setCompleted(JSON.parse(stored));
    }, []);

    const filteredQuestions = useMemo(() => {
        let qs = QUESTION_BANK.filter((q) => !completed.includes(q.id));
        if (filter !== "All") qs = qs.filter((q) => q.difficulty === filter);
        // Shuffle for randomness
        return qs.sort(() => Math.random() - 0.5).slice(0, 6);
    }, [completed, filter]);

    const handleComplete = async (q: Question) => {
        setSaving(q.id);
        try {
            const res = await fetch("/api/entries", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    title: `Solved: ${q.title}`,
                    category: "DSA",
                    timeSpent: 30,
                    problemsSolved: 1,
                    notes: `Completed ${q.difficulty} problem on ${q.platform}. Topics: ${q.topics.join(", ")}`,
                    date: new Date().toISOString().split("T")[0],
                }),
            });
            const data = await res.json();
            if (data.success) {
                const newCompleted = [...completed, q.id];
                setCompleted(newCompleted);
                localStorage.setItem(
                    "devtrack_completed_questions",
                    JSON.stringify(newCompleted)
                );
            }
        } catch (err) {
            console.error(err);
        } finally {
            setSaving(null);
        }
    };

    const getDifficultyColor = (d: string) => {
        if (d === "Easy") return "badge-easy";
        if (d === "Medium") return "badge-medium";
        return "badge-hard";
    };

    return (
        <div className="space-y-8 animate-fade-in">
            <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                    Practice
                </h1>
                <p className="text-gray-500 dark:text-gray-400 mt-1">
                    Suggested problems to level up your skills.
                </p>
            </div>

            {/* Progress bar */}
            <div className="glass-card p-5">
                <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
                        Progress
                    </span>
                    <span className="text-sm font-bold text-indigo-500">
                        {completed.length}/{QUESTION_BANK.length} completed
                    </span>
                </div>
                <div className="w-full h-3 bg-gray-100 dark:bg-slate-700 rounded-full overflow-hidden">
                    <div
                        className="h-full gradient-bg rounded-full transition-all duration-500"
                        style={{
                            width: `${(completed.length / QUESTION_BANK.length) * 100}%`,
                        }}
                    />
                </div>
            </div>

            {/* Filters */}
            <div className="flex items-center space-x-2">
                {(["All", "Easy", "Medium", "Hard"] as const).map((f) => (
                    <button
                        key={f}
                        onClick={() => setFilter(f)}
                        className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${filter === f
                            ? "gradient-bg text-white shadow-lg shadow-indigo-500/25"
                            : "glass-card text-gray-600 dark:text-gray-300 hover:shadow-md"
                            }`}
                    >
                        {f}
                    </button>
                ))}
                <button
                    onClick={() => setFilter(filter)}
                    className="p-2 rounded-xl glass-card text-gray-400 hover:text-indigo-500 transition-colors ml-auto"
                    title="Shuffle"
                >
                    <RefreshCw size={16} />
                </button>
            </div>

            {/* Question Cards */}
            {filteredQuestions.length === 0 ? (
                <div className="glass-card p-12 text-center">
                    <div className="text-5xl mb-4">🎉</div>
                    <p className="text-lg font-semibold text-gray-800 dark:text-white">
                        {filter === "All"
                            ? "You've completed all questions!"
                            : `No ${filter} questions remaining!`}
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredQuestions.map((q) => (
                        <div
                            key={q.id}
                            className="glass-card-hover p-5 flex flex-col justify-between"
                        >
                            <div>
                                <div className="flex items-center justify-between mb-3">
                                    <span className={getDifficultyColor(q.difficulty)}>
                                        {q.difficulty}
                                    </span>
                                    <span className="text-xs text-gray-400 dark:text-gray-500 font-medium">
                                        {q.platform}
                                    </span>
                                </div>
                                <h3 className="font-bold text-gray-800 dark:text-white mb-3 line-clamp-2">
                                    {q.title}
                                </h3>
                                <div className="flex flex-wrap gap-1.5 mb-4">
                                    {q.topics.map((t) => (
                                        <span
                                            key={t}
                                            className="px-2 py-0.5 bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-gray-300 rounded-md text-xs"
                                        >
                                            {t}
                                        </span>
                                    ))}
                                </div>
                            </div>
                            <div className="flex space-x-2">
                                <a
                                    href={q.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex-1 btn-primary text-center text-sm flex items-center justify-center space-x-1"
                                >
                                    <span>Open</span>
                                    <ExternalLink size={12} />
                                </a>
                                <button
                                    onClick={() => handleComplete(q)}
                                    disabled={saving === q.id}
                                    className="flex-1 flex items-center justify-center space-x-1 px-3 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl text-sm font-medium transition-all disabled:opacity-50 active:scale-95"
                                >
                                    <CheckCircle size={12} />
                                    <span>{saving === q.id ? "..." : "Done"}</span>
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
