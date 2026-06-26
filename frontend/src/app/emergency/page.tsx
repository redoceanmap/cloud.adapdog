import Navbar from "@/components/Navbar";
import EmergencyView from "@/components/emergency/EmergencyView";

export default function EmergencyPage() {
  return (
    <>
      <Navbar />
      <main className="planner-page min-h-screen pb-10 pt-24">
        <div className="mx-auto flex justify-center px-3 sm:px-4">
          <EmergencyView />
        </div>
      </main>
    </>
  );
}
