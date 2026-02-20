"use client";

import { useEffect, useState, useMemo } from "react";
import { Entry } from "@/types";
import {
    LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
    XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, Area, AreaChart,
} from "recharts";
import { TrendingUp, BarChart3, PieChartIcon, Calendar } from "lucide-react";

const COLORS = [
    "#6366f1", "#8b5cf6", "#ec4899", "#14b8a6",
    "#f59e0b", "#ef4444", "#06b6d4", "#84cc16",
];

export default function AnalyticsPage() {
    const [entries, setEntries] = useState<Entry[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchEntries = async () => {
            try {
                const res = await fetch("/api/entries");
                const data = await res.json();
                if (data.success) setEntries(data.data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchEntries();
    }, []);

    const dailyProblems = useMemo(() => {
        const map: Record<string, number> = {};
        entries.forEach((e) => {
            const d = new Date(e.date).toLocaleDateString("en-US", { month: "short", day: "numeric" });
            map[d] = (map[d] || 0) + (e.problemsSolved || 0);
        });
        return Object.entries(map)
            .slice(-14)
            .map(([date, problems]) => ({ date, problems }));
    }, [entries]);

    const dailyTime = useMemo(() => {
        const map: Record<string, number> = {};
        entries.forEach((e) => {
            const d = new Date(e.date).toLocaleDateString("en-US", { month: "short", day: "numeric" });
            map[d] = (map[d] || 0) + Math.round((e.timeSpent || 0) / 60 * 10) / 10;
        });
        return Object.entries(map)
            .slice(-14)
            .map(([date, hours]) => ({ date, hours }));
    }, [entries]);

    const categoryData = useMemo(() => {
        const map: Record<string, number> = {};
        entries.forEach((e) => {
            map[e.category] = (map[e.category] || 0) + 1;
        });
        return Object.entries(map).map(([name, value]) => ({ name, value }));
    }, [entries]);

    const weeklyProgress = useMemo(() => {
        const weeks: Record<string, { problems: number; hours: number }> = {};
        entries.forEach((e) => {
            const d = new Date(e.date);
            const weekStart = new Date(d);
            weekStart.setDate(d.getDate() - d.getDay());
            const key = weekStart.toLocaleDateString("en-US", { month: "short", day: "numeric" });
            if (!weeks[key]) weeks[key] = { problems: 0, hours: 0 };
            weeks[key].problems += e.problemsSolved || 0;
            weeks[key].hours += Math.round((e.timeSpent || 0) / 60 * 10) / 10;
        });
        return Object.entries(weeks)
            .slice(-8)
            .map(([week, data]) => ({ week, ...data }));
    }, [entries]);

    if (loading) {
        return (
            <div className="space-y-6 animate-pulse">
                <div className="h-8 w-40 skeleton" />
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {[...Array(4)].map((_, i) => (
                        <div key={i} className="h-80 skeleton rounded-2xl" />
                    ))}
                </div>
            </div>
        );
    }

    if (entries.length === 0) {
        return (
            <div className="animate-fade-in">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Analytics</h1>
                <div className="glass-card p-12 text-center mt-8">
                    <div className="text-5xl mb-4">📊</div>
                    <p className="text-gray-500 dark:text-gray-400">
                        Add some entries to see your analytics charts!
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-fade-in">
            <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                    Analytics
                </h1>
                <p className="text-gray-500 dark:text-gray-400 mt-1">
                    Visualize your coding journey.
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Problems per Day */}
                <div className="glass-card p-6">
                    <div className="flex items-center space-x-2 mb-6">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-blue-500 flex items-center justify-center">
                            <TrendingUp size={16} className="text-white" />
                        </div>
                        <h3 className="font-bold text-gray-800 dark:text-white">
                            Problems Solved
                        </h3>
                    </div>
                    <ResponsiveContainer width="100%" height={250}>
                        <AreaChart data={dailyProblems}>
                            <defs>
                                <linearGradient id="colorProblems" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb40" />
                            <XAxis dataKey="date" tick={{ fontSize: 11 }} stroke="#9ca3af" />
                            <YAxis tick={{ fontSize: 11 }} stroke="#9ca3af" />
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: "rgba(30,41,59,0.9)",
                                    border: "none",
                                    borderRadius: "12px",
                                    color: "#fff",
                                    fontSize: "12px",
                                }}
                            />
                            <Area
                                type="monotone"
                                dataKey="problems"
                                stroke="#6366f1"
                                strokeWidth={2}
                                fill="url(#colorProblems)"
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>

                {/* Time per Day */}
                <div className="glass-card p-6">
                    <div className="flex items-center space-x-2 mb-6">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                            <BarChart3 size={16} className="text-white" />
                        </div>
                        <h3 className="font-bold text-gray-800 dark:text-white">
                            Time Spent (hrs)
                        </h3>
                    </div>
                    <ResponsiveContainer width="100%" height={250}>
                        <BarChart data={dailyTime}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb40" />
                            <XAxis dataKey="date" tick={{ fontSize: 11 }} stroke="#9ca3af" />
                            <YAxis tick={{ fontSize: 11 }} stroke="#9ca3af" />
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: "rgba(30,41,59,0.9)",
                                    border: "none",
                                    borderRadius: "12px",
                                    color: "#fff",
                                    fontSize: "12px",
                                }}
                            />
                            <Bar dataKey="hours" fill="#8b5cf6" radius={[8, 8, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                {/* Category Distribution */}
                <div className="glass-card p-6">
                    <div className="flex items-center space-x-2 mb-6">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center">
                            <PieChartIcon size={16} className="text-white" />
                        </div>
                        <h3 className="font-bold text-gray-800 dark:text-white">
                            Category Distribution
                        </h3>
                    </div>
                    <ResponsiveContainer width="100%" height={250}>
                        <PieChart>
                            <Pie
                                data={categoryData}
                                cx="50%"
                                cy="50%"
                                innerRadius={60}
                                outerRadius={100}
                                paddingAngle={5}
                                dataKey="value"
                            >
                                {categoryData.map((_, index) => (
                                    <Cell
                                        key={`cell-${index}`}
                                        fill={COLORS[index % COLORS.length]}
                                    />
                                ))}
                            </Pie>
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: "rgba(30,41,59,0.9)",
                                    border: "none",
                                    borderRadius: "12px",
                                    color: "#fff",
                                    fontSize: "12px",
                                }}
                            />
                            <Legend
                                formatter={(value) => (
                                    <span className="text-sm text-gray-600 dark:text-gray-300">
                                        {value}
                                    </span>
                                )}
                            />
                        </PieChart>
                    </ResponsiveContainer>
                </div>

                {/* Weekly Progress */}
                <div className="glass-card p-6">
                    <div className="flex items-center space-x-2 mb-6">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center">
                            <Calendar size={16} className="text-white" />
                        </div>
                        <h3 className="font-bold text-gray-800 dark:text-white">
                            Weekly Progress
                        </h3>
                    </div>
                    <ResponsiveContainer width="100%" height={250}>
                        <BarChart data={weeklyProgress}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb40" />
                            <XAxis dataKey="week" tick={{ fontSize: 11 }} stroke="#9ca3af" />
                            <YAxis tick={{ fontSize: 11 }} stroke="#9ca3af" />
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: "rgba(30,41,59,0.9)",
                                    border: "none",
                                    borderRadius: "12px",
                                    color: "#fff",
                                    fontSize: "12px",
                                }}
                            />
                            <Bar dataKey="problems" fill="#6366f1" name="Problems" radius={[4, 4, 0, 0]} />
                            <Bar dataKey="hours" fill="#ec4899" name="Hours" radius={[4, 4, 0, 0]} />
                            <Legend
                                formatter={(value) => (
                                    <span className="text-sm text-gray-600 dark:text-gray-300">
                                        {value}
                                    </span>
                                )}
                            />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
}
