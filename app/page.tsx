"use client";

import { useEffect, useState, useMemo } from "react";
import { Entry } from "@/types";
import {
    Code,
    Clock,
    BookOpen,
    Flame,
    Trophy,
    TrendingUp,
    ArrowRight,
} from "lucide-react";
import Link from "next/link";
import Heatmap from "@/components/Heatmap";

const motivationalMessages = [
    { min: 0, messages: ["Start your coding journey today! 🚀", "Every expert was once a beginner 💡"] },
    { min: 1, messages: ["Great start! Keep it up! 🌟", "Consistency is key! 💪"] },
    { min: 3, messages: ["You're on fire! 🔥", "Building momentum! 💥"] },
    { min: 7, messages: ["Incredible streak! 🏆", "Unstoppable! 🚀"] },
    { min: 14, messages: ["Legendary! You're a machine! ⚡", "Two weeks strong! 🏅"] },
    { min: 30, messages: ["30-day warrior! You're elite! 👑", "Consistency beats talent! 🎯"] },
];

function getMotivation(streak: number) {
    let msg = motivationalMessages[0].messages;
    for (const m of motivationalMessages) {
        if (streak >= m.min) msg = m.messages;
    }
    return msg[Math.floor(Math.random() * msg.length)];
}

function calculateStreaks(entries: Entry[]) {
    if (entries.length === 0) return { current: 0, best: 0 };

    const dates = new Set(
        entries.map((e) => new Date(e.date).toISOString().split("T")[0])
    );
    const sortedDates = Array.from(dates).sort().reverse();

    // Current streak
    let current = 0;
    const today = new Date();
    const checkDate = new Date(today);

    for (let i = 0; i < 366; i++) {
        const key = checkDate.toISOString().split("T")[0];
        if (dates.has(key)) {
            current++;
        } else if (i > 0) {
            break;
        }
        checkDate.setDate(checkDate.getDate() - 1);
    }

    // Best streak
    let best = 0;
    let tempStreak = 1;
    const allSortedDates = Array.from(dates).sort();
    for (let i = 1; i < allSortedDates.length; i++) {
        const prev = new Date(allSortedDates[i - 1]);
        const curr = new Date(allSortedDates[i]);
        const diff = (curr.getTime() - prev.getTime()) / (1000 * 60 * 60 * 24);
        if (diff === 1) {
            tempStreak++;
        } else {
            best = Math.max(best, tempStreak);
            tempStreak = 1;
        }
    }
    best = Math.max(best, tempStreak, current);

    return { current, best };
}

