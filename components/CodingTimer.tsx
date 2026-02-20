"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { Play, Pause, RotateCcw, Save, X, Timer, ChevronUp, ChevronDown } from "lucide-react";

export default function CodingTimer() {
    const [isOpen, setIsOpen] = useState(false);
    const [isRunning, setIsRunning] = useState(false);
    const [elapsed, setElapsed] = useState(0); // seconds
    const [saving, setSaving] = useState(false);
    const [saved, setSaved] = useState(false);
    const intervalRef = useRef<NodeJS.Timeout | null>(null);

    // Restore from localStorage
    useEffect(() => {
        const stored = localStorage.getItem("devtrack_timer");
        if (stored) {
            const { elapsed: e, startedAt, running } = JSON.parse(stored);
            if (running && startedAt) {
                const diff = Math.floor((Date.now() - startedAt) / 1000);
                setElapsed(e + diff);
                setIsRunning(true);
            } else {
                setElapsed(e || 0);
            }
        }
    }, []);

    // Timer tick
    useEffect(() => {
        if (isRunning) {
            intervalRef.current = setInterval(() => {
                setElapsed((prev) => prev + 1);
            }, 1000);
        } else if (intervalRef.current) {
            clearInterval(intervalRef.current);
        }
        return () => {
            if (intervalRef.current) clearInterval(intervalRef.current);
        };
    }, [isRunning]);

    // Persist to localStorage
    useEffect(() => {
        localStorage.setItem(
            "devtrack_timer",
            JSON.stringify({
                elapsed: isRunning ? elapsed : elapsed,
                startedAt: isRunning ? Date.now() : null,
                running: isRunning,
            })
        );
    }, [elapsed, isRunning]);

    const formatTime = (secs: number) => {
        const h = Math.floor(secs / 3600).toString().padStart(2, "0");
        const m = Math.floor((secs % 3600) / 60).toString().padStart(2, "0");
        const s = (secs % 60).toString().padStart(2, "0");
        return `${h}:${m}:${s}`;
    };

    const handleStart = () => setIsRunning(true);
    const handlePause = () => setIsRunning(false);
    const handleReset = () => {
        setIsRunning(false);
        setElapsed(0);
        setSaved(false);
        localStorage.removeItem("devtrack_timer");
    };

    const handleSave = async () => {
        if (elapsed < 1) return;
        setSaving(true);
        try {
            const res = await fetch("/api/entries", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    title: "Coding Session",
                    category: "DSA",
                    timeSpent: Math.round(elapsed / 60),
                    problemsSolved: 0,
                    notes: `Timer session: ${formatTime(elapsed)}`,
                    date: new Date().toISOString().split("T")[0],
                }),
            });
            const data = await res.json();
            if (data.success) {
                setSaved(true);
                setIsRunning(false);
                setElapsed(0);
                localStorage.removeItem("devtrack_timer");
                setTimeout(() => setSaved(false), 3000);
            }
        } catch (err) {
            console.error("Failed to save session", err);
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="fixed bottom-6 right-6 z-50 hidden md:block">
            {/* Collapsed pill */}
            {!isOpen && (
                <button
                    onClick={() => setIsOpen(true)}
                    className={`flex items-center space-x-2 px-4 py-3 rounded-2xl shadow-2xl transition-all duration-300 hover:scale-105 ${isRunning
                            ? "gradient-bg text-white shadow-indigo-500/40 animate-pulse"
                            : "glass-card text-gray-700 dark:text-gray-200"
                        }`}
                >
                    <Timer size={18} />
                    <span className="font-mono font-bold text-sm">{formatTime(elapsed)}</span>
                    <ChevronUp size={14} />
                </button>
            )}

            {/* Expanded timer */}
            {isOpen && (
                <div className="glass-card p-5 w-72 shadow-2xl animate-scale-in">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-2">
                            <div className="w-8 h-8 gradient-bg rounded-lg flex items-center justify-center">
                                <Timer size={16} className="text-white" />
                            </div>
                            <span className="font-bold text-sm text-gray-800 dark:text-white">
                                Coding Timer
                            </span>
                        </div>
                        <button
                            onClick={() => setIsOpen(false)}
                            className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors"
                        >
                            <ChevronDown size={16} className="text-gray-400" />
                        </button>
                    </div>

                    {/* Time display */}
                    <div className="text-center mb-5">
                        <div
                            className={`font-mono text-4xl font-bold tracking-wider ${isRunning ? "gradient-text" : "text-gray-800 dark:text-white"
                                }`}
                        >
                            {formatTime(elapsed)}
                        </div>
                        {isRunning && (
                            <div className="flex items-center justify-center mt-2 space-x-1">
                                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                                <span className="text-xs text-green-500 font-medium">Recording</span>
                            </div>
                        )}
                    </div>

                    {/* Controls */}
                    <div className="flex items-center justify-center space-x-2 mb-3">
                        {!isRunning ? (
                            <button
                                onClick={handleStart}
                                className="flex items-center space-x-1.5 px-4 py-2 gradient-bg text-white rounded-xl text-sm font-medium hover:shadow-lg hover:shadow-indigo-500/25 transition-all active:scale-95"
                            >
                                <Play size={14} />
                                <span>{elapsed > 0 ? "Resume" : "Start"}</span>
                            </button>
                        ) : (
                            <button
                                onClick={handlePause}
                                className="flex items-center space-x-1.5 px-4 py-2 bg-amber-500 text-white rounded-xl text-sm font-medium hover:bg-amber-600 transition-all active:scale-95"
                            >
                                <Pause size={14} />
                                <span>Pause</span>
                            </button>
                        )}
                        <button
                            onClick={handleReset}
                            className="p-2 rounded-xl text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors"
                            title="Reset"
                        >
                            <RotateCcw size={16} />
                        </button>
                    </div>

                    {/* Save button */}
                    {elapsed > 0 && !isRunning && (
                        <button
                            onClick={handleSave}
                            disabled={saving}
                            className="w-full flex items-center justify-center space-x-2 px-4 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl text-sm font-medium transition-all disabled:opacity-50 active:scale-95"
                        >
                            <Save size={14} />
                            <span>{saving ? "Saving..." : saved ? "Saved! ✓" : "Save Session"}</span>
                        </button>
                    )}

                    {saved && (
                        <p className="text-center text-xs text-emerald-500 mt-2 font-medium">
                            Session saved to your entries! 🎉
                        </p>
                    )}
                </div>
            )}
        </div>
    );
}
