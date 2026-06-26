import { mockRecordPosts } from '@/data/mockRecords';
import type { RecordPost } from '@/types';
import { RecordPostCard } from './RecordPostCard';

interface RecordScreenProps {
  posts?: RecordPost[];
  onSaveCourse?: (post: RecordPost) => void;
}

export function RecordScreen({ posts = mockRecordPosts, onSaveCourse }: RecordScreenProps) {
  return (
    <div className="min-h-[calc(100dvh-4.5rem)] bg-canvas pb-28">
      <header className="sticky top-0 z-10 bg-canvas/95 px-5 pb-4 pt-6 backdrop-blur-md">
        <h1 className="text-xl font-bold text-ink">여행 기록</h1>
        <p className="mt-1 text-sm text-ink-muted">다른 보호자들의 반려견 동반 코스를 둘러보세요</p>
      </header>

      <div className="mx-auto max-w-lg space-y-5 px-4">
        {posts.map((post) => (
          <RecordPostCard key={post.id} post={post} onSaveCourse={onSaveCourse} />
        ))}
      </div>
    </div>
  );
}
