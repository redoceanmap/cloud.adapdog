import { PawPrint } from 'lucide-react';

interface DogPhotoProps {
  src: string;
  alt: string;
  className?: string;
  iconSize?: number;
}

export function DogPhoto({ src, alt, className = '', iconSize = 24 }: DogPhotoProps) {
  if (src) {
    return <img src={src} alt={alt} className={className} />;
  }

  return (
    <div
      className={`flex items-center justify-center bg-surface-muted text-brand-400 ${className}`}
      aria-hidden={!alt}
    >
      <PawPrint size={iconSize} />
    </div>
  );
}
