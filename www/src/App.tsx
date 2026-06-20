import { useCallback, useMemo, useState } from 'react';
import { fetchPlaces } from '@/api/places';
import { CoursePage, RecommendedCoursesScreen } from '@/components/course';
import { ExploreScreen } from '@/components/explore';
import { HomeContainer } from '@/components/home';
import { BottomNav, type AppTab } from '@/components/layout/BottomNav';
import { ProfileScreen } from '@/components/profile';
import { RecordScreen } from '@/components/record';
import { mockPlaces } from '@/data/mockPlaces';
import { useFetch } from '@/hooks/useFetch';
import type { AuthUser } from '@/types/auth';
import type { CourseStop, PersonalizedCourse, Place, RegisteredDog, TravelCourse } from '@/types';
import { buildCustomCourse, placeToCourseStop } from '@/utils/courseBuilder';
import { getPersonalizedCourses } from '@/utils/recommendCourses';
import { loadAuthUser, saveAuthUser } from '@/utils/authStorage';
import { saveAuthToken } from '@/utils/authToken';

const USE_MOCK = import.meta.env.VITE_USE_MOCK !== 'false';

async function loadPlaces() {
  if (USE_MOCK) {
    await new Promise((resolve) => setTimeout(resolve, 600));
    return mockPlaces;
  }
  return fetchPlaces();
}

export default function App() {
  const [activeTab, setActiveTab] = useState<AppTab>('home');
  const [selectedDog, setSelectedDog] = useState<RegisteredDog | null>(null);
  const [user, setUser] = useState<AuthUser | null>(() => loadAuthUser());
  const [courseView, setCourseView] = useState<'list' | 'detail'>('list');
  const [activeCourse, setActiveCourse] = useState<TravelCourse | null>(null);
  const [draftStops, setDraftStops] = useState<CourseStop[]>([]);

  const fetcher = useCallback(() => loadPlaces(), []);
  const { data: places, loading, error, refetch } = useFetch(fetcher, []);

  const personalizedCourses = useMemo(
    () => getPersonalizedCourses(selectedDog),
    [selectedDog],
  );

  const handleGoToProfile = useCallback(() => {
    setActiveTab('profile');
  }, []);

  const handleLoginSuccess = (loggedInUser: AuthUser) => {
    saveAuthUser(loggedInUser);
    setUser(loggedInUser);
    setActiveTab('home');
  };

  const handleLogout = () => {
    saveAuthUser(null);
    saveAuthToken(null);
    setUser(null);
    setActiveTab('profile');
  };

  const handleExploreCourse = (dog: RegisteredDog) => {
    setSelectedDog(dog);
    setCourseView('list');
    setActiveCourse(null);
    setActiveTab('course');
  };

  const handleSelectRecommendedCourse = (course: PersonalizedCourse) => {
    setActiveCourse(course.course);
    setCourseView('detail');
  };

  const handleBackFromCourse = () => {
    setCourseView('list');
    setActiveCourse(null);
  };

  const handleViewCustomCourse = () => {
    if (draftStops.length === 0) return;
    setActiveCourse(buildCustomCourse(draftStops, selectedDog?.name));
    setCourseView('detail');
    setActiveTab('course');
  };

  const handleTogglePlaceInDraft = (placeId: string, place: Place) => {
    setDraftStops((prev) => {
      const draftId = `draft-${placeId}`;
      const exists = prev.some((stop) => stop.id === draftId);
      const next = exists
        ? prev.filter((stop) => stop.id !== draftId)
        : [...prev, placeToCourseStop(place, prev.length + 1)];
      return next.map((stop, index) => ({ ...stop, order: index + 1 }));
    });
  };

  const handleTabChange = (tab: AppTab) => {
    if (tab === 'course' && activeTab !== 'course') {
      setCourseView('list');
      setActiveCourse(null);
    }
    setActiveTab(tab);
  };

  const handleRecord = (dog: RegisteredDog) => {
    setSelectedDog(dog);
    setActiveTab('record');
  };

  const handleDogUpdate = (dog: RegisteredDog) => {
    setSelectedDog((prev) => (prev?.id === dog.id ? dog : prev));
  };

  return (
    <div className="flex min-h-dvh flex-col bg-canvas">
      <main className="flex-1">
        <div className={activeTab === 'home' ? undefined : 'hidden'}>
          <HomeContainer
            user={user}
            onGoToProfile={handleGoToProfile}
            onExploreCourse={handleExploreCourse}
            onRecord={handleRecord}
            onDogUpdate={handleDogUpdate}
          />
        </div>
        {activeTab === 'explore' && (
          <ExploreScreen
            places={places ?? []}
            loading={loading}
            error={error}
            onRetry={refetch}
            dog={selectedDog}
            selectedPlaceIds={draftStops.map((stop) => stop.id.replace('draft-', ''))}
            onTogglePlace={handleTogglePlaceInDraft}
            onViewCustomCourse={handleViewCustomCourse}
          />
        )}
        {activeTab === 'course' &&
          (courseView === 'detail' && activeCourse ? (
            <CoursePage
              course={activeCourse}
              dog={selectedDog}
              onBack={handleBackFromCourse}
            />
          ) : (
            <RecommendedCoursesScreen
              courses={personalizedCourses}
              dogName={selectedDog?.name}
              dogBreed={selectedDog?.breed}
              customStopCount={draftStops.length}
              onSelectCourse={handleSelectRecommendedCourse}
              onViewCustomCourse={draftStops.length > 0 ? handleViewCustomCourse : undefined}
            />
          ))}
        {activeTab === 'record' && (
          <RecordScreen
            onSaveCourse={() => {
              setCourseView('list');
              setActiveCourse(null);
              setActiveTab('course');
            }}
          />
        )}
        {activeTab === 'profile' && (
          <ProfileScreen
            user={user}
            onLoginSuccess={handleLoginSuccess}
            onLogout={handleLogout}
          />
        )}
      </main>

      <BottomNav activeTab={activeTab} onChange={handleTabChange} />
    </div>
  );
}
