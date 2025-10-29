import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Play, Info } from 'lucide-react';
import { Movie, TVShow } from '../types/tmdb';
import { tmdbApi } from '../services/tmdb';

interface CarouselProps {
  items: (Movie | TVShow)[];
  onPlayClick: (id: number, type: 'movie' | 'tv') => void;
}

export default function Carousel({ items, onPlayClick }: CarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  const currentItem = items[currentIndex];
  const title = currentItem && ('title' in currentItem ? currentItem.title : currentItem.name);
  const mediaType = currentItem && 'title' in currentItem ? 'movie' : 'tv';

  useEffect(() => {
    if (!isAutoPlaying || items.length === 0) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % items.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [isAutoPlaying, items.length]);

  const goToPrevious = () => {
    setIsAutoPlaying(false);
    setCurrentIndex((prev) => (prev - 1 + items.length) % items.length);
  };

  const goToNext = () => {
    setIsAutoPlaying(false);
    setCurrentIndex((prev) => (prev + 1) % items.length);
  };

  if (!items || items.length === 0) return null;

  return (
    <div className="relative mb-12 h-[70vh] overflow-hidden rounded-2xl">
      <div className="absolute inset-0">
        <img
          src={tmdbApi.getImageUrl(currentItem.backdrop_path, 'original')}
          alt={title}
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/70 to-transparent"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent"></div>
      </div>

      <div className="relative z-10 flex h-full items-center">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl space-y-4">
            <h1 className="text-5xl font-bold text-white md:text-6xl">{title}</h1>
            <p className="text-lg text-gray-200 line-clamp-3">{currentItem.overview}</p>

            <div className="flex items-center gap-4">
              <button
                onClick={() => onPlayClick(currentItem.id, mediaType)}
                className="flex items-center gap-2 rounded-lg bg-cyan-500 px-8 py-3 font-semibold text-white transition-all hover:bg-cyan-600 hover:shadow-lg hover:shadow-cyan-500/50"
              >
                <Play className="h-5 w-5 fill-current" />
                Watch Now
              </button>
              <button
                onClick={() => onPlayClick(currentItem.id, mediaType)}
                className="flex items-center gap-2 rounded-lg border-2 border-white/50 bg-white/10 px-8 py-3 font-semibold text-white backdrop-blur-sm transition-all hover:bg-white/20"
              >
                <Info className="h-5 w-5" />
                More Info
              </button>
            </div>

            <div className="flex gap-2">
              {items.slice(0, 10).map((_, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setCurrentIndex(index);
                    setIsAutoPlaying(false);
                  }}
                  className={`h-1 rounded-full transition-all ${
                    index === currentIndex ? 'w-8 bg-cyan-500' : 'w-6 bg-white/50'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      <button
        onClick={goToPrevious}
        className="absolute left-4 top-1/2 z-20 -translate-y-1/2 rounded-full bg-black/50 p-3 text-white backdrop-blur-sm transition-all hover:bg-black/70 hover:scale-110"
      >
        <ChevronLeft className="h-8 w-8" />
      </button>

      <button
        onClick={goToNext}
        className="absolute right-4 top-1/2 z-20 -translate-y-1/2 rounded-full bg-black/50 p-3 text-white backdrop-blur-sm transition-all hover:bg-black/70 hover:scale-110"
      >
        <ChevronRight className="h-8 w-8" />
      </button>
    </div>
  );
}
