// import './App.css';
// import TechnologyCard from './components/TechnologyCard.jsx';
// import ProgressHeader from './components/ProgressHeader.jsx';
// import QuickActions from './components/QuickActions';
// import useLocalStorage from './hooks/useLocalStorage';
// import { useState } from 'react';

// function App() {

//   const [technologies, setTechnologies] = useLocalStorage('techTrackerData', [
//     {
//       id: 1, title: 'React Components', description: 'Изучение базовых компонентов',
//       status: 'completed', notes: ''
//     },
//     {
//       id: 2, title: 'JSX Syntax', description: 'Освоение синтаксиса JSX',
//       status: 'in-progress', notes: ''
//     },
//     {
//       id: 3, title: 'State Management', description: 'Работа с состоянием компонентов',
//       status: 'not-started', notes: ''
//     }
//   ]);

//   const [activeFilter, setActiveFilter] = useState('all');

//   const [searchQuery, setSearchQuery] = useState('');

//   const handleStatusChange = (id, newStatus) => {
//     setTechnologies(prevTechnologies =>
//       prevTechnologies.map(tech =>
//         tech.id === id ? { ...tech, status: newStatus } : tech
//       )
//     );
//   };

//   const updateTechnologyNotes = (techId, newNotes) => {
//     setTechnologies(prevTech =>
//       prevTech.map(tech =>
//         tech.id === techId ? { ...tech, notes: newNotes } : tech
//       )
//     );
//   };

//   const getFilteredTechnologies = () => {
//     let filtered = technologies;
   
//     switch(activeFilter) {
//       case 'not-started':
//         filtered = filtered.filter(tech => tech.status === 'not-started');
//         break;
//       case 'in-progress':
//         filtered = filtered.filter(tech => tech.status === 'in-progress');
//         break;
//       case 'completed':
//         filtered = filtered.filter(tech => tech.status === 'completed');
//         break;
//       default:
//         break;
//     }

//     if (searchQuery.trim()) {
//       const query = searchQuery.toLowerCase();
//       filtered = filtered.filter(tech =>
//         tech.title.toLowerCase().includes(query) ||
//         tech.description.toLowerCase().includes(query) ||
//         (tech.notes && tech.notes.toLowerCase().includes(query))
//       );
//     }
    
//     return filtered;
//   };

//   const filteredTechnologies = getFilteredTechnologies();

//   const tabs = [
//     { id: 'all', label: 'Все', count: technologies.length },
//     { id: 'not-started', label: 'Не начаты', count: technologies.filter(t => t.status === 'not-started').length },
//     { id: 'in-progress', label: 'В процессе', count: technologies.filter(t => t.status === 'in-progress').length },
//     { id: 'completed', label: 'Выполнены', count: technologies.filter(t => t.status === 'completed').length },
//   ];

//   return (
//     <div className="App">
//       <header className="App-header">
//         <h1>Трекер изучения технологий</h1>
//       </header>

//       <ProgressHeader technologies={technologies} />

//       <QuickActions 
//         technologies={technologies} 
//         setTechnologies={setTechnologies} 
//       />

//       <main className="App-main">
//         <h2>Дорожная карта изучения</h2>


//         {/* Поле поиска */}
//         <div className="search-section">
//           <div className="search-box">
//             <input
//               type="text"
//               placeholder="Поиск технологий по названию, описанию или заметкам"
//               value={searchQuery}
//               onChange={(e) => setSearchQuery(e.target.value)}
//               className="search-input"
//             />
//             <div className="search-stats">
//               <span className="found-count">Найдено: {filteredTechnologies.length}</span>
//               {searchQuery && (
//                 <button 
//                   className="clear-search-btn"
//                   onClick={() => setSearchQuery('')}
//                   title="Очистить поиск"
//                 >
//                   ✕
//                 </button>
//               )}
//             </div>
//           </div>
//         </div>

//         {/* Вкладки фильтрации */}
//         <div className="filter-tabs">
//           {tabs.map(tab => (
//             <button
//               key={tab.id}
//               className={`filter-tab ${activeFilter === tab.id ? 'active' : ''}`}
//               onClick={() => setActiveFilter(tab.id)}
//             >
//               {tab.label} 
//               <span className="tab-count">({tab.count})</span>
//             </button>
//           ))}
//         </div>

//         {/* Отображение текущего активного фильтра */}
//         <div className="current-filter">
//           <h3>
//             {activeFilter === 'all' && 'Все технологии'}
//             {activeFilter === 'not-started' && 'Технологии не начаты'}
//             {activeFilter === 'in-progress' && 'Технологии в процессе'}
//             {activeFilter === 'completed' && 'Выполненные технологии'}
//             <span className="filter-count">
//               {searchQuery ? ` (${filteredTechnologies.length} из ${technologies.length})` : ` (${filteredTechnologies.length})`}
//             </span>
//           </h3>
//           {searchQuery && (
//             <p className="search-info">
//               Поиск: "<strong>{searchQuery}</strong>"
//             </p>
//           )}
//         </div>

//         <div className="technology-list">
//           {filteredTechnologies.length > 0 ? (
//             filteredTechnologies.map((tech) => (
//               <TechnologyCard
//                 key={tech.id}
//                 id={tech.id}
//                 title={tech.title}
//                 description={tech.description}
//                 status={tech.status}
//                 notes={tech.notes}
//                 onStatusChange={handleStatusChange}
//                 onNotesChange={updateTechnologyNotes}
//               />
//             ))
//           ) : (
//             <div className="no-results-message">
//               <div className="no-results-icon">🔍</div>
//               <h3>Нет технологий с выбранными параметрами</h3>
//               <p className="hint">
//                 {searchQuery 
//                   ? `По запросу "${searchQuery}" ничего не найдено`
//                   : 'Попробуйте изменить фильтр или добавьте новые технологии'}
//               </p>
//               <div className="suggestions">
//                 <button 
//                   className="action-btn"
//                   onClick={() => {
//                     setSearchQuery('');
//                     setActiveFilter('all');
//                   }}
//                 > Показать все технологии
//                 </button>
//               </div>
//             </div>
//           )}
//         </div>
//       </main>
      
//     </div>
//   );
// }

// export default App;

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navigation from './components/Navigation';
import Home from './pages/Home';
import TechnologyList from './pages/TechnologyList';
import TechnologyDetail from './pages/TechnologyDetail';
import AddTechnology from './pages/AddTechnology';
import Statistics from './pages/Statistics';
import Settings from './pages/Settings';
import ProtectedRoute from './components/ProtectedRoute';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Navigation />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/technologies" element={<TechnologyList />} />
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
          {/* Запасной маршрут */}
          <Route path="*" element={
            <div className="page">
              <h1>404 - Страница не найдена</h1>
              <p>Запрошенная страница не существует.</p>
            </div>
          } />
        </Routes>
      </div>
    </Router>
  );
}

export default App;