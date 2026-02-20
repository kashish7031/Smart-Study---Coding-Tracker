"use client";

import { useEffect, useState } from "react";
import EntryCard from "@/components/EntryCard";
import { Entry } from "@/types";
import Link from "next/link";
import { Plus, Search, ArrowRight } from "lucide-react";

export default function EntriesPage() {
    const [entries, setEntries] = useState<Entry[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");

    useEffect(() => {
        fetchEntries();
    }, []);

    const fetchEntries = async () => {
        try {
            const res = await fetch("/api/entries");
            const data = await res.json();
            if (data.success) {
                setEntries(data.data);
            }
        } catch (error) {
            console.error("Failed to fetch entries", error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this entry?")) return;
        try {
            const res = await fetch(`/api/entries/${id}`, { method: "DELETE" });
            const data = await res.json();
            if (data.success) {
                setEntries((prev) => prev.filter((entry) => entry._id !== id));
            }
        } catch (error) {
            console.error("Failed to delete entry", error);
        }
    };

    const filtered = entries.filter(
        (e) =>
            e.title.toLowerCase().includes(search.toLowerCase()) ||
            e.category.toLowerCase().includes(search.toLowerCase())
    );

    if (loading) {
        return (
            <div className="space-y-6 animate-pulse">
                <div className="h-8 w-40 skeleton" />
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {[...Array(6)].map((_, i) => (
                        <div key={i} className="h-48 skeleton rounded-2xl" />
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6 animate-fade-in">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                        Study History
                    </h1>
                    <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
                        {entries.length} total entries
                    </p>
                </div>
                <Link href="/add" className="btn-primary flex items-center space-x-2">
                    <Plus size={18} />
                    <span>Add Entry</span>
                </Link>
            </div>

            {/* Search */}
            {entries.length > 0 && (
                <div className="relative">
                    <Search
                        size={18}
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                    />
                    <input
                        type="text"
                        placeholder="Search entries..."
                        className="input-field pl-11"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
            )}

            {entries.length === 0 ? (
                <div className="glass-card p-16 text-center">
                    <div className="text-6xl mb-4">📝</div>
                    <p className="text-lg font-semibold text-gray-800 dark:text-white mb-2">
                        No entries yet
                    </p>
                    <p className="text-gray-500 dark:text-gray-400 mb-6">
                        Start tracking your study progress today!
                    </p>
                    <Link
                        href="/add"
                        className="btn-primary inline-flex items-center space-x-2"
                    >
                        <span>Create First Entry</span>
                        <ArrowRight size={16} />
                    </Link>
                </div>
            ) : filtered.length === 0 ? (
                <div className="glass-card p-12 text-center">
                    <p className="text-gray-500 dark:text-gray-400">
                        No entries match &quot;{search}&quot;
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filtered.map((entry) => (
                        <EntryCard key={entry._id} entry={entry} onDelete={handleDelete} />
                    ))}
                </div>
            )}
        </div>
    );
}
