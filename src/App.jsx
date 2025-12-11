import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useState } from 'react';
import Navigation from './components/Navigation';
import Home from './pages/Home';
import TechnologyList from './pages/TechnologyList';
import TechnologyDetail from './pages/TechnologyDetail';
import AddTechnology from './pages/AddTechnology';
import Statistics from './pages/Statistics';
import Settings from './pages/Settings';
import ProtectedRoute from './components/ProtectedRoute';
import TechnologySearch from './components/TechnologySearch'; // Новый импорт
import './App.css';

function App() {
  const [searchResults, setSearchResults] = useState([]);
  const [showSearchResults, setShowSearchResults] = useState(false);

  return (
    <Router>
      <div className="App">
        <Navigation />
      
        <div className="github-search-global">
          <TechnologySearch 
            onSearchResults={(results) => {
              setSearchResults(results);
              setShowSearchResults(results.length > 0);
            }} 
          />
        </div>

        <Routes>
          <Route path="/" element={<Home />} />
          <Route 
            path="/technologies" 
            element={
              showSearchResults && searchResults.length > 0 ? (
                // Показываем результаты поиска
                <div className="search-results-page">
                  <div className="search-results-controls">
                    <button 
                      onClick={() => setShowSearchResults(false)}
                      className="back-to-all-btn"
                    >
                      ← Вернуться ко всем технологиям
                    </button>
                    <h2>Результаты поиска GitHub: {searchResults.length} технологий</h2>
                  </div>
                  <TechnologyList 
                    technologies={searchResults}
                    isSearchResults={true}
                  />
                </div>
              ) : (
                // Показываем обычный список технологий
                <TechnologyList />
              )
            } 
          />
          
          <Route path="/technology/:techId" element={<TechnologyDetail />} />
          <Route path="/add-technology" element={<AddTechnology />} />
          <Route path="/statistics" element={<Statistics />} />
          <Route 
            path="/settings" 
            element={
              <ProtectedRoute>
                <Settings />
              </ProtectedRoute>
            } 
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;