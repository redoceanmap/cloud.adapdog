"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Loader2, Sparkles } from "lucide-react";
import PlannerWorkbench from "@/components/planner/PlannerWorkbench";
import { loadAuthUser } from "@/lib/auth";
import { verifyAuth } from "@/lib/auth-api";
import type { Pet, PlannerCourse } from "@/lib/planner-api";
import {
  fetchItineraries,
  fetchMyPets,
  fetchRecommendedPlan,
} from "@/lib/planner-api";

export default function MyPlannerView() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [planLoading, setPlanLoading] = useState(false);
  const [error, setError] = useState("");
  const [userName, setUserName] = useState("회원");
  const [pet, setPet] = useState<Pet | null>(null);
  const [courses, setCourses] = useState<PlannerCourse[]>([]);
  const [activeCourseId, setActiveCourseId] = useState<number | null>(null);
  const [isFallback, setIsFallback] = useState(false);

  const loadRecommended = useCallback(async (primaryPet: Pet) => {
    setPlanLoading(true);
    setError("");
    try {
      const recommended = await fetchRecommendedPlan(primaryPet);
      setCourses([recommended]);
      setActiveCourseId(recommended.id);
      setIsFallback(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "추천 코스를 불러오지 못했습니다.");
    } finally {
      setPlanLoading(false);
    }
  }, []);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      const user = loadAuthUser();
      if (!user) {
        setLoading(false);
        router.replace("/login?next=/planner");
        return;
      }

      let authed = false;
      try {
        authed = await verifyAuth();
      } catch {
        authed = false;
      }

      if (!authed) {
        setLoading(false);
        router.replace("/login?next=/planner");
        return;
      }

      try {
        setUserName(user.name);
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
          setIsFallback(false);
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
  }, [router]);

  const activeCourse =
    courses.find((course) => course.id === activeCourseId) ?? courses[0] ?? null;

  return (
    <div className="min-h-screen bg-cream pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
          <div>
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-sm text-brown-light hover:text-sage transition-colors mb-3"
            >
              <ArrowLeft className="w-4 h-4" />
              홈으로
            </Link>
            <h1 className="text-3xl md:text-4xl font-extrabold text-brown">내 AI 플래너</h1>
            <p className="text-brown-light mt-2">
              앱에서 저장한 코스를 채팅 · 상세 · 지도 한 화면에서 확인하세요.
            </p>
          </div>
          {pet && (
            <div className="bg-white rounded-2xl border border-sage/15 px-4 py-3 text-sm text-brown">
              <span className="text-brown-light">반려견</span>{" "}
              <strong>{pet.name}</strong> · {pet.breed}
            </div>
          )}
        </div>

        {loading && (
          <div className="flex items-center justify-center gap-2 text-brown-light py-24">
            <Loader2 className="w-5 h-5 animate-spin" />
            플래너 정보를 불러오는 중...
          </div>
        )}

        {!loading && error && !activeCourse && (
          <div className="bg-white rounded-2xl border border-red-100 px-6 py-8 text-center">
            <p className="text-red-500 mb-4">{error}</p>
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

        {!loading && !activeCourse && pet && !error && (
          <div className="bg-white rounded-2xl border border-sage/15 px-6 py-10 text-center max-w-lg mx-auto">
            <Sparkles className="w-10 h-10 text-sage mx-auto mb-4" />
            <h2 className="text-xl font-bold text-brown mb-2">저장된 코스가 없어요</h2>
            <p className="text-brown-light text-sm leading-relaxed mb-6">
              앱 AI 플래너에서 코스를 저장하면 이곳에 표시됩니다.
              지금은 {pet.name}에게 맞는 추천 코스를 미리 볼 수 있어요.
            </p>
            <button
              type="button"
              disabled={planLoading}
              onClick={() => loadRecommended(pet)}
              className="btn-primary inline-flex disabled:opacity-60"
            >
              {planLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  AI가 코스를 짜는 중...
                </>
              ) : (
                "추천 코스 불러오기"
              )}
            </button>
            {planLoading && (
              <p className="text-xs text-brown-light mt-4">
                AI 응답에 30초~1분 정도 걸릴 수 있어요.
              </p>
            )}
          </div>
        )}

        {!loading && activeCourse && pet && (
          <div className="space-y-4">
            {error && (
              <div className="bg-red-50 border border-red-100 text-red-600 rounded-2xl px-4 py-3 text-sm">
                {error}
              </div>
            )}

            {isFallback && (
              <div className="bg-sage/10 border border-sage/20 text-sage rounded-2xl px-4 py-3 text-sm">
                아직 저장된 코스가 없어 {pet.name}에게 맞는 추천 코스를 보여드리고 있어요.
                앱에서 코스를 저장하면 이곳에 표시됩니다.
              </div>
            )}

            {courses.length > 1 && (
              <div className="flex flex-wrap gap-2">
                {courses.map((course) => (
                  <button
                    key={course.id}
                    type="button"
                    onClick={() => setActiveCourseId(course.id)}
                    className={`text-sm font-medium px-4 py-2 rounded-full transition-all ${
                      activeCourseId === course.id
                        ? "bg-sage text-white shadow-md shadow-sage/25"
                        : "bg-white text-brown-light border border-sage/15 hover:bg-sage/10"
                    }`}
                  >
                    {course.title}
                  </button>
                ))}
              </div>
            )}

            <PlannerWorkbench course={activeCourse} pet={pet} userName={userName} />
          </div>
        )}
      </div>
    </div>
  );
}
