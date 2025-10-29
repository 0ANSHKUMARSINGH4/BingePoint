const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const BASE_URL = 'https://api.themoviedb.org/3';

export const tmdbApi = {
  getTrending: async (mediaType: 'movie' | 'tv', timeWindow: 'day' | 'week' = 'week') => {
    const response = await fetch(
      `${BASE_URL}/trending/${mediaType}/${timeWindow}?api_key=${API_KEY}`
    );
    return response.json();
  },

  getPopular: async (mediaType: 'movie' | 'tv') => {
    const response = await fetch(
      `${BASE_URL}/${mediaType}/popular?api_key=${API_KEY}&sort_by=popularity.desc`
    );
    return response.json();
  },

  getDetails: async (mediaType: 'movie' | 'tv', id: number) => {
    const response = await fetch(
      `${BASE_URL}/${mediaType}/${id}?api_key=${API_KEY}&append_to_response=videos,seasons`
    );
    return response.json();
  },

  getTVSeasons: async (tvId: number) => {
    const response = await fetch(
      `${BASE_URL}/tv/${tvId}?api_key=${API_KEY}`
    );
    return response.json();
  },

  getSeasonDetails: async (tvId: number, seasonNumber: number) => {
    const response = await fetch(
      `${BASE_URL}/tv/${tvId}/season/${seasonNumber}?api_key=${API_KEY}`
    );
    return response.json();
  },

  discoverMovies: async (page: number = 1) => {
    const response = await fetch(
      `${BASE_URL}/discover/movie?api_key=${API_KEY}&sort_by=popularity.desc&page=${page}`
    );
    return response.json();
  },

  discoverTVShows: async (page: number = 1) => {
    const response = await fetch(
      `${BASE_URL}/discover/tv?api_key=${API_KEY}&sort_by=popularity.desc&page=${page}`
    );
    return response.json();
  },

  search: async (query: string) => {
    const response = await fetch(
      `${BASE_URL}/search/multi?api_key=${API_KEY}&query=${encodeURIComponent(query)}`
    );
    return response.json();
  },

  getAnime: async () => {
    const response = await fetch(
      `${BASE_URL}/discover/tv?api_key=${API_KEY}&with_genres=16&with_keywords=210024|287501&sort_by=popularity.desc&with_original_language=ja`
    );
    return response.json();
  },

  getImageUrl: (path: string, size: 'w500' | 'original' = 'w500') => {
    if (!path) return 'https://via.placeholder.com/500x750?text=No+Image';
    return `https://image.tmdb.org/t/p/${size}${path}`;
  },

  getYoutubeTrailer: (videos: any) => {
    const trailer = videos?.results?.find(
      (video: any) => video.type === 'Trailer' && video.site === 'YouTube'
    );
    return trailer ? `https://www.youtube.com/embed/${trailer.key}` : null;
  },
};
