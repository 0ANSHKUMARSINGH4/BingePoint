import { Star } from 'lucide-react';
import { Movie, TVShow, MediaType } from '../types/tmdb';
import { tmdbApi } from '../services/tmdb';

interface MediaCardProps {
  media: Movie | TVShow;
  mediaType: MediaType;
  onClick: () => void;
}

export default function MediaCard({ media, mediaType, onClick }: MediaCardProps) {
  const title = 'title' in media ? media.title : media.name;
  const date = 'release_date' in media ? media.release_date : media.first_air_date;
  const year = date ? new Date(date).getFullYear() : 'N/A';

  return (
    <div
      onClick={onClick}
      className="group relative cursor-pointer overflow-hidden rounded-xl bg-slate-800 transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-cyan-500/20"
    >
      <div className="aspect-[2/3] overflow-hidden">
        <img
          src={tmdbApi.getImageUrl(media.poster_path)}
          alt={title}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
        />
      </div>

      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100">
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <h3 className="text-lg font-bold text-white line-clamp-2">{title}</h3>
          <div className="mt-2 flex items-center justify-between">
            <span className="text-sm text-gray-300">{year}</span>
            <div className="flex items-center gap-1 text-yellow-400">
              <Star className="h-4 w-4 fill-current" />
              <span className="text-sm font-semibold">{media.vote_average.toFixed(1)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
