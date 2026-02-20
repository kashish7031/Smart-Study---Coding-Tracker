"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import { useState, useEffect } from "react";
import {
    LayoutDashboard,
    Plus,
    List,
    BarChart3,
    Settings,
    Sun,
    Moon,
    ChevronLeft,
    ChevronRight,
    Zap,
    BookOpen,
} from "lucide-react";

const navItems = [
    { href: "/", label: "Dashboard", icon: LayoutDashboard },
    { href: "/add", label: "Add Entry", icon: Plus },
    { href: "/entries", label: "Entries", icon: List },
    { href: "/practice", label: "Practice", icon: BookOpen },
    { href: "/analytics", label: "Analytics", icon: BarChart3 },
    { href: "/settings", label: "Settings", icon: Settings },
];

export default function Sidebar() {
    const pathname = usePathname();
    const { theme, setTheme } = useTheme();
    const [collapsed, setCollapsed] = useState(false);
    const [mounted, setMounted] = useState(false);

    useEffect(() => setMounted(true), []);

    return (
        <>
            {/* Mobile top bar */}
            <div className="md:hidden fixed top-0 left-0 right-0 z-50 glass-card rounded-none border-x-0 border-t-0 px-4 py-3">
                <div className="flex items-center justify-between">
                    <Link href="/" className="flex items-center space-x-2">
                        <div className="w-8 h-8 gradient-bg rounded-lg flex items-center justify-center">
                            <Zap size={18} className="text-white" />
                        </div>
                        <span className="text-lg font-bold gradient-text">DevTrack</span>
                    </Link>
                    <div className="flex items-center space-x-2">
                        {mounted && (
                            <button
                                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                                className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors"
                            >
                                {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
                            </button>
                        )}
                    </div>
                </div>
                {/* Mobile nav */}
                <div className="flex space-x-1 mt-3 overflow-x-auto pb-1">
                    {navItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = pathname === item.href;
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={`flex items-center space-x-1.5 px-3 py-2 rounded-xl text-xs font-medium whitespace-nowrap transition-all duration-200 ${isActive
                                        ? "gradient-bg text-white shadow-lg shadow-indigo-500/25"
                                        : "text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-700/50"
                                    }`}
                            >
                                <Icon size={14} />
                                <span>{item.label}</span>
                            </Link>
                        );
                    })}
                </div>
            </div>

            {/* Desktop sidebar */}
            <aside
                className={`hidden md:flex flex-col fixed left-0 top-0 bottom-0 z-50 
        bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border-r border-gray-200/50 dark:border-slate-700/50
        transition-all duration-300 ${collapsed ? "w-20" : "w-64"}`}
            >
                {/* Logo */}
                <div className="p-6 flex items-center justify-between">
                    <Link href="/" className="flex items-center space-x-3">
                        <div className="w-10 h-10 gradient-bg rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/25">
                            <Zap size={22} className="text-white" />
                        </div>
                        {!collapsed && (
                            <span className="text-xl font-bold gradient-text">DevTrack</span>
                        )}
                    </Link>
                </div>

                {/* Navigation */}
                <nav className="flex-1 px-3 space-y-1">
                    {navItems.map((item) => {
                        const Icon = item.icon;
                        const isActive =
                            pathname === item.href ||
                            (item.href !== "/" && pathname.startsWith(item.href));
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={`flex items-center space-x-3 px-4 py-3 rounded-xl font-medium transition-all duration-200 group ${isActive
                                        ? "gradient-bg text-white shadow-lg shadow-indigo-500/25"
                                        : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-800/50 hover:text-gray-900 dark:hover:text-white"
                                    }`}
                                title={collapsed ? item.label : undefined}
                            >
                                <Icon
                                    size={20}
                                    className={!isActive ? "group-hover:scale-110 transition-transform" : ""}
                                />
                                {!collapsed && <span>{item.label}</span>}
                            </Link>
                        );
                    })}
                </nav>

                {/* Bottom section */}
                <div className="p-3 space-y-2 border-t border-gray-200/50 dark:border-slate-700/50">
                    {/* Theme toggle */}
                    {mounted && (
                        <button
                            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                            className="flex items-center space-x-3 w-full px-4 py-3 rounded-xl text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-800/50 transition-all duration-200"
                        >
                            {theme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
                            {!collapsed && (
                                <span className="font-medium">
                                    {theme === "dark" ? "Light Mode" : "Dark Mode"}
                                </span>
                            )}
                        </button>
                    )}

                    {/* Collapse toggle */}
                    <button
                        onClick={() => setCollapsed(!collapsed)}
                        className="flex items-center space-x-3 w-full px-4 py-3 rounded-xl text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-800/50 transition-all duration-200"
                    >
                        {collapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
                        {!collapsed && <span className="font-medium">Collapse</span>}
                    </button>
                </div>
            </aside>
        </>
    );
}