export default function Dashboard() {
    const [entries, setEntries] = useState<Entry[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const res = await fetch("/api/entries");
            const data = await res.json();
            if (data.success) {
                setEntries(data.data);
            }
        } catch (error) {
            console.error("Failed to fetch", error);
        } finally {
            setLoading(false);
        }
    };

    const stats = useMemo(() => {
        const totalProblems = entries.reduce(
            (acc, curr) => acc + (curr.problemsSolved || 0),
            0
        );
        const totalTime = entries.reduce(
            (acc, curr) => acc + (curr.timeSpent || 0),
            0
        );
        const streaks = calculateStreaks(entries);
        return {
            totalProblems,
            totalHours: Math.round((totalTime / 60) * 10) / 10,
            totalEntries: entries.length,
            currentStreak: streaks.current,
            bestStreak: streaks.best,
        };
    }, [entries]);

    const motivation = useMemo(
        () => getMotivation(stats.currentStreak),
        [stats.currentStreak]
    );

    const recentEntries = useMemo(() => entries.slice(0, 5), [entries]);

    if (loading) {
        return (
            <div className="space-y-6 animate-pulse">
                <div className="h-8 w-48 skeleton" />
                <div className="h-4 w-72 skeleton" />
                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
                    {[...Array(5)].map((_, i) => (
                        <div key={i} className="h-32 skeleton rounded-2xl" />
                    ))}
                </div>
                <div className="h-48 skeleton rounded-2xl" />
            </div>
        );
    }

    const statCards = [
        {
            label: "Problems Solved",
            value: stats.totalProblems,
            icon: Code,
            gradient: "from-indigo-500 to-blue-500",
            shadow: "shadow-indigo-500/20",
        },
        {
            label: "Study Hours",
            value: stats.totalHours,
            icon: Clock,
            gradient: "from-purple-500 to-pink-500",
            shadow: "shadow-purple-500/20",
        },
        {
            label: "Total Sessions",
            value: stats.totalEntries,
            icon: BookOpen,
            gradient: "from-emerald-500 to-teal-500",
            shadow: "shadow-emerald-500/20",
        },
        {
            label: "Current Streak",
            value: `${stats.currentStreak}d`,
            icon: Flame,
            gradient: "from-orange-500 to-red-500",
            shadow: "shadow-orange-500/20",
        },
        {
            label: "Best Streak",
            value: `${stats.bestStreak}d`,
            icon: Trophy,
            gradient: "from-amber-500 to-yellow-500",
            shadow: "shadow-amber-500/20",
        },
    ];

    return (
        <div className="space-y-8 animate-fade-in">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                    Dashboard
                </h1>
                <p className="text-gray-500 dark:text-gray-400 mt-1">{motivation}</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                {statCards.map((card) => {
                    const Icon = card.icon;
                    return (
                        <div
                            key={card.label}
                            className={`glass-card p-5 hover:shadow-xl ${card.shadow} transition-all duration-300 hover:scale-[1.03]`}
                        >
                            <div
                                className={`w-10 h-10 rounded-xl bg-gradient-to-br ${card.gradient} flex items-center justify-center mb-3 shadow-lg ${card.shadow}`}
                            >
                                <Icon size={20} className="text-white" />
                            </div>
                            <p className="text-2xl font-bold text-gray-900 dark:text-white">
                                {card.value}
                            </p>
                            <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mt-1">
                                {card.label}
                            </p>
                        </div>
                    );
                })}
            </div>

            {/* Heatmap */}
            <Heatmap entries={entries} />

            {/* Recent Activity */}
            <div>
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                        Recent Activity
                    </h2>
                    <Link
                        href="/entries"
                        className="flex items-center space-x-1 text-indigo-500 hover:text-indigo-400 text-sm font-medium transition-colors"
                    >
                        <span>View All</span>
                        <ArrowRight size={14} />
                    </Link>
                </div>

                {recentEntries.length === 0 ? (
                    <div className="glass-card p-12 text-center">
                        <div className="text-5xl mb-4">📚</div>
                        <p className="text-gray-500 dark:text-gray-400 mb-4">
                            No activity yet. Start your journey!
                        </p>
                        <Link href="/add" className="btn-primary inline-flex items-center space-x-2">
                            <span>Add First Entry</span>
                            <ArrowRight size={16} />
                        </Link>
                    </div>
                ) : (
                    <div className="glass-card overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="min-w-full">
                                <thead>
                                    <tr className="border-b border-gray-100 dark:border-slate-700">
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                            Title
                                        </th>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                            Category
                                        </th>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                            Date
                                        </th>
                                        <th className="px-6 py-4 text-right text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                            Problems
                                        </th>
                                        <th className="px-6 py-4 text-right text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                            Time
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-50 dark:divide-slate-700/50">
                                    {recentEntries.map((entry) => (
                                        <tr
                                            key={entry._id}
                                            className="hover:bg-gray-50/50 dark:hover:bg-slate-700/30 transition-colors"
                                        >
                                            <td className="px-6 py-4">
                                                <span className="text-sm font-medium text-gray-900 dark:text-white">
                                                    {entry.title}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="badge bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-400">
                                                    {entry.category}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                                                {new Date(entry.date).toLocaleDateString()}
                                            </td>
                                            <td className="px-6 py-4 text-right text-sm font-medium text-gray-900 dark:text-white">
                                                {entry.problemsSolved}
                                            </td>
                                            <td className="px-6 py-4 text-right text-sm text-gray-500 dark:text-gray-400">
                                                {entry.timeSpent}m
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
