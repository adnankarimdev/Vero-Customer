import MobileBottomBar from "@/components/ui/MobileBottomBar";

type LayoutProps = {
  children: React.ReactNode;
};

export default function DashboardLayout({ children }: LayoutProps) {
  return (
    <div className="flex">
      <MobileBottomBar />
      <main className="flex-1 p-4">{children}</main>
    </div>
  );
}
