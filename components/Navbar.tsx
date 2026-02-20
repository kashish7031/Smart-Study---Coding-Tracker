import Link from 'next/link';

export default function Navbar() {
    return (
        <nav className="bg-indigo-600 text-white shadow-md">
            <div className="container mx-auto px-4 py-4 flex justify-between items-center">
                <Link href="/" className="text-2xl font-bold tracking-tight">DevTrack</Link>
                <div className="space-x-6">
                    <Link href="/" className="hover:text-indigo-200 transition-colors font-medium">Dashboard</Link>
                    <Link href="/add" className="hover:text-indigo-200 transition-colors font-medium">Add Entry</Link>
                    <Link href="/entries" className="hover:text-indigo-200 transition-colors font-medium">History</Link>
                </div>
            </div>
        </nav>
    );
}
