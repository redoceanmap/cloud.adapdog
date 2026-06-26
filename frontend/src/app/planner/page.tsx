import Navbar from "@/components/Navbar";
import MyPlannerView from "@/components/planner/MyPlannerView";

export default function PlannerPage() {
  return (
    <>
      <Navbar />
      <main>
        <MyPlannerView />
      </main>
    </>
  );
}
