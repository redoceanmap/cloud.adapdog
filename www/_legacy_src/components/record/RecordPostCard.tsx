import { ChevronRight, Heart, ImageIcon, MessageCircle, MoreHorizontal, Route } from 'lucide-react';
import type { RecordPost } from '@/types';

interface RecordPostCardProps {
  post: RecordPost;
  onSaveCourse?: (post: RecordPost) => void;
}

export function RecordPostCard({ post, onSaveCourse }: RecordPostCardProps) {
  return (
    <article className="overflow-hidden rounded-3xl bg-surface shadow-sm ring-1 ring-line">
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-100 text-brand-600">
            <span className="text-lg">🐾</span>
          </div>
          <div>
            <p className="text-sm font-bold text-ink">{post.authorName}</p>
            <p className="text-xs text-ink-muted">
              {post.dogName} · {post.breed}
            </p>
          </div>
        </div>
        <button type="button" className="text-ink-muted" aria-label="더보기">
          <MoreHorizontal size={18} />
        </button>
      </div>

      <div className="relative aspect-[4/3] bg-surface-muted">
        {post.photoUrl ? (
          <img src={post.photoUrl} alt="" className="h-full w-full object-cover" />
        ) : (
          <div className="flex h-full flex-col items-center justify-center text-ink-muted/70">
            <ImageIcon size={40} />
            <span className="mt-2 text-sm">여행 사진</span>
          </div>
        )}
      </div>

      <div className="px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4 text-sm">
            <span className="flex items-center gap-1 font-semibold text-rose-500">
              <Heart size={16} className="fill-rose-500" />
              {post.likes}
            </span>
            <span className="flex items-center gap-1 text-ink-muted">
              <MessageCircle size={16} />
              {post.comments}
            </span>
          </div>
          <span className="flex items-center gap-1 rounded-full bg-brand-50 px-2.5 py-1 text-[11px] font-medium text-brand-700">
            <span className="h-1.5 w-1.5 rounded-full bg-brand-500" />
            {post.location}
          </span>
        </div>
        <p className="mt-2 text-sm leading-relaxed text-ink-muted">{post.caption}</p>
      </div>

      <button
        type="button"
        onClick={() => onSaveCourse?.(post)}
        className="flex w-full items-center justify-between border-t border-line bg-canvas/50 px-4 py-3 text-left transition hover:bg-canvas"
      >
        <span className="flex items-center gap-2 text-xs font-semibold text-ink">
          <Route size={14} className="text-brand-500" />이 코스 그대로 담기 · {post.courseTitle}
        </span>
        <ChevronRight size={16} className="text-ink-muted" />
      </button>
    </article>
  );
}
