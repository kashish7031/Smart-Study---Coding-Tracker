"use client";

import { useMemo } from "react";
import { Entry } from "@/types";

interface HeatmapProps {
    entries: Entry[];
}

export default function Heatmap({ entries }: HeatmapProps) {
    const heatmapData = useMemo(() => {
        const today = new Date();
        const days = 365;
        const map: Record<string, number> = {};

        // Count activity per day (problems + time score)
        entries.forEach((entry) => {
            const dateStr = new Date(entry.date).toISOString().split("T")[0];
            const score = (entry.problemsSolved || 0) + Math.floor((entry.timeSpent || 0) / 30);
            map[dateStr] = (map[dateStr] || 0) + score;
        });

        // Generate grid for past 365 days
        const grid = [];
        for (let i = days - 1; i >= 0; i--) {
            const d = new Date(today);
            d.setDate(d.getDate() - i);
            const key = d.toISOString().split("T")[0];
            grid.push({
                date: key,
                count: map[key] || 0,
                dayOfWeek: d.getDay(),
                month: d.getMonth(),
            });
        }
        return grid;
    }, [entries]);

    const getColor = (count: number) => {
        if (count === 0) return "bg-gray-100 dark:bg-slate-700/50";
        if (count <= 2) return "bg-emerald-200 dark:bg-emerald-900/60";
        if (count <= 5) return "bg-emerald-400 dark:bg-emerald-700";
        if (count <= 10) return "bg-emerald-500 dark:bg-emerald-600";
        return "bg-emerald-600 dark:bg-emerald-500";
    };

    const months = [
        "Jan", "Feb", "Mar", "Apr", "May", "Jun",
        "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
    ];

    // Get month labels
    const monthLabels = useMemo(() => {
        const labels: { month: string; index: number }[] = [];
        let lastMonth = -1;
        heatmapData.forEach((d, i) => {
            if (d.month !== lastMonth) {
                labels.push({ month: months[d.month], index: i });
                lastMonth = d.month;
            }
        });
        return labels;
    }, [heatmapData]);

    // Group by weeks
    const weeks = useMemo(() => {
        const w: typeof heatmapData[] = [];
        let currentWeek: typeof heatmapData = [];
        heatmapData.forEach((day) => {
            if (day.dayOfWeek === 0 && currentWeek.length > 0) {
                w.push(currentWeek);
                currentWeek = [];
            }
            currentWeek.push(day);
        });
        if (currentWeek.length > 0) w.push(currentWeek);
        return w;
    }, [heatmapData]);

    return (
        <div className="glass-card p-6">
            <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-4">
                Activity Heatmap
            </h3>
            <div className="overflow-x-auto">
                <div className="inline-flex flex-col gap-[3px] min-w-fit">
                    {/* Month labels */}
                    <div className="flex gap-[3px] ml-8 mb-1">
                        {weeks.map((week, wi) => {
                            const label = monthLabels.find(
                                (m) =>
                                    heatmapData.indexOf(week[0]) <= m.index &&
                                    m.index < heatmapData.indexOf(week[0]) + 7
                            );
                            return (
                                <div key={wi} className="w-[13px] text-center">
                                    {label && (
                                        <span className="text-[10px] text-gray-400 dark:text-gray-500">
                                            {label.month}
                                        </span>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                    {/* Grid */}
                    <div className="flex gap-0">
                        {/* Day labels */}
                        <div className="flex flex-col gap-[3px] mr-2 pt-0">
                            {["", "Mon", "", "Wed", "", "Fri", ""].map((d, i) => (
                                <div
                                    key={i}
                                    className="h-[13px] text-[10px] text-gray-400 dark:text-gray-500 leading-[13px]"
                                >
                                    {d}
                                </div>
                            ))}
                        </div>
                        {/* Squares */}
                        <div className="flex gap-[3px]">
                            {weeks.map((week, wi) => (
                                <div key={wi} className="flex flex-col gap-[3px]">
                                    {Array.from({ length: 7 }).map((_, di) => {
                                        const day = week.find((d) => d.dayOfWeek === di);
                                        return (
                                            <div
                                                key={di}
                                                className={`w-[13px] h-[13px] rounded-[3px] transition-colors ${day ? getColor(day.count) : "bg-transparent"
                                                    }`}
                                                title={day ? `${day.date}: ${day.count} activity` : ""}
                                            />
                                        );
                                    })}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
            {/* Legend */}
            <div className="flex items-center justify-end gap-1 mt-3">
                <span className="text-xs text-gray-400 dark:text-gray-500 mr-1">Less</span>
                {[0, 2, 5, 10, 15].map((level) => (
                    <div
                        key={level}
                        className={`w-[13px] h-[13px] rounded-[3px] ${getColor(level)}`}
                    />
                ))}
                <span className="text-xs text-gray-400 dark:text-gray-500 ml-1">More</span>
            </div>
        </div>
    );
}
