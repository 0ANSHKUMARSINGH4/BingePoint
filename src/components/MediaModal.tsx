import { useEffect, useState } from 'react';
import { X, Play, Star, Calendar, Clock } from 'lucide-react';
import { MediaDetail, MediaType } from '../types/tmdb';
import { tmdbApi } from '../services/tmdb';

interface MediaModalProps {
  isOpen: boolean;
  onClose: () => void;
  mediaId: number;
  mediaType: MediaType;
}

interface Season {
  id: number;
  name: string;
  season_number: number;
  episode_count: number;
}

interface Episode {
  id: number;
  name: string;
  episode_number: number;
  season_number: number;
}

export default function MediaModal({ isOpen, onClose, mediaId, mediaType }: MediaModalProps) {
  const [media, setMedia] = useState<MediaDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [showPlayer, setShowPlayer] = useState(false);
  const [showTrailer, setShowTrailer] = useState(false);
  const [selectedSeason, setSelectedSeason] = useState(1);
  const [selectedEpisode, setSelectedEpisode] = useState(1);
  const [episodes, setEpisodes] = useState<Episode[]>([]);
  const [loadingEpisodes, setLoadingEpisodes] = useState(false);

  useEffect(() => {
    if (isOpen && mediaId) {
      setLoading(true);
      setShowPlayer(false);
      setShowTrailer(false);
      setSelectedSeason(1);
      setSelectedEpisode(1);
      const type = mediaType === 'anime' ? 'tv' : mediaType;
      tmdbApi.getDetails(type, mediaId).then((data) => {
        setMedia(data);
        setLoading(false);
        if (type === 'tv' && data.number_of_seasons) {
          loadEpisodes(1);
        }
      });
    }
  }, [isOpen, mediaId, mediaType]);

  const loadEpisodes = async (seasonNumber: number) => {
    setLoadingEpisodes(true);
    try {
      const seasonData = await tmdbApi.getSeasonDetails(mediaId, seasonNumber);
      setEpisodes(seasonData.episodes || []);
    } catch (error) {
      console.error('Error loading episodes:', error);
    } finally {
      setLoadingEpisodes(false);
    }
  };

  useEffect(() => {
    if (showPlayer && mediaType !== 'movie' && media?.number_of_seasons) {
      loadEpisodes(selectedSeason);
    }
  }, [selectedSeason]);

  if (!isOpen) return null;

  const handlePlayMovie = () => {
    setShowPlayer(true);
    setShowTrailer(false);
  };

  const handlePlayTrailer = () => {
    setShowTrailer(true);
    setShowPlayer(false);
  };

  const handleSeasonChange = (season: number) => {
    setSelectedSeason(season);
    setSelectedEpisode(1);
  };

  const handleEpisodeChange = (episode: number) => {
    setSelectedEpisode(episode);
  };

  const title = media?.title || media?.name || '';
  const year = media?.release_date
    ? new Date(media.release_date).getFullYear()
    : media?.first_air_date
    ? new Date(media.first_air_date).getFullYear()
    : '';

  const trailerUrl = media ? tmdbApi.getYoutubeTrailer(media.videos) : null;

  const getPlayerUrl = () => {
    if (mediaType === 'movie') {
      return `https://vidsrc.icu/embed/movie/${mediaId}`;
    } else {
      return `https://vidsrc.icu/embed/tv/${mediaId}/${selectedSeason}/${selectedEpisode}`;
    }
  };

  const seasons: Season[] = media?.seasons?.filter((s: Season) => s.season_number > 0) || [];
  const isTVShow = mediaType === 'tv' || mediaType === 'anime';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4">
      <div className="relative w-full max-w-6xl max-h-[90vh] overflow-y-auto rounded-2xl bg-slate-900 shadow-2xl">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 z-10 rounded-full bg-black/50 p-2 text-white backdrop-blur-sm transition-colors hover:bg-black/70"
        >
          <X className="h-6 w-6" />
        </button>

        {loading ? (
          <div className="flex h-96 items-center justify-center">
            <div className="h-12 w-12 animate-spin rounded-full border-4 border-cyan-500 border-t-transparent"></div>
          </div>
        ) : (
          <>
            {showPlayer || showTrailer ? (
              <div className="aspect-video w-full">
                <iframe
                  key={`${selectedSeason}-${selectedEpisode}`}
                  src={showPlayer ? getPlayerUrl() : trailerUrl || ''}
                  className="h-full w-full"
                  allowFullScreen
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                ></iframe>
              </div>
            ) : (
              <div className="relative aspect-video w-full overflow-hidden">
                <img
                  src={tmdbApi.getImageUrl(media?.backdrop_path || '', 'original')}
                  alt={title}
                  className="h-full w-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/50 to-transparent"></div>
              </div>
            )}

            <div className="p-8">
              {!showPlayer && !showTrailer && (
                <>
                  <h2 className="text-4xl font-bold text-white">{title}</h2>

                  <div className="mt-4 flex flex-wrap items-center gap-4 text-gray-300">
                    {year && (
                      <div className="flex items-center gap-2">
                        <Calendar className="h-5 w-5" />
                        <span>{year}</span>
                      </div>
                    )}
                    {media?.runtime && (
                      <div className="flex items-center gap-2">
                        <Clock className="h-5 w-5" />
                        <span>{media.runtime} min</span>
                      </div>
                    )}
                    {media?.number_of_seasons && (
                      <div className="flex items-center gap-2">
                        <span>{media.number_of_seasons} Season{media.number_of_seasons > 1 ? 's' : ''}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-2">
                      <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                      <span className="font-semibold">{media?.vote_average.toFixed(1)}</span>
                    </div>
                  </div>

                  <div className="mt-4 flex gap-3">
                    {media?.genres.map((genre) => (
                      <span
                        key={genre.id}
                        className="rounded-full bg-cyan-500/20 px-4 py-1 text-sm text-cyan-400"
                      >
                        {genre.name}
                      </span>
                    ))}
                  </div>

                  <p className="mt-6 text-lg leading-relaxed text-gray-300">{media?.overview}</p>

                  <div className="mt-8 flex gap-4">
                    <button
                      onClick={handlePlayMovie}
                      className="flex items-center gap-2 rounded-lg bg-cyan-500 px-8 py-3 font-semibold text-white transition-all hover:bg-cyan-600 hover:shadow-lg hover:shadow-cyan-500/50"
                    >
                      <Play className="h-5 w-5 fill-current" />
                      Watch Now
                    </button>
                    {trailerUrl && (
                      <button
                        onClick={handlePlayTrailer}
                        className="flex items-center gap-2 rounded-lg border-2 border-gray-600 px-8 py-3 font-semibold text-white transition-all hover:border-gray-400 hover:bg-gray-800"
                      >
                        <Play className="h-5 w-5" />
                        Watch Trailer
                      </button>
                    )}
                  </div>
                </>
              )}

              {showPlayer && isTVShow && seasons.length > 0 && (
                <div className="mt-6 space-y-4">
                  <div className="flex gap-4">
                    <div className="flex-1">
                      <label className="mb-2 block text-sm font-medium text-gray-300">Season</label>
                      <select
                        value={selectedSeason}
                        onChange={(e) => handleSeasonChange(Number(e.target.value))}
                        className="w-full rounded-lg border border-slate-700 bg-slate-800 px-4 py-2 text-white transition-colors focus:border-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
                      >
                        {seasons.map((season) => (
                          <option key={season.id} value={season.season_number}>
                            {season.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="flex-1">
                      <label className="mb-2 block text-sm font-medium text-gray-300">Episode</label>
                      {loadingEpisodes ? (
                        <div className="flex h-10 items-center justify-center rounded-lg border border-slate-700 bg-slate-800">
                          <div className="h-5 w-5 animate-spin rounded-full border-2 border-cyan-500 border-t-transparent"></div>
                        </div>
                      ) : (
                        <select
                          value={selectedEpisode}
                          onChange={(e) => handleEpisodeChange(Number(e.target.value))}
                          className="w-full rounded-lg border border-slate-700 bg-slate-800 px-4 py-2 text-white transition-colors focus:border-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
                        >
                          {episodes.map((episode) => (
                            <option key={episode.id} value={episode.episode_number}>
                              Episode {episode.episode_number}: {episode.name}
                            </option>
                          ))}
                        </select>
                      )}
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      setShowPlayer(false);
                      setShowTrailer(false);
                    }}
                    className="rounded-lg bg-gray-700 px-6 py-2 text-white transition-colors hover:bg-gray-600"
                  >
                    Back to Details
                  </button>
                </div>
              )}

              {(showPlayer && !isTVShow) && (
                <div className="mt-6">
                  <button
                    onClick={() => {
                      setShowPlayer(false);
                      setShowTrailer(false);
                    }}
                    className="rounded-lg bg-gray-700 px-6 py-2 text-white transition-colors hover:bg-gray-600"
                  >
                    Back to Details
                  </button>
                </div>
              )}

              {showTrailer && (
                <div className="mt-6">
                  <button
                    onClick={() => {
                      setShowPlayer(false);
                      setShowTrailer(false);
                    }}
                    className="rounded-lg bg-gray-700 px-6 py-2 text-white transition-colors hover:bg-gray-600"
                  >
                    Back to Details
                  </button>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
