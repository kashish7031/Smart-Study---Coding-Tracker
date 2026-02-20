"use client";

import EntryForm from "@/components/EntryForm";
import { useEffect, useState } from "react";
import { Entry } from "@/types";
import { useParams } from "next/navigation";

export default function EditEntryPage() {
    const params = useParams();
    const [entry, setEntry] = useState<Entry | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchEntry = async () => {
            try {
                const res = await fetch(`/api/entries/${params.id}`);
                const data = await res.json();
                if (data.success) {
                    setEntry(data.data);
                }
            } catch (error) {
                console.error("Failed to fetch entry", error);
            } finally {
                setLoading(false);
            }
        };
        fetchEntry();
    }, [params.id]);

    if (loading) {
        return (
            <div className="max-w-2xl mx-auto py-8 animate-pulse">
                <div className="h-8 w-40 skeleton mb-8" />
                <div className="h-96 skeleton rounded-2xl" />
            </div>
        );
    }

    if (!entry) {
        return (
            <div className="text-center py-20 animate-fade-in">
                <div className="text-5xl mb-4">🔍</div>
                <p className="text-gray-500 dark:text-gray-400">Entry not found</p>
            </div>
        );
    }

    return (
        <div className="max-w-2xl mx-auto py-8 animate-fade-in">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
                Edit Entry
            </h1>
            <div className="glass-card p-8">
                <EntryForm mode="edit" initialData={entry} />
            </div>
        </div>
    );
}
