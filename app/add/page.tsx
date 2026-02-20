import EntryForm from "@/components/EntryForm";

export default function AddEntryPage() {
    return (
        <div className="max-w-2xl mx-auto py-8 animate-fade-in">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
                Add New Entry
            </h1>
            <div className="glass-card p-8">
                <EntryForm mode="create" />
            </div>
        </div>
    );
}
