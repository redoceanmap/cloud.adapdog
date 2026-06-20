import { useCallback, useEffect, useState } from 'react';
import {
  Bell,
  BookOpen,
  Check,
  ChevronRight,
  LogIn,
  LogOut,
  PawPrint,
  Settings,
  Shield,
  Sparkles,
  User,
  UserPlus,
} from 'lucide-react';
import { AuthModal, type AuthMode } from '@/components/auth';
import { AvatarEditModal } from './AvatarEditModal';
import { ProfileAvatar } from './ProfileAvatar';
import {
  AppSettingsPanel,
  NotificationSettingsPanel,
  PrivacySettingsPanel,
} from './settings';
import { DEFAULT_STATUS_PLACEHOLDER, INTEREST_TAG_OPTIONS } from '@/data/profileOptions';
import type { AuthUser } from '@/types/auth';
import type { UserProfile } from '@/types/profile';
import { loadUserProfile, saveUserProfile } from '@/utils/profileStorage';

interface ProfileScreenProps {
  user: AuthUser | null;
  onLoginSuccess: (user: AuthUser) => void;
  onLogout: () => void;
}

type SettingsView = 'none' | 'notifications' | 'privacy' | 'app';

export function ProfileScreen({ user, onLoginSuccess, onLogout }: ProfileScreenProps) {
  const [authOpen, setAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState<AuthMode>('login');
  const [avatarOpen, setAvatarOpen] = useState(false);
  const [settingsView, setSettingsView] = useState<SettingsView>('none');
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [draftInterestTags, setDraftInterestTags] = useState<string[]>([]);
  const [tagSaveNotice, setTagSaveNotice] = useState<string | null>(null);

  const openAuth = useCallback((mode: AuthMode) => {
    setAuthMode(mode);
    setAuthOpen(true);
  }, []);

  useEffect(() => {
    if (!user) {
      setProfile(null);
      return;
    }
    setProfile(loadUserProfile(user.id));
  }, [user]);

  useEffect(() => {
    if (!profile) return;
    setDraftInterestTags(profile.interestTags);
  }, [profile?.interestTags, user?.id]);

  useEffect(() => {
    if (!tagSaveNotice) return;
    const timer = window.setTimeout(() => setTagSaveNotice(null), 2500);
    return () => window.clearTimeout(timer);
  }, [tagSaveNotice]);

  const interestTagsChanged =
    profile !== null &&
    [...draftInterestTags].sort().join(',') !== [...profile.interestTags].sort().join(',');

  const updateProfile = useCallback(
    (patch: Partial<UserProfile>) => {
      if (!user) return;
      setProfile((prev) => {
        const next = { ...(prev ?? loadUserProfile(user.id)), ...patch };
        saveUserProfile(user.id, next);
        return next;
      });
    },
    [user],
  );

  const toggleInterestTag = (tagId: string) => {
    setDraftInterestTags((prev) =>
      prev.includes(tagId) ? prev.filter((id) => id !== tagId) : [...prev, tagId],
    );
  };

  const saveInterestTags = () => {
    if (!profile || !interestTagsChanged) return;
    updateProfile({ interestTags: draftInterestTags });
    setTagSaveNotice('관심 태그를 저장했어요');
  };

  const resetInterestTags = () => {
    if (!profile) return;
    setDraftInterestTags(profile.interestTags);
  };

  return (
    <div className="mx-auto min-h-[calc(100dvh-4.5rem)] max-w-lg px-5 pb-28 pt-8 text-ink">
      <header className="mb-6">
        <div className="mb-1 flex items-center gap-2 text-brand-600">
          <PawPrint size={22} />
          <span className="text-sm font-semibold">발자국</span>
        </div>
        <h1 className="text-2xl font-bold text-ink">프로필</h1>
        <p className="mt-1 text-sm text-ink-muted">계정과 앱 설정을 관리해요</p>
      </header>

      {user && profile ? (
        <>
          <section className="mb-5 overflow-hidden rounded-3xl bg-gradient-to-br from-brand-500 to-emerald-400 p-[1px] shadow-lg shadow-brand-900/10">
            <div className="rounded-[calc(1.5rem-1px)] bg-gradient-to-br from-surface-muted via-canvas to-brand-50/30 p-5">
              <div className="flex items-start gap-4">
                <ProfileAvatar
                  profile={profile}
                  editable
                  onEdit={() => setAvatarOpen(true)}
                />
                <div className="min-w-0 flex-1">
                  <p className="text-lg font-bold text-ink">{user.name}님</p>
                  <label className="mt-2 block">
                    <span className="sr-only">상태 메시지</span>
                    <input
                      type="text"
                      value={profile.statusMessage}
                      onChange={(e) => updateProfile({ statusMessage: e.target.value })}
                      maxLength={40}
                      placeholder={DEFAULT_STATUS_PLACEHOLDER}
                      className="w-full rounded-xl border border-transparent bg-surface/70 px-3 py-2 text-sm text-ink outline-none transition placeholder:text-ink-muted focus:border-brand-300 focus:bg-surface focus:ring-2 focus:ring-brand-100"
                    />
                  </label>
                  <p className="mt-1 text-xs text-ink-muted">{user.email}</p>
                </div>
              </div>
            </div>
          </section>

          <section className="mb-5 rounded-3xl bg-surface p-5 shadow-sm ring-1 ring-line">
            <h3 className="mb-1 flex items-center gap-1.5 text-sm font-bold text-ink">
              <Sparkles size={15} className="text-brand-500" />
              관심 여행 스타일
            </h3>
            <p className="mb-3 text-xs text-ink-muted">
              태그를 고른 뒤 저장하면 맞춤 추천에 반영돼요
            </p>
            <div className="flex flex-wrap gap-2">
              {INTEREST_TAG_OPTIONS.map((tag) => {
                const selected = draftInterestTags.includes(tag.id);
                return (
                  <button
                    key={tag.id}
                    type="button"
                    onClick={() => toggleInterestTag(tag.id)}
                    className={`rounded-full px-3.5 py-2 text-xs font-semibold transition ${
                      selected
                        ? 'bg-brand-500 text-white shadow-sm shadow-brand-500/25'
                        : 'bg-canvas text-ink-muted ring-1 ring-orange-100 hover:bg-brand-50 hover:text-brand-700'
                    }`}
                  >
                    {tag.label}
                  </button>
                );
              })}
            </div>

            <div className="mt-4 flex items-center gap-2">
              <button
                type="button"
                onClick={saveInterestTags}
                disabled={!interestTagsChanged}
                className="flex flex-1 items-center justify-center gap-1.5 rounded-full bg-brand-500 py-2.5 text-sm font-bold text-white shadow-md shadow-brand-500/20 transition hover:bg-brand-600 disabled:cursor-not-allowed disabled:bg-line disabled:shadow-none"
              >
                <Check size={16} />
                저장하기
              </button>
              {interestTagsChanged && (
                <button
                  type="button"
                  onClick={resetInterestTags}
                  className="rounded-full border border-line bg-surface px-4 py-2.5 text-sm font-semibold text-ink-muted transition hover:bg-surface-muted"
                >
                  취소
                </button>
              )}
            </div>

            {tagSaveNotice && (
              <p className="mt-3 rounded-xl bg-brand-50 px-3 py-2 text-center text-xs font-semibold text-brand-700">
                {tagSaveNotice}
              </p>
            )}
          </section>

          <ProfileSection title="내 기록" icon={BookOpen}>
            <ProfileMenuItem
              label="나의 여행 기록"
              description="다녀온 코스와 사진을 확인해요"
              onClick={() => {}}
            />
            <ProfileMenuItem
              label="저장한 코스"
              description="북마크한 코스 목록"
              onClick={() => {}}
            />
          </ProfileSection>

          <ProfileSection title="설정" icon={Settings}>
            <ProfileMenuItem
              label="알림 설정"
              icon={Bell}
              onClick={() => setSettingsView('notifications')}
            />
            <ProfileMenuItem
              label="개인정보 보호"
              icon={Shield}
              onClick={() => setSettingsView('privacy')}
            />
            <ProfileMenuItem
              label="앱 설정"
              icon={Settings}
              onClick={() => setSettingsView('app')}
            />
          </ProfileSection>

          <button
            type="button"
            onClick={onLogout}
            className="mb-5 flex w-full items-center justify-center gap-2 rounded-2xl border-2 border-line bg-surface py-3.5 text-sm font-semibold text-ink transition hover:border-brand-200 hover:bg-brand-50"
          >
            <LogOut size={16} />
            로그아웃
          </button>

          <NotificationSettingsPanel
            isOpen={settingsView === 'notifications'}
            userId={user.id}
            onClose={() => setSettingsView('none')}
          />
          <PrivacySettingsPanel
            isOpen={settingsView === 'privacy'}
            userId={user.id}
            onClose={() => setSettingsView('none')}
            onLogout={onLogout}
          />
          <AppSettingsPanel
            isOpen={settingsView === 'app'}
            onClose={() => setSettingsView('none')}
          />

          <AvatarEditModal
            isOpen={avatarOpen}
            profile={profile}
            onClose={() => setAvatarOpen(false)}
            onSave={(avatar) => updateProfile(avatar)}
          />
        </>
      ) : user ? null : (
        <>
          <section className="mb-6 rounded-3xl bg-surface p-6 text-center shadow-sm ring-1 ring-line">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-brand-50 text-brand-500">
              <User size={32} />
            </div>
            <h2 className="font-bold text-ink">로그인이 필요해요</h2>
            <p className="mt-2 text-sm leading-relaxed text-ink-muted">
              로그인하면 나의 기록 저장, 코스 북마크,
              <br />
              맞춤 알림을 이용할 수 있어요.
            </p>
            <div className="mt-5 flex gap-3">
              <button
                type="button"
                onClick={() => openAuth('login')}
                className="flex flex-1 items-center justify-center gap-1.5 rounded-full border-2 border-brand-200 bg-surface py-3 text-sm font-bold text-brand-700 transition hover:bg-brand-50"
              >
                <LogIn size={16} />
                로그인
              </button>
              <button
                type="button"
                onClick={() => openAuth('signup')}
                className="flex flex-1 items-center justify-center gap-1.5 rounded-full bg-brand-500 py-3 text-sm font-bold text-white shadow-md shadow-brand-500/20 transition hover:bg-brand-600"
              >
                <UserPlus size={16} />
                회원가입
              </button>
            </div>
          </section>

          <ProfileSection title="설정" icon={Settings}>
            <ProfileMenuItem label="알림 설정" icon={Bell} onClick={() => openAuth('login')} />
            <ProfileMenuItem label="개인정보 보호" icon={Shield} onClick={() => openAuth('login')} />
            <ProfileMenuItem label="앱 설정" icon={Settings} onClick={() => setSettingsView('app')} />
          </ProfileSection>

          <AppSettingsPanel
            isOpen={settingsView === 'app'}
            onClose={() => setSettingsView('none')}
          />
        </>
      )}

      <AuthModal
        isOpen={authOpen}
        initialMode={authMode}
        onClose={() => setAuthOpen(false)}
        onSuccess={onLoginSuccess}
      />
    </div>
  );
}

function ProfileSection({
  title,
  icon: Icon,
  children,
}: {
  title: string;
  icon: typeof Settings;
  children: React.ReactNode;
}) {
  return (
    <section className="mb-5">
      <h3 className="mb-2 flex items-center gap-1.5 px-1 text-sm font-bold text-ink">
        <Icon size={15} className="text-brand-500" />
        {title}
      </h3>
      <div className="overflow-hidden rounded-3xl bg-surface shadow-sm ring-1 ring-line">
        {children}
      </div>
    </section>
  );
}

function ProfileMenuItem({
  label,
  description,
  icon: Icon,
  onClick,
}: {
  label: string;
  description?: string;
  icon?: typeof Settings;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex w-full items-center gap-3 border-b border-line/50 px-4 py-3.5 text-left last:border-b-0 transition hover:bg-canvas/50"
    >
      {Icon && (
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl bg-surface-muted text-ink-muted">
          <Icon size={16} />
        </span>
      )}
      <div className="min-w-0 flex-1">
        <p className="text-sm font-semibold text-ink">{label}</p>
        {description && <p className="text-xs text-ink-muted">{description}</p>}
      </div>
      <ChevronRight size={16} className="shrink-0 text-ink-muted/70" />
    </button>
  );
}
