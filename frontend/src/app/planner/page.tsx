import Navbar from "@/components/Navbar";
import MyPlannerView from "@/components/planner/MyPlannerView";

export default function PlannerPage() {
  return (
    <>
      <Navbar />
      <main className="planner-page min-h-screen pb-8 pt-24">
        <div className="mx-auto flex justify-center px-3 sm:px-4">
          <MyPlannerView />
        </div>
      </main>
    </>
  );
}
