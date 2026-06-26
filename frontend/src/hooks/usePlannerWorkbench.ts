"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { Pet, PlannerCourse, RoutePlanResponse, TripPlan } from "@/lib/planner-api";
import {
  chatRoute,
  recommendRoute,
  searchPlaces,
  sizeLabel,
} from "@/lib/planner-api";
import {
  type CourseAddStop,
  dedupeRoutePlan,
  parseCourseEdit,
  plannerCourseToRoutePlan,
  wantsDedupeIntent,
  wantsRecommendIntent,
  withCourseEdits,
} from "@/lib/planner-live";
import {
  isVoiceGuideEnabled,
  speakText,
  toggleVoiceGuide,
} from "@/lib/planner-speech";

export interface PlannerMsg {
  role: "user" | "ai";
  text: string;
  doc?: boolean;
}

export interface CourseNotification {
  id: string;
  kind: "saved" | "edited";
  message: string;
  createdAt: number;
}

function newNotificationId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function buildWelcomeFromCourse(pet: Pet, course: PlannerCourse): PlannerMsg[] {
  const traits =
    pet.traits.length > 0 ? pet.traits.join(" · ") : pet.temperament;
  return [
    {
      role: "user",
      text: course.prompt_text || `${pet.name}랑 ${course.region} 여행 코스 짜줘`,
    },
    {
      role: "ai",
      text: `${pet.breed} ${pet.name}(${sizeLabel(pet.size)}${traits ? ` · ${traits}` : ""}) 프로필을 반영해 ${course.region} 코스를 불러왔어요. 각 장소 입장 가능 여부·그늘·이동약자 배려를 확인했습니다. 더 넣거나 빼고 싶은 곳이 있으면 말해주세요.`,
      doc: true,
    },
  ];
}

const STARTER_SUGGESTIONS = ["가고 싶은 지역 알려줄게", "KTX", "1박 할래요"];

function suggestionsForPlan(
  suggestions: string[],
  plan: TripPlan | null | undefined,
): string[] {
  if (suggestions.length > 0) return suggestions;
  if (!plan?.destination) return STARTER_SUGGESTIONS;
  return suggestions;
}

function buildEmptyWelcome(pet: Pet): PlannerMsg[] {
  const traits =
    pet.traits.length > 0 ? pet.traits.join(" · ") : pet.temperament;
  const traitPart = traits ? ` · ${traits}` : "";
  const size = sizeLabel(pet.size);
  return [
    {
      role: "ai",
      text: `안녕하세요! 🐾 ${pet.breed} ${pet.name}(${size}${traitPart}) 프로필을 반영해 펫 동반 코스를 짤게요. 가고 싶은 지역과 이동수단을 말해주세요.`,
    },
  ];
}

