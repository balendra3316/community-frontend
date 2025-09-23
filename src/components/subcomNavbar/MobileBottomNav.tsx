"use client";
import React, { memo } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, GraduationCap, Trophy, NotebookPen } from "lucide-react";

interface Item {
  name: string;
  path: string;
  icon: React.ReactNode;
}

const items: Item[] = [
  { name: "Community", path: "/community", icon: <Home className="h-5 w-5" /> },
  { name: "Classroom", path: "/classroom", icon: <GraduationCap className="h-5 w-5" /> },
  { name: "Leaderboards", path: "/leaderboards", icon: <Trophy className="h-5 w-5" /> },
  { name: "Journal", path: "/journal", icon: <NotebookPen className="h-5 w-5" /> },
];

function cn(...classes: (string | false | null | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}

const MobileBottomNav = memo(function MobileBottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 inset-x-0 z-50 bg-white/95 backdrop-blur border-t border-gray-200 md:hidden">
      <ul className="grid grid-cols-4">
        {items.map((item) => {
          const active =
            (item.path === "/" && pathname === "/") ||
            (item.path !== "/" && pathname.startsWith(item.path));

          return (
            <li key={item.name}>
              <Link
                href={item.path}
                className={cn(
                  "flex flex-col items-center justify-center py-2.5 text-xs",
                  "transition-colors",
                  active
                    ? "text-yellow-700"
                    : "text-gray-500 hover:text-gray-700"
                )}
                aria-current={active ? "page" : undefined}
              >
                <div
                  className={cn(
                    "flex items-center justify-center h-9 w-9 rounded-full mb-1",
                    active ? "bg-yellow-100" : "bg-gray-100"
                  )}
                >
                  {item.icon}
                </div>
                <span className="font-medium">{item.name}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
});

export default MobileBottomNav;
