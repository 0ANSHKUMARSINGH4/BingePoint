import { Movie, TVShow, MediaType } from '../types/tmdb';
import MediaCard from './MediaCard';

interface MediaSectionProps {
  title: string;
  items: (Movie | TVShow)[];
  mediaType: MediaType;
  onItemClick: (id: number, type: MediaType) => void;
}

export default function MediaSection({ title, items, mediaType, onItemClick }: MediaSectionProps) {
  if (!items || items.length === 0) return null;

  return (
    <section className="mb-12">
      <h2 className="mb-6 text-3xl font-bold text-white">{title}</h2>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
        {items.map((item) => (
          <MediaCard
            key={item.id}
            media={item}
            mediaType={mediaType}
            onClick={() => onItemClick(item.id, mediaType)}
          />
        ))}
      </div>
    </section>
  );
}
