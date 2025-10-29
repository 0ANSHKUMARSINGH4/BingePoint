import { useEffect, useState } from 'react';
import MediaSection from '../components/MediaSection';
import MediaModal from '../components/MediaModal';
import { TVShow, MediaType } from '../types/tmdb';
import { tmdbApi } from '../services/tmdb';

export default function TVShowsPage() {
  const [tvShows, setTVShows] = useState<TVShow[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMedia, setSelectedMedia] = useState<{ id: number; type: MediaType } | null>(null);

  useEffect(() => {
    loadTVShows();
  }, []);

  const loadTVShows = async () => {
    setLoading(true);
    try {
      const [trending, popular] = await Promise.all([
        tmdbApi.getTrending('tv', 'week'),
        tmdbApi.discoverTVShows(),
      ]);

      const allShows = [...(trending.results || []), ...(popular.results || [])];
      const uniqueShows = Array.from(new Map(allShows.map(s => [s.id, s])).values());
      setTVShows(uniqueShows);
    } catch (error) {
      console.error('Error loading TV shows:', error);
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
        <h1 className="text-4xl font-bold text-white">TV Shows</h1>
        <p className="mt-2 text-gray-400">Discover the latest and most popular TV shows</p>
      </div>

      <MediaSection
        title="All TV Shows"
        items={tvShows}
        mediaType="tv"
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
