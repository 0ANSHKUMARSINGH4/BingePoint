import { useEffect, useState } from 'react';
import MediaSection from '../components/MediaSection';
import MediaModal from '../components/MediaModal';
import { Movie, MediaType } from '../types/tmdb';
import { tmdbApi } from '../services/tmdb';

export default function MoviesPage() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMedia, setSelectedMedia] = useState<{ id: number; type: MediaType } | null>(null);

  useEffect(() => {
    loadMovies();
  }, []);

  const loadMovies = async () => {
    setLoading(true);
    try {
      const [trending, popular] = await Promise.all([
        tmdbApi.getTrending('movie', 'week'),
        tmdbApi.discoverMovies(),
      ]);

      const allMovies = [...(trending.results || []), ...(popular.results || [])];
      const uniqueMovies = Array.from(new Map(allMovies.map(m => [m.id, m])).values());
      setMovies(uniqueMovies);
    } catch (error) {
      console.error('Error loading movies:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleMediaClick = (id: number, type: MediaType) => {
    setSelectedMedia({ id, type });
  };

  const handleCloseModal = () => {
    setSelectedMedia(null);
  };

  if (loading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="h-16 w-16 animate-spin rounded-full border-4 border-cyan-500 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <>
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-white">Movies</h1>
        <p className="mt-2 text-gray-400">Discover the latest and most popular movies</p>
      </div>

      <MediaSection
        title="All Movies"
        items={movies}
        mediaType="movie"
        onItemClick={handleMediaClick}
      />

      {selectedMedia && (
        <MediaModal
          isOpen={!!selectedMedia}
          onClose={handleCloseModal}
          mediaId={selectedMedia.id}
          mediaType={selectedMedia.type}
        />
      )}
    </>
  );
}
