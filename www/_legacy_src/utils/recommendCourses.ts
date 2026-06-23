import { mockRecommendedCourses } from '@/data/mockRecommendedCourses';
import type {
  ActivityLevel,
  PersonalizedCourse,
  RecommendedCourse,
  RegisteredDog,
} from '@/types';
import { isGangneungCourse } from '@/utils/region';

const gangneungCourses = mockRecommendedCourses.filter(isGangneungCourse);

type CourseFit = {
  activity: ActivityLevel;
  indoor: number;
  outdoor: number;
  water: number;
  shortTrip: number;
  barrierFree: number;
  days: 1 | 2;
};

const courseFitMap: Record<string, CourseFit> = {
  'rec-gangneung-sea-cafe': {
    activity: 'high',
    indoor: 0.6,
    outdoor: 0.9,
    water: 1,
    shortTrip: 0.2,
    barrierFree: 0.3,
    days: 2,
  },
  'rec-barrier-gangneung': {
    activity: 'low',
    indoor: 0.8,
    outdoor: 0.5,
    water: 0.2,
    shortTrip: 0.9,
    barrierFree: 1,
    days: 1,
  },
  'rec-gangneung-heritage': {
    activity: 'moderate',
    indoor: 0.2,
    outdoor: 0.9,
    water: 0.7,
    shortTrip: 0.6,
    barrierFree: 0.4,
    days: 1,
  },
  'rec-gangneung-jungdong': {
    activity: 'moderate',
    indoor: 0.1,
    outdoor: 1,
    water: 0.9,
    shortTrip: 0.5,
    barrierFree: 0.3,
    days: 1,
  },
  'rec-gangneung-anmok': {
    activity: 'low',
    indoor: 0.9,
    outdoor: 0.7,
    water: 0.6,
    shortTrip: 1,
    barrierFree: 0.6,
    days: 1,
  },
};

const activityScore: Record<ActivityLevel, Record<ActivityLevel, number>> = {
  low: { low: 18, moderate: 8, high: 0 },
  moderate: { low: 6, moderate: 18, high: 10 },
  high: { low: 0, moderate: 8, high: 18 },
};

function traitScore(dog: RegisteredDog, fit: CourseFit): number {
  const traits = dog.traits.join(' ');
  let score = 0;

  if (/실내|카페|짧은/.test(traits)) score += fit.indoor * 12;
  if (/활발|산책|트레킹|캠핑/.test(traits)) score += fit.outdoor * 10;
  if (/물놀이|해변|수영/.test(traits)) score += fit.water * 14;
  if (/온순|소형|짧은/.test(traits) || dog.weightKg < 8) score += fit.shortTrip * 10;
  if (/휠체어|유모차|이동약자|배려/.test(traits)) score += fit.barrierFree * 12;

  if (dog.activityLevel === 'low' && fit.days === 1) score += 8;
  if (dog.activityLevel === 'high' && fit.days === 2) score += 6;

  return score;
}

function buildMatchReason(dog: RegisteredDog, course: RecommendedCourse, score: number): string {
  const traits = dog.traits.join(' ');

  if (course.id === 'rec-gangneung-anmok' && (dog.activityLevel === 'low' || /실내|짧은/.test(traits))) {
    return `${dog.name} · 강릉 카페·짧은 산책에 맞춤`;
  }
  if (course.id === 'rec-gangneung-sea-cafe' && (/물놀이|활발/.test(traits) || dog.activityLevel === 'high')) {
    return `${dog.name} · 강릉 해변·활동량 높은 성향에 맞춤`;
  }
  if (course.id === 'rec-barrier-gangneung' && (dog.weightKg < 8 || /실내|온순/.test(traits))) {
    return `${dog.name} · 강릉 이동약자 배려 동선`;
  }
  if (course.id === 'rec-gangneung-jungdong' && /산책|사진|호기심/.test(traits)) {
    return `${dog.name} · 정동진 해변·탐험 성향에 맞춤`;
  }
  if (course.id === 'rec-gangneung-heritage' && dog.activityLevel === 'moderate') {
    return `${dog.name} · 오죽헌·경포호 균형 코스`;
  }

  if (score >= 90) return `${dog.name}에게 가장 잘 맞는 강릉 코스예요`;
  if (score >= 80) return `${dog.name} · 강릉 여행 성격·활동량 기준 추천`;
  return `${dog.name} · 함께 다녀보기 좋은 강릉 코스`;
}

function scoreCourse(dog: RegisteredDog, course: RecommendedCourse): number {
  const fit = courseFitMap[course.id];
  if (!fit) return 60;

  let score = 58;
  score += activityScore[dog.activityLevel][fit.activity];
  score += traitScore(dog, fit);

  if (dog.personality.includes('카페')) score += fit.indoor * 6;
  if (dog.personality.includes('해변') || dog.personality.includes('강변')) score += fit.water * 8;
  if (dog.personality.includes('트레킹') || dog.personality.includes('잔디')) score += fit.outdoor * 6;

  return Math.min(99, Math.round(score));
}

export function getPersonalizedCourses(dog: RegisteredDog | null | undefined): PersonalizedCourse[] {
  if (!dog) {
    return gangneungCourses.slice(0, 3).map((course, index) => ({
      ...course,
      matchScore: 85 - index * 5,
      matchReason: '반려견을 선택하면 강릉 맞춤 점수가 표시돼요',
      rank: index + 1,
    }));
  }

  const scored = gangneungCourses
    .map((course) => {
      const matchScore = scoreCourse(dog, course);
      return {
        ...course,
        matchScore,
        matchReason: buildMatchReason(dog, course, matchScore),
        rank: 0,
      };
    })
    .sort((a, b) => b.matchScore - a.matchScore);

  return scored.slice(0, 3).map((course, index) => ({
    ...course,
    rank: index + 1,
    highlights: [course.matchReason, ...course.highlights.slice(0, 1)],
  }));
}
