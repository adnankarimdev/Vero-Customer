import MobileBottomBar from "@/components/ui/MobileBottomBar";

type LayoutProps = {
  children: React.ReactNode;
};

export default function DashboardLayout({ children }: LayoutProps) {
  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1 p-4 pb-20">{children}</main>{" "}
      {/* Adjusted bottom padding */}
      <MobileBottomBar />
    </div>
  );
}
