import Link from "next/link";
import { Entry } from "@/types";
import { Pencil, Trash2, Clock, CheckCircle, Calendar } from "lucide-react";

interface EntryCardProps {
    entry: Entry;
    onDelete: (id: string) => void;
}

export default function EntryCard({ entry, onDelete }: EntryCardProps) {
    const formatDate = (date: string | Date) => {
        return new Date(date).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
        });
    };

    const getCategoryColor = (cat: string) => {
        const colors: Record<string, string> = {
            DSA: "bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-400",
            Development: "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400",
            "System Design": "bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400",
            "Interview Prep": "bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400",
            Learning: "bg-pink-100 dark:bg-pink-900/30 text-pink-700 dark:text-pink-400",
        };
        return colors[cat] || "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-400";
    };

    return (
        <div className="glass-card-hover p-6 group">
            <div className="flex justify-between items-start mb-4">
                <div>
                    <span
                        className={`inline-block px-3 py-1 rounded-full text-xs font-semibold mb-2 ${getCategoryColor(
                            entry.category
                        )}`}
                    >
                        {entry.category}
                    </span>
                    <h3 className="text-lg font-bold text-gray-800 dark:text-white line-clamp-1 group-hover:gradient-text transition-all">
                        {entry.title}
                    </h3>
                </div>
                <div className="flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    <Link
                        href={`/edit/${entry._id}`}
                        className="p-2 text-gray-400 hover:text-indigo-500 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 rounded-lg transition-all"
                    >
                        <Pencil size={16} />
                    </Link>
                    <button
                        onClick={() => onDelete(entry._id)}
                        className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all"
                    >
                        <Trash2 size={16} />
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-4">
                <div className="flex items-center text-gray-600 dark:text-gray-400">
                    <Clock size={14} className="mr-2 text-gray-400 dark:text-gray-500" />
                    <span className="text-sm">{entry.timeSpent} mins</span>
                </div>
                <div className="flex items-center text-gray-600 dark:text-gray-400">
                    <CheckCircle size={14} className="mr-2 text-gray-400 dark:text-gray-500" />
                    <span className="text-sm">{entry.problemsSolved} Solved</span>
                </div>
            </div>

            {entry.notes && (
                <p className="text-gray-500 dark:text-gray-400 text-sm mb-4 line-clamp-2">
                    {entry.notes}
                </p>
            )}

            <div className="flex items-center text-gray-400 dark:text-gray-500 text-xs border-t border-gray-100 dark:border-slate-700 pt-3">
                <Calendar size={12} className="mr-2" />
                {formatDate(entry.date)}
            </div>
        </div>
    );
}
