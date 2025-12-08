import './App.css';
import TechnologyCard from './components/TechnologyCard.jsx';
import ProgressHeader from './components/ProgressHeader.jsx';
import { useState } from 'react';
import QuickActions from './components/QuickActions';

function App() {
  const [technologies, setTechnologies] = useState([
    {
      id: 1, title: 'React Components', description: 'Изучение базовых компонентов',
      status: 'completed'
    },
    {
      id: 2, title: 'JSX Syntax', description: 'Освоение синтаксиса JSX', status: 'in-progress'
    },
    {
      id: 3, title: 'State Management', description: 'Работа с состоянием компонентов', status: 'not-started'
    }
  ]);

  const [activeFilter, setActiveFilter] = useState('all');

  const handleStatusChange = (id, newStatus) => {
    setTechnologies(prevTechnologies =>
      prevTechnologies.map(tech =>
        tech.id === id ? { ...tech, status: newStatus } : tech
      )
    );
  };

  const getFilteredTechnologies = () => {
    switch(activeFilter) {
      case 'not-started':
        return technologies.filter(tech => tech.status === 'not-started');
      case 'in-progress':
        return technologies.filter(tech => tech.status === 'in-progress');
      case 'completed':
        return technologies.filter(tech => tech.status === 'completed');
      default:
        return technologies; 
    }
  };

  const filteredTechnologies = getFilteredTechnologies();

  const tabs = [
    { id: 'all', label: 'Все', count: technologies.length },
    { id: 'not-started', label: 'Не начаты', count: technologies.filter(t => t.status === 'not-started').length },
    { id: 'in-progress', label: 'В процессе', count: technologies.filter(t => t.status === 'in-progress').length },
    { id: 'completed', label: 'Выполнены', count: technologies.filter(t => t.status === 'completed').length },
  ];

  return (
    <div className="App">
      <header className="App-header">
        <h1>Трекер изучения технологий</h1>
      </header>

      <ProgressHeader technologies={technologies} />

      <QuickActions 
        technologies={technologies} 
        setTechnologies={setTechnologies} 
      />

      <main className="App-main">
        <h2>Дорожная карта изучения</h2>

        <div className="filter-tabs">
          {tabs.map(tab => (
            <button
              key={tab.id}
              className={`filter-tab ${activeFilter === tab.id ? 'active' : ''}`}
              onClick={() => setActiveFilter(tab.id)}
            >
              {tab.label} 
              <span className="tab-count">({tab.count})</span>
            </button>
          ))}
        </div>

        <div className="current-filter">
          <h3>
            {activeFilter === 'all' && 'Все технологии'}
            {activeFilter === 'not-started' && 'Технологии не начаты'}
            {activeFilter === 'in-progress' && 'Технологии в процессе'}
            {activeFilter === 'completed' && 'Выполненные технологии'}
            <span className="filter-count"> ({filteredTechnologies.length})</span>
          </h3>
        </div>

        <div className="technology-list">
          {filteredTechnologies.length > 0 ? (
            filteredTechnologies.map((tech) => (
              <TechnologyCard
                key={tech.id}
                id={tech.id}
                title={tech.title}
                description={tech.description}
                status={tech.status}
                onStatusChange={handleStatusChange}
              />
            ))
          ) : (
            <div className="no-results-message">
              <p>Нет технологий с выбранным статусом</p>
              <p className="hint">Попробуйте изменить статус существующих технологий или выбрать другую вкладку</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default App;