"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Loader2, X } from "lucide-react";
import PlannerWorkbench from "@/components/planner/PlannerWorkbench";
import { useAuthSession } from "@/lib/use-auth-session";
import type { Pet, PlannerCourse } from "@/lib/planner-api";
import { deleteItinerary, fetchItineraries, fetchMyPets } from "@/lib/planner-api";

export default function MyPlannerView() {
  const router = useRouter();
  const { user, ready } = useAuthSession();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [pet, setPet] = useState<Pet | null>(null);
  const [courses, setCourses] = useState<PlannerCourse[]>([]);
  const [activeCourseId, setActiveCourseId] = useState<number | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  useEffect(() => {
    if (!ready) return;

    let cancelled = false;

    async function load() {
      if (!user) {
        setLoading(false);
        router.replace("/login?next=/planner");
        return;
      }

      try {
        const pets = await fetchMyPets();
        if (pets.length === 0) {
          throw new Error("등록된 반려동물이 없습니다. 앱에서 프로필을 먼저 등록해 주세요.");
        }

        const primaryPet = pets[0];
        const loadedCourses = await fetchItineraries(primaryPet.id);

        if (cancelled) return;

        setPet(primaryPet);

        if (loadedCourses.length > 0) {
          setCourses(loadedCourses);
          setActiveCourseId(loadedCourses[0].id);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "플래너를 불러오지 못했습니다.");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [ready, user, router]);

  const activeCourse =
    courses.find((course) => course.id === activeCourseId) ?? courses[0] ?? null;

  const handleDeleteCourse = async (courseId: number) => {
    if (deletingId != null) return;
    setDeletingId(courseId);
    try {
      await deleteItinerary(courseId);
      setCourses((prev) => {
        const next = prev.filter((c) => c.id !== courseId);
        if (activeCourseId === courseId) {
          setActiveCourseId(next[0]?.id ?? null);
        }
        return next;
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "코스를 삭제하지 못했습니다.");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="planner-page w-full max-w-[1480px]">
      {loading && (
        <div
          className="flex items-center justify-center gap-2 py-24"
          style={{ color: "var(--pw-muted)" }}
        >
          <Loader2 className="h-5 w-5 animate-spin" />
          플래너 정보를 불러오는 중...
        </div>
      )}

      {!loading && error && !pet && (
        <div className="rounded-2xl border border-red-100 bg-white px-6 py-8 text-center">
          <p className="mb-4 text-red-500">{error}</p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link href="/login?next=/planner" className="btn-primary inline-flex">
              다시 로그인
            </Link>
            <Link href="/" className="btn-secondary inline-flex">
              홈으로
            </Link>
          </div>
        </div>
      )}

      {!loading && pet && (
        <div className="space-y-4">
          {error && (
            <div className="rounded-2xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-600">
              {error}
            </div>
          )}

          {courses.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {courses.map((course) => {
                const active = activeCourseId === course.id;
                return (
                  <div key={course.id} className="group relative">
                    <button
                      type="button"
                      onClick={() => setActiveCourseId(course.id)}
                      className={`rounded-full py-2 pl-4 pr-4 text-sm font-medium transition-all cursor-pointer group-hover:pr-9 ${
                        active
                          ? "bg-sage text-white shadow-md shadow-sage/25 hover:brightness-110 hover:-translate-y-0.5"
                          : "border border-sage/15 bg-white text-brown-light hover:border-sage/40 hover:bg-sage/10 hover:text-sage hover:-translate-y-0.5 hover:shadow-sm"
                      }`}
                    >
                      {course.title}
                    </button>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        void handleDeleteCourse(course.id);
                      }}
                      disabled={deletingId === course.id}
                      className={`absolute right-1 top-1/2 flex h-6 w-6 -translate-y-1/2 items-center justify-center rounded-full border text-[11px] opacity-0 transition-all group-hover:opacity-100 disabled:opacity-50 ${
                        active
                          ? "border-white/40 bg-white/20 text-white hover:bg-white/30"
                          : "border-red-200 bg-white text-red-500 hover:bg-red-50"
                      }`}
                      aria-label={`${course.title} 삭제`}
                      title="코스 삭제"
                    >
                      {deletingId === course.id ? (
                        <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      ) : (
                        <X className="h-3.5 w-3.5" />
                      )}
                    </button>
                  </div>
                );
              })}
            </div>
          )}

          <PlannerWorkbench
            pet={pet}
            userName={user?.name ?? "회원"}
            userEmail={user?.email ?? ""}
            initialCourse={activeCourse}
            onCourseSaved={(course) => {
              setCourses((prev) => {
                const exists = prev.some((c) => c.id === course.id);
                if (exists) {
                  return prev.map((c) => (c.id === course.id ? course : c));
                }
                return [course, ...prev];
              });
              setActiveCourseId(course.id);
            }}
          />
        </div>
      )}
    </div>
  );
}
