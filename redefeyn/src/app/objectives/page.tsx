"use client";

import WeeklyObjectives from "@/components/ui/WeeklyObjectives";
import AnimatedLayout from "@/animations/AnimatedLayout";

export default function Dashboard() {
  return (
    <AnimatedLayout>
      <div className="container mx-auto p-4">
        <div className="flex items-center justify-center min-h-screen">
          <WeeklyObjectives />
        </div>
      </div>
    </AnimatedLayout>
  );
}
