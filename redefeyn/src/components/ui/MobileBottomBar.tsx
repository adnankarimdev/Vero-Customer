"use client";

import {
  LayoutDashboard,
  Star,
  Reply,
  Settings,
  LogOut,
  BadgeDollarSign,
  HandHeart,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const navItems = [
  { icon: LayoutDashboard, label: "Home", href: "/dashboard" },
  { icon: Star, label: "Reviews", href: "/reviews" },
  { icon: HandHeart, label: "Rewards", href: "/respond" },
  { icon: Settings, label: "Settings", href: "/settings" },
];

export default function MobileBottomBar() {
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("customerEmail");
    router.push("/authentication");
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-background border-t border-border">
      <div className="flex justify-around items-center h-16">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex flex-col items-center justify-center w-full h-full",
              "hover:text-primary",
            )}
          >
            <item.icon className="h-5 w-5" strokeWidth={2} />
            <span className="text-xs mt-1">{item.label}</span>
          </Link>
        ))}
        <Button
          variant="ghost"
          className={cn(
            "flex flex-col items-center justify-center w-full h-full",
            "hover:text-primary",
          )}
          onClick={handleLogout}
        >
          <LogOut className="h-5 w-5" strokeWidth={2} />
          <span className="text-xs mt-1">Logout</span>
        </Button>
      </div>
    </nav>
  );
}
