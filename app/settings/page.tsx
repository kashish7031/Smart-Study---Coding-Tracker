"use client";

import { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import {
    Sun,
    Moon,
    Trash2,
    Volume2,
    VolumeX,
    AlertTriangle,
} from "lucide-react";

export default function SettingsPage() {
    const { theme, setTheme } = useTheme();
    const [mounted, setMounted] = useState(false);
    const [timerSound, setTimerSound] = useState(true);
    const [showConfirm, setShowConfirm] = useState(false);
    const [deleting, setDeleting] = useState(false);
    const [deleted, setDeleted] = useState(false);

    useEffect(() => {
        setMounted(true);
        const stored = localStorage.getItem("devtrack_timer_sound");
        if (stored !== null) setTimerSound(JSON.parse(stored));
    }, []);

    const handleToggleSound = () => {
        const newVal = !timerSound;
        setTimerSound(newVal);
        localStorage.setItem("devtrack_timer_sound", JSON.stringify(newVal));
    };

    const handleResetData = async () => {
        setDeleting(true);
        try {
            const res = await fetch("/api/settings/reset", { method: "DELETE" });
            const data = await res.json();
            if (data.success) {
                setDeleted(true);
                localStorage.removeItem("devtrack_timer");
                localStorage.removeItem("devtrack_completed_questions");
                setShowConfirm(false);
                setTimeout(() => setDeleted(false), 3000);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setDeleting(false);
        }
    };

    if (!mounted) return null;

    return (
        <div className="space-y-8 animate-fade-in max-w-2xl">
            <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                    Settings
                </h1>
                <p className="text-gray-500 dark:text-gray-400 mt-1">
                    Customize your DevTrack experience.
                </p>
            </div>

            {/* Appearance */}
            <div className="glass-card p-6">
                <h2 className="text-lg font-bold text-gray-800 dark:text-white mb-4">
                    Appearance
                </h2>
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                        {theme === "dark" ? (
                            <Moon size={20} className="text-indigo-400" />
                        ) : (
                            <Sun size={20} className="text-amber-500" />
                        )}
                        <div>
                            <p className="font-medium text-gray-800 dark:text-white">
                                Dark Mode
                            </p>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                Toggle between light and dark theme
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                        className={`relative w-14 h-7 rounded-full transition-colors duration-300 ${theme === "dark" ? "bg-indigo-500" : "bg-gray-300"
                            }`}
                    >
                        <div
                            className={`absolute top-0.5 w-6 h-6 bg-white rounded-full shadow-md transition-transform duration-300 ${theme === "dark" ? "translate-x-7" : "translate-x-0.5"
                                }`}
                        />
                    </button>
                </div>
            </div>

            {/* Timer Sound */}
            <div className="glass-card p-6">
                <h2 className="text-lg font-bold text-gray-800 dark:text-white mb-4">
                    Timer
                </h2>
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                        {timerSound ? (
                            <Volume2 size={20} className="text-emerald-500" />
                        ) : (
                            <VolumeX size={20} className="text-gray-400" />
                        )}
                        <div>
                            <p className="font-medium text-gray-800 dark:text-white">
                                Timer Sound
                            </p>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                Play sound when timer session is saved
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={handleToggleSound}
                        className={`relative w-14 h-7 rounded-full transition-colors duration-300 ${timerSound ? "bg-emerald-500" : "bg-gray-300 dark:bg-slate-600"
                            }`}
                    >
                        <div
                            className={`absolute top-0.5 w-6 h-6 bg-white rounded-full shadow-md transition-transform duration-300 ${timerSound ? "translate-x-7" : "translate-x-0.5"
                                }`}
                        />
                    </button>
                </div>
            </div>

            {/* Danger Zone */}
            <div className="glass-card p-6 border-red-200 dark:border-red-800/30">
                <h2 className="text-lg font-bold text-red-600 dark:text-red-400 mb-4">
                    Danger Zone
                </h2>
                {deleted && (
                    <div className="bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 p-3 rounded-xl text-sm mb-4">
                        All data has been reset successfully.
                    </div>
                )}
                {!showConfirm ? (
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                            <Trash2 size={20} className="text-red-500" />
                            <div>
                                <p className="font-medium text-gray-800 dark:text-white">
                                    Reset All Data
                                </p>
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                    Delete all entries and start fresh
                                </p>
                            </div>
                        </div>
                        <button
                            onClick={() => setShowConfirm(true)}
                            className="px-4 py-2 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-xl text-sm font-medium hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors"
                        >
                            Reset
                        </button>
                    </div>
                ) : (
                    <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-xl">
                        <div className="flex items-center space-x-2 mb-3">
                            <AlertTriangle size={18} className="text-red-500" />
                            <p className="font-medium text-red-700 dark:text-red-400">
                                This action is irreversible!
                            </p>
                        </div>
                        <p className="text-sm text-red-600 dark:text-red-400 mb-4">
                            All your entries, sessions, and progress will be permanently
                            deleted.
                        </p>
                        <div className="flex space-x-3">
                            <button
                                onClick={() => setShowConfirm(false)}
                                className="btn-ghost text-sm"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleResetData}
                                disabled={deleting}
                                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl text-sm font-medium transition-colors disabled:opacity-50"
                            >
                                {deleting ? "Deleting..." : "Yes, Delete Everything"}
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
