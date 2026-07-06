"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Brain, LayoutDashboard, MessageSquare, BarChart3, FileText, Settings, User, Bell, Search } from "lucide-react";

const navItems = [
  { href: "/workspace", icon: MessageSquare, label: "Upload Dataset" },
  { href: "/analytics", icon: BarChart3, label: "Analytics" },
  { href: "/reports", icon: FileText, label: "Reports" },
  { href: "/settings", icon: Settings, label: "Settings" },
];

export default function Navbar() {
  const pathname = usePathname();
  return (
    <header className="fixed top-0 inset-x-0 z-50 h-14 bg-white border-b border-slate-200 flex items-center justify-between px-6 shadow-sm">
      <div className="flex items-center gap-4">
        <Link href="/" className="flex items-center gap-2.5 shrink-0">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center">
            <Brain className="w-4 h-4 text-white" />
          </div>
          <span className="font-bold text-sm text-slate-900">Analytics AI</span>
        </Link>
        <div className="w-px h-5 bg-slate-200" />
        <nav className="flex items-center gap-1">
          {navItems.map(item => {
            const active = pathname.startsWith(item.href);
            return (
              <Link key={item.href} href={item.href}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${active ? "bg-blue-50 text-blue-700" : "text-slate-500 hover:bg-slate-100 hover:text-slate-900"}`}>
                <item.icon className="w-3.5 h-3.5" />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>
      <div className="flex items-center gap-2">
        <button className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100 hover:text-blue-600 transition-colors">
          <Search className="w-4 h-4" />
        </button>
        <button className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100 hover:text-blue-600 transition-colors">
          <Bell className="w-4 h-4" />
        </button>
        <Link href="/profile" className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center text-white text-xs font-bold hover:scale-110 transition-transform shadow-md">
          AN
        </Link>
      </div>
    </header>
  );
}
