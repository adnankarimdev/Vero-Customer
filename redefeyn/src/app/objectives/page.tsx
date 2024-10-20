"use client";

import WeeklyObjectives from "@/components/ui/WeeklyObjectives";

export default function Dashboard() {
  return (
    <div className="container mx-auto p-4">
      <div className="flex items-center justify-center min-h-screen">
        <WeeklyObjectives />
      </div>
    </div>
  );
}