export function usePlannerWorkbench(pet: Pet, initialCourse?: PlannerCourse | null) {
  const seededCourse = useMemo(
    () =>
      initialCourse
        ? dedupeRoutePlan(plannerCourseToRoutePlan(initialCourse, pet))
        : null,
    [initialCourse, pet],
  );

  const courseSeedKey = initialCourse
    ? `${initialCourse.id}-${initialCourse.title}-${initialCourse.stops.length}`
    : null;

  const [messages, setMessages] = useState<PlannerMsg[]>(() =>
    initialCourse ? buildWelcomeFromCourse(pet, initialCourse) : buildEmptyWelcome(pet),
  );
  const [suggestions, setSuggestions] = useState<string[]>(() =>
    initialCourse ? ["맛집 추가", "공원 넣어줘", "자차로 바꿔"] : STARTER_SUGGESTIONS,
  );
  const [input, setInput] = useState("");
  const [listening, setListening] = useState(false);
  const [liveCourse, setLiveCourse] = useState<RoutePlanResponse | null>(seededCourse);
  const [livePlan, setLivePlan] = useState<TripPlan | null>(null);
  const [liveLoading, setLiveLoading] = useState(false);
  const [courseRemoved, setCourseRemoved] = useState<string[]>([]);
  const [courseAdded, setCourseAdded] = useState<CourseAddStop[]>([]);
  const [activeStopIndex, setActiveStopIndex] = useState(0);
  const [placePool, setPlacePool] = useState<Awaited<ReturnType<typeof searchPlaces>>>([]);
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [courseNotifications, setCourseNotifications] = useState<CourseNotification[]>([]);
  const [courseRevision, setCourseRevision] = useState(0);

  const messagesRef = useRef(messages);
  const livePlanRef = useRef(livePlan);
  const liveCourseRef = useRef(liveCourse);
  const courseAddedRef = useRef(courseAdded);
  const courseRemovedRef = useRef(courseRemoved);
  const placePoolRef = useRef(placePool);
  const liveLoadingRef = useRef(false);
  const listeningRef = useRef(false);

  useEffect(() => {
    messagesRef.current = messages;
  }, [messages]);
  useEffect(() => {
    livePlanRef.current = livePlan;
  }, [livePlan]);
  useEffect(() => {
    liveCourseRef.current = liveCourse;
  }, [liveCourse]);
  useEffect(() => {
    courseAddedRef.current = courseAdded;
  }, [courseAdded]);
  useEffect(() => {
    courseRemovedRef.current = courseRemoved;
  }, [courseRemoved]);
  useEffect(() => {
    placePoolRef.current = placePool;
  }, [placePool]);

  useEffect(() => {
    if (!initialCourse) return;
    const converted = plannerCourseToRoutePlan(initialCourse, pet);
    setLiveCourse(converted);
    setLivePlan(null);
    livePlanRef.current = null;
    setCourseRemoved([]);
    setCourseAdded([]);
    setMessages(buildWelcomeFromCourse(pet, initialCourse));
    setSuggestions(["맛집 추가", "공원 넣어줘", "자차로 바꿔"]);
    setActiveStopIndex(0);
  }, [courseSeedKey, initialCourse, pet]);

  const region = liveCourse?.region ?? initialCourse?.region ?? "";

  useEffect(() => {
    if (!region) {
      setPlacePool([]);
      return;
    }
    searchPlaces(region).then(setPlacePool).catch(() => setPlacePool([]));
  }, [region]);

  const effectiveCourse = useMemo(
    () => withCourseEdits(liveCourse, courseRemoved, courseAdded),
    [liveCourse, courseRemoved, courseAdded],
  );

  const pushAi = useCallback((text: string) => {
    setMessages((m) => [...m, { role: "ai", text }]);
    speakText(text);
  }, []);

  const pushCourseNotification = useCallback((kind: CourseNotification["kind"], message: string) => {
    setCourseNotifications((prev) =>
      [
        { id: newNotificationId(), kind, message, createdAt: Date.now() },
        ...prev,
      ].slice(0, 30),
    );
  }, []);

  const addCourseStop = useCallback(
    (p: CourseAddStop) => {
      const alreadyVisible =
        (courseAddedRef.current.some((x) => x.name === p.name) ||
          liveCourseRef.current?.stops.some((s) => s.name === p.name)) &&
        !courseRemovedRef.current.includes(p.name);

      setCourseRemoved((r) => r.filter((n) => n !== p.name));
      setCourseAdded((a) => (a.some((x) => x.name === p.name) ? a : [...a, p]));

      if (!alreadyVisible) {
        pushCourseNotification("edited", `「${p.name}」을(를) 코스에 추가했어요.`);
      }
    },
    [pushCourseNotification],
  );

  const removeCourseStop = useCallback(
    (name: string) => {
      if (courseRemovedRef.current.includes(name)) return;

      const onCourse =
        courseAddedRef.current.some((x) => x.name === name) ||
        liveCourseRef.current?.stops.some((s) => s.name === name);
      if (!onCourse) return;

      setCourseAdded((a) => a.filter((x) => x.name !== name));
      setCourseRemoved((r) => (r.includes(name) ? r : [...r, name]));
      pushCourseNotification("edited", `「${name}」을(를) 코스에서 뺐어요.`);
    },
    [pushCourseNotification],
  );

  const liveSend = useCallback(
    async (t: string) => {
      if (liveLoadingRef.current) return;
      liveLoadingRef.current = true;
      setLiveLoading(true);
      setInput("");
      setSuggestions([]);
      const hist: PlannerMsg[] = [...messagesRef.current, { role: "user", text: t }];
      messagesRef.current = hist;
      setMessages(hist);
      try {
        const res = await chatRoute(
          hist.map((m) => ({
            role: m.role === "ai" ? "assistant" : "user",
            content: m.text,
          })),
          pet,
          livePlanRef.current,
        );
        const next: PlannerMsg[] = [
          ...hist,
          { role: "ai", text: res.reply, doc: !!res.course },
        ];
        messagesRef.current = next;
        setMessages(next);
        speakText(res.reply);
        livePlanRef.current = res.plan;
        setLivePlan(res.plan);
        setSuggestions(suggestionsForPlan(res.suggestions || [], res.plan));
        if (res.course) {
          setLiveCourse(dedupeRoutePlan(res.course));
          setCourseRemoved([]);
          setCourseAdded([]);
          setActiveStopIndex(0);
          setCourseRevision((n) => n + 1);
        }
      } catch {
        setMessages([
          ...hist,
          {
            role: "ai",
            text: "백엔드 연결에 문제가 생겼어요. 서버가 실행 중인지 확인해 주세요.",
          },
        ]);
      } finally {
        liveLoadingRef.current = false;
        setLiveLoading(false);
      }
    },
    [pet],
  );

  const recommendSend = useCallback(
    async (t: string, courseStops: CourseAddStop[]) => {
      if (liveLoadingRef.current) return;
      liveLoadingRef.current = true;
      setLiveLoading(true);
      setInput("");
      setSuggestions([]);
      const hist: PlannerMsg[] = [...messagesRef.current, { role: "user", text: t }];
      messagesRef.current = hist;
      setMessages(hist);
      try {
        const res = await recommendRoute(
          hist.map((m) => ({
            role: m.role === "ai" ? "assistant" : "user",
            content: m.text,
          })),
          courseStops,
          pet,
          livePlanRef.current,
        );
        const next: PlannerMsg[] = [...hist, { role: "ai", text: res.reply }];
        messagesRef.current = next;
        setMessages(next);
        speakText(res.reply);
        setSuggestions(suggestionsForPlan(res.suggestions || [], res.plan));
      } catch {
        setMessages([
          ...hist,
          { role: "ai", text: "추천을 불러오지 못했어요. 잠시 후 다시 시도해 주세요." },
        ]);
      } finally {
        liveLoadingRef.current = false;
        setLiveLoading(false);
      }
    },
    [pet],
  );

  const handleUserText = useCallback(
    (raw: string) => {
      const t = String(raw || "").trim();
      if (!t) return;

      const course = liveCourseRef.current;
      if (course) {
        if (wantsDedupeIntent(t)) {
          setInput("");
          setSuggestions([]);
          setMessages((m) => [...m, { role: "user", text: t }]);
          const current = withCourseEdits(course, courseRemovedRef.current, courseAddedRef.current);
          if (current) {
            const deduped = dedupeRoutePlan(current);
            if (deduped.stops.length < current.stops.length) {
              const removed = current.stops.length - deduped.stops.length;
              setLiveCourse(deduped);
              setCourseRemoved([]);
              setCourseAdded([]);
              pushAi(`같은 장소 ${removed}곳을 정리했어요.`);
            } else {
              pushAi("중복된 장소는 없어요.");
            }
          }
          return;
        }

        const stops: CourseAddStop[] = [
          ...course.stops.map((s) => ({
            name: s.name,
            category: s.category,
            latitude: s.latitude,
            longitude: s.longitude,
          })),
          ...courseAddedRef.current,
        ].filter((s) => !courseRemovedRef.current.includes(s.name));
        const names = stops.map((s) => s.name);
        const edit = parseCourseEdit(t, names, placePoolRef.current);
        const wantsRec = wantsRecommendIntent(t);

        if (edit && !wantsRec) {
          setInput("");
          setSuggestions([]);
          setMessages((m) => [...m, { role: "user", text: t }]);
          if (edit.action === "add") {
            addCourseStop({
              name: edit.place.name,
              category: edit.place.category,
              latitude: edit.place.latitude,
              longitude: edit.place.longitude,
            });
            pushAi(`${edit.place.name}을(를) 코스에 추가했어요.`);
          } else {
            removeCourseStop(edit.name);
            pushAi(`${edit.name}을(를) 코스에서 뺐어요.`);
          }
          return;
        }

        if (wantsRec) {
          let analyzed = stops;
          if (edit?.action === "remove") {
            removeCourseStop(edit.name);
            analyzed = stops.filter((s) => s.name !== edit.name);
          }
          recommendSend(t, analyzed);
          return;
        }
      }

      liveSend(t);
    },
    [addCourseStop, removeCourseStop, pushAi, liveSend, recommendSend],
  );

  const startVoice = useCallback(() => {
    if (listeningRef.current) return;
    const SR =
      (window as { SpeechRecognition?: unknown; webkitSpeechRecognition?: unknown })
        .SpeechRecognition ||
      (window as { webkitSpeechRecognition?: unknown }).webkitSpeechRecognition;
    if (!SR) {
      pushAi("이 브라우저는 음성 인식을 지원하지 않아요. 텍스트로 입력해 주세요.");
      return;
    }
    try {
      const rec = new (SR as new () => {
        lang: string;
        interimResults: boolean;
        maxAlternatives: number;
        onresult: (e: { results: { 0: { 0: { transcript: string } } } }) => void;
        onerror: () => void;
        onend: () => void;
        start: () => void;
      })();
      rec.lang = "ko-KR";
      rec.interimResults = false;
      rec.maxAlternatives = 1;
      listeningRef.current = true;
      setListening(true);
      rec.onresult = (e) => {
        const tr = e.results[0][0].transcript;
        listeningRef.current = false;
        setListening(false);
        handleUserText(tr);
      };
      rec.onerror = () => {
        listeningRef.current = false;
        setListening(false);
      };
      rec.onend = () => {
        listeningRef.current = false;
        setListening(false);
      };
      rec.start();
    } catch {
      listeningRef.current = false;
      setListening(false);
    }
  }, [handleUserText, pushAi]);

  const resetChat = useCallback(() => {
    setInput("");
    setLivePlan(null);
    livePlanRef.current = null;
    setLiveCourse(null);
    setCourseRemoved([]);
    setCourseAdded([]);
    setCourseNotifications([]);
    setMessages(buildEmptyWelcome(pet));
    setSuggestions(STARTER_SUGGESTIONS);
    setActiveStopIndex(0);
  }, [pet]);

  const toggleVoice = useCallback(() => {
    const on = toggleVoiceGuide();
    setVoiceEnabled(on);
    return on;
  }, []);

  useEffect(() => {
    setVoiceEnabled(isVoiceGuideEnabled());
  }, []);

  const activeStop = effectiveCourse?.stops[activeStopIndex] ?? null;

  return {
    messages,
    suggestions,
    input,
    setInput,
    listening,
    liveLoading,
    effectiveCourse,
    activeStop,
    activeStopIndex,
    setActiveStopIndex,
    handleUserText,
    startVoice,
    resetChat,
    toggleVoice,
    voiceEnabled,
    addCourseStop,
    removeCourseStop,
    region,
    livePlan,
    courseTitle: initialCourse?.title ?? (region ? `${region} 펫 동반 코스` : "펫 동반 코스"),
    courseNotifications,
    pushCourseNotification,
    courseRevision,
  };
}
