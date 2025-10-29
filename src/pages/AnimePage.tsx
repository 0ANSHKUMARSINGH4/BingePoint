import { useEffect, useState } from 'react';
import MediaSection from '../components/MediaSection';
import MediaModal from '../components/MediaModal';
import { TVShow, MediaType } from '../types/tmdb';
import { tmdbApi } from '../services/tmdb';

export default function AnimePage() {
  const [animeShows, setAnimeShows] = useState<TVShow[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMedia, setSelectedMedia] = useState<{ id: number; type: MediaType } | null>(null);

  useEffect(() => {
    loadAnime();
  }, []);

  const loadAnime = async () => {
    setLoading(true);
    try {
      const data = await tmdbApi.getAnime();
      setAnimeShows(data.results || []);
    } catch (error) {
      console.error('Error loading anime:', error);
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
        <h1 className="text-4xl font-bold text-white">Anime</h1>
        <p className="mt-2 text-gray-400">Discover the most popular anime series</p>
      </div>

      <MediaSection
        title="Popular Anime"
        items={animeShows}
        mediaType="anime"
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
