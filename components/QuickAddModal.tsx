"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, X } from "lucide-react";

export default function QuickAddModal() {
    const [isOpen, setIsOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const router = useRouter();

    const [formData, setFormData] = useState({
        title: "",
        category: "DSA",
        timeSpent: 30,
        problemsSolved: 1,
        notes: "",
        date: new Date().toISOString().split("T")[0],
    });

    const categories = [
        "DSA",
        "Development",
        "System Design",
        "Interview Prep",
        "Learning",
    ];

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await fetch("/api/entries", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });
            const data = await res.json();
            if (data.success) {
                setSuccess(true);
                setTimeout(() => {
                    setIsOpen(false);
                    setSuccess(false);
                    setFormData({
                        title: "",
                        category: "DSA",
                        timeSpent: 30,
                        problemsSolved: 1,
                        notes: "",
                        date: new Date().toISOString().split("T")[0],
                    });
                    router.refresh();
                }, 1500);
            }
        } catch (err) {
            console.error("Failed to add entry", err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            {/* Floating button */}
            <button
                onClick={() => setIsOpen(true)}
                className="fixed bottom-6 right-24 md:bottom-6 md:right-[340px] z-50 w-14 h-14 gradient-bg text-white rounded-2xl shadow-2xl shadow-indigo-500/30 flex items-center justify-center hover:scale-110 transition-all duration-200 active:scale-95 group"
            >
                <Plus
                    size={24}
                    className="group-hover:rotate-90 transition-transform duration-300"
                />
            </button>

            {/* Modal overlay */}
            {isOpen && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
                    <div
                        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
                        onClick={() => setIsOpen(false)}
                    />
                    <div className="relative glass-card p-6 w-full max-w-md animate-scale-in">
                        {/* Header */}
                        <div className="flex items-center justify-between mb-5">
                            <h2 className="text-lg font-bold text-gray-800 dark:text-white">
                                Quick Add Entry
                            </h2>
                            <button
                                onClick={() => setIsOpen(false)}
                                className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors"
                            >
                                <X size={18} className="text-gray-400" />
                            </button>
                        </div>

                        {success ? (
                            <div className="text-center py-8">
                                <div className="text-4xl mb-3">🎉</div>
                                <p className="text-lg font-semibold text-gray-800 dark:text-white">
                                    Entry Added!
                                </p>
                                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                                    Keep up the great work!
                                </p>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <input
                                    type="text"
                                    required
                                    placeholder="What did you work on?"
                                    className="input-field"
                                    value={formData.title}
                                    onChange={(e) =>
                                        setFormData({ ...formData, title: e.target.value })
                                    }
                                />
                                <div className="grid grid-cols-2 gap-3">
                                    <select
                                        className="input-field"
                                        value={formData.category}
                                        onChange={(e) =>
                                            setFormData({ ...formData, category: e.target.value })
                                        }
                                    >
                                        {categories.map((c) => (
                                            <option key={c} value={c}>
                                                {c}
                                            </option>
                                        ))}
                                    </select>
                                    <input
                                        type="date"
                                        className="input-field"
                                        value={formData.date}
                                        onChange={(e) =>
                                            setFormData({ ...formData, date: e.target.value })
                                        }
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
                                            Time (mins)
                                        </label>
                                        <input
                                            type="number"
                                            min="0"
                                            className="input-field"
                                            value={formData.timeSpent}
                                            onChange={(e) =>
                                                setFormData({
                                                    ...formData,
                                                    timeSpent: parseInt(e.target.value) || 0,
                                                })
                                            }
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
                                            Problems
                                        </label>
                                        <input
                                            type="number"
                                            min="0"
                                            className="input-field"
                                            value={formData.problemsSolved}
                                            onChange={(e) =>
                                                setFormData({
                                                    ...formData,
                                                    problemsSolved: parseInt(e.target.value) || 0,
                                                })
                                            }
                                        />
                                    </div>
                                </div>
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full btn-primary py-3"
                                >
                                    {loading ? "Saving..." : "Add Entry"}
                                </button>
                            </form>
                        )}
                    </div>
                </div>
            )}
        </>
    );
}
