import { Routes, Route } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { TechProvider } from './context/TechContext'; // Импорт провайдера
import Navigation from './components/Navigation';
import Home from './pages/Home';
import TechnologyList from './pages/TechnologyList';
import TechnologyDetail from './pages/TechnologyDetail';
import AddTechnology from './pages/AddTechnology';
import Statistics from './pages/Statistics';
import Settings from './pages/Settings';
import ProtectedRoute from './components/ProtectedRoute';
import TechnologySearch from './components/TechnologySearch';
import './App.css';

function App() {
  const [searchResults, setSearchResults] = useState([]);
  const [showSearchResults, setShowSearchResults] = useState(false);

  const [settings, setSettings] = useState(() => {
    // Для settings используем обычный useState, так как это только для App
    const saved = localStorage.getItem('appSettings');
    return saved ? JSON.parse(saved) : {
      theme: 'light',
      language: 'ru',
      notifications: true,
      autoSave: true
    };
  });

  // Сохраняем настройки в localStorage
  useEffect(() => {
    localStorage.setItem('appSettings', JSON.stringify(settings));
  }, [settings]);

  const muiTheme = createTheme({
    palette: {
      mode: settings.theme === 'dark' ? 'dark' : 'light',
      primary: {
        main: '#1976d2',
      },
      secondary: {
        main: '#dc004e',
      },
    },
  });

  useEffect(() => {
    const root = document.documentElement;
    const body = document.body;
    
    if (settings.theme === 'dark') {
      root.classList.add('dark-theme');
      root.classList.remove('light-theme');
      body.style.backgroundColor = '#121212';
      body.style.color = '#ffffff';
    } else {
      root.classList.add('light-theme');
      root.classList.remove('dark-theme');
      body.style.backgroundColor = '#ffffff';
      body.style.color = 'rgba(0, 0, 0, 0.87)';
    }
  }, [settings.theme]);

  return (
    <TechProvider> {/* Оборачиваем все в TechProvider */}
      <ThemeProvider theme={muiTheme}>
        <CssBaseline />
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
      </ThemeProvider>
    </TechProvider>
  );
}

export default App;