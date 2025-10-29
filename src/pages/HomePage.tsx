import { useEffect, useState } from 'react';
import Carousel from '../components/Carousel';
import MediaSection from '../components/MediaSection';
import MediaModal from '../components/MediaModal';
import { Movie, TVShow, MediaType } from '../types/tmdb';
import { tmdbApi } from '../services/tmdb';

interface HomePageProps {
  searchResults: (Movie | TVShow)[];
  isSearching: boolean;
}

export default function HomePage({ searchResults, isSearching }: HomePageProps) {
  const [trendingMovies, setTrendingMovies] = useState<Movie[]>([]);
  const [trendingTVShows, setTrendingTVShows] = useState<TVShow[]>([]);
  const [animeShows, setAnimeShows] = useState<TVShow[]>([]);
  const [carouselItems, setCarouselItems] = useState<(Movie | TVShow)[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMedia, setSelectedMedia] = useState<{ id: number; type: MediaType } | null>(null);

  useEffect(() => {
    loadContent();
  }, []);

  const loadContent = async () => {
    setLoading(true);
    try {
      const [moviesData, tvData, animeData] = await Promise.all([
        tmdbApi.getTrending('movie', 'week'),
        tmdbApi.getTrending('tv', 'week'),
        tmdbApi.getAnime(),
      ]);

      setTrendingMovies(moviesData.results || []);
      setTrendingTVShows(tvData.results || []);
      setAnimeShows(animeData.results || []);
      setCarouselItems([...(moviesData.results?.slice(0, 10) || [])]);
    } catch (error) {
      console.error('Error loading content:', error);
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

  if (isSearching) {
    return (
      <>
        <MediaSection
          title="Search Results"
          items={searchResults}
          mediaType="movie"
          onItemClick={(id) => {
            const item = searchResults.find((r) => r.id === id);
            const type = item && 'title' in item ? 'movie' : 'tv';
            handleMediaClick(id, type);
          }}
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

  return (
    <>
      <Carousel items={carouselItems} onPlayClick={(id, type) => handleMediaClick(id, type)} />

      <MediaSection
        title="Trending Movies"
        items={trendingMovies}
        mediaType="movie"
        onItemClick={handleMediaClick}
      />

      <MediaSection
        title="Trending TV Shows"
        items={trendingTVShows}
        mediaType="tv"
        onItemClick={handleMediaClick}
      />

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
