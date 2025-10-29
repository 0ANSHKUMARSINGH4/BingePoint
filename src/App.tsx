import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import HomePage from './pages/HomePage';
import MoviesPage from './pages/MoviesPage';
import TVShowsPage from './pages/TVShowsPage';
import AnimePage from './pages/AnimePage';
import { Movie, TVShow } from './types/tmdb';
import { tmdbApi } from './services/tmdb';

export default function App() {
  const [searchResults, setSearchResults] = useState<(Movie | TVShow)[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = async (query: string) => {
    setIsSearching(true);
    try {
      const data = await tmdbApi.search(query);
      setSearchResults(data.results?.filter((item: any) => item.media_type === 'movie' || item.media_type === 'tv') || []);
    } catch (error) {
      console.error('Error searching:', error);
    }
  };

  return (
    <Router>
      <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
        <Header onSearch={handleSearch} />

        <main className="container mx-auto px-4 py-8">
          <Routes>
            <Route path="/" element={<HomePage searchResults={searchResults} isSearching={isSearching} />} />
            <Route path="/movies" element={<MoviesPage />} />
            <Route path="/tv-shows" element={<TVShowsPage />} />
            <Route path="/anime" element={<AnimePage />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}
