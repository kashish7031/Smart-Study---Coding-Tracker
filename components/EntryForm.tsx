"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Entry } from "@/types";

interface EntryFormProps {
    initialData?: Entry;
    mode: "create" | "edit";
}

export default function EntryForm({ initialData, mode }: EntryFormProps) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [formData, setFormData] = useState({
        title: initialData?.title || "",
        category: initialData?.category || "DSA",
        timeSpent: initialData?.timeSpent || 0,
        problemsSolved: initialData?.problemsSolved || 0,
        notes: initialData?.notes || "",
        date: initialData?.date
            ? new Date(initialData.date).toISOString().split("T")[0]
            : new Date().toISOString().split("T")[0],
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
        setError("");

        try {
            const url =
                mode === "create"
                    ? "/api/entries"
                    : `/api/entries/${initialData!._id}`;
            const method = mode === "create" ? "POST" : "PUT";

            const res = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            const data = await res.json();

            if (!data.success) {
                throw new Error(data.error || "Something went wrong");
            }

            router.push("/entries");
            router.refresh();
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl mx-auto">
            {error && (
                <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-4 rounded-xl text-sm border border-red-100 dark:border-red-800/30">
                    {error}
                </div>
            )}

            <div className="grid grid-cols-1 gap-6">
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Title
                    </label>
                    <input
                        type="text"
                        required
                        className="input-field"
                        value={formData.title}
                        onChange={(e) =>
                            setFormData({ ...formData, title: e.target.value })
                        }
                        placeholder="e.g. Solved LeetCode 100"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Category
                    </label>
                    <select
                        className="input-field"
                        value={formData.category}
                        onChange={(e) =>
                            setFormData({ ...formData, category: e.target.value })
                        }
                    >
                        {categories.map((cat) => (
                            <option key={cat} value={cat}>
                                {cat}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Time Spent (minutes)
                        </label>
                        <input
                            type="number"
                            required
                            min="0"
                            className="input-field"
                            value={formData.timeSpent}
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    timeSpent: parseInt(e.target.value),
                                })
                            }
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Problems Solved
                        </label>
                        <input
                            type="number"
                            required
                            min="0"
                            className="input-field"
                            value={formData.problemsSolved}
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    problemsSolved: parseInt(e.target.value),
                                })
                            }
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Date
                    </label>
                    <input
                        type="date"
                        required
                        className="input-field"
                        value={formData.date}
                        onChange={(e) =>
                            setFormData({ ...formData, date: e.target.value })
                        }
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Notes
                    </label>
                    <textarea
                        rows={4}
                        className="input-field"
                        value={formData.notes}
                        onChange={(e) =>
                            setFormData({ ...formData, notes: e.target.value })
                        }
                        placeholder="What did you learn today?"
                    />
                </div>
            </div>

            <div className="flex justify-end space-x-3">
                <button
                    type="button"
                    onClick={() => router.back()}
                    className="btn-ghost"
                >
                    Cancel
                </button>
                <button type="submit" disabled={loading} className="btn-primary">
                    {loading
                        ? "Saving..."
                        : mode === "create"
                            ? "Add Entry"
                            : "Update Entry"}
                </button>
            </div>
        </form>
    );
}
