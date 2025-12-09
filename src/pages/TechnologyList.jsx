import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import useLocalStorage from '../hooks/useLocalStorage';
import '../App.css';

function TechnologyList() {
  const [technologies, setTechnologies] = useLocalStorage('techTrackerData', []);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');

  const getFilteredTechnologies = () => {
    let filtered = technologies;
   
    switch(activeFilter) {
      case 'not-started':
        filtered = filtered.filter(tech => tech.status === 'not-started');
        break;
      case 'in-progress':
        filtered = filtered.filter(tech => tech.status === 'in-progress');
        break;
      case 'completed':
        filtered = filtered.filter(tech => tech.status === 'completed');
        break;
      default:
        break;
    }

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(tech =>
        tech.title.toLowerCase().includes(query) ||
        tech.description.toLowerCase().includes(query) ||
        (tech.notes && tech.notes.toLowerCase().includes(query))
      );
    }
    
    return filtered;
  };

  const filteredTechnologies = getFilteredTechnologies();

  const tabs = [
    { id: 'all', label: 'Все', count: technologies.length },
    { id: 'not-started', label: 'Не начаты', count: technologies.filter(t => t.status === 'not-started').length },
    { id: 'in-progress', label: 'В процессе', count: technologies.filter(t => t.status === 'in-progress').length },
    { id: 'completed', label: 'Выполнены', count: technologies.filter(t => t.status === 'completed').length },
  ];

  const getStatusIcon = (status) => {
    switch(status) {
      case 'completed': return '✅';
      case 'in-progress': return '⏳';
      case 'not-started': return '⭕';
      default: return '❓';
    }
  };

  const getStatusText = (status) => {
    switch(status) {
      case 'completed': return 'Выполнено';
      case 'in-progress': return 'В процессе';
      case 'not-started': return 'Не начато';
      default: return 'Неизвестно';
    }
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'completed': return '#4CAF50';
      case 'in-progress': return '#FF9800';
      case 'not-started': return '#9E9E9E';
      default: return '#757575';
    }
  };

  return (
    <div className="page">
      <div className="page-header">
        <h1>Все технологии</h1>
        <Link to="/add-technology" className="btn btn-primary">
          + Добавить технологию
        </Link>
      </div>

      {/* Поле поиска */}
      <div className="search-section">
        <div className="search-box">
          <input
            type="text"
            placeholder="Поиск технологий по названию, описанию или заметкам"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
          />
          <div className="search-stats">
            <span className="found-count">Найдено: {filteredTechnologies.length}</span>
            {searchQuery && (
              <button 
                className="clear-search-btn"
                onClick={() => setSearchQuery('')}
                title="Очистить поиск"
              >
                ✕
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Вкладки фильтрации */}
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

      <div className="technologies-grid">
        {filteredTechnologies.length > 0 ? (
          filteredTechnologies.map(tech => (
            <div key={tech.id} className="technology-card-list">
              <div className="tech-list-header">
                <h3>{tech.title}</h3>
                <span 
                  className="status-badge" 
                  style={{ 
                    backgroundColor: `${getStatusColor(tech.status)}20`,
                    color: getStatusColor(tech.status),
                    border: `1px solid ${getStatusColor(tech.status)}`
                  }}
                >
                  {getStatusIcon(tech.status)} {getStatusText(tech.status)}
                </span>
              </div>
              <p className="tech-description">{tech.description}</p>
              <div className="tech-list-meta">
                {tech.notes && (
                  <span className="has-notes">📝 Есть заметки</span>
                )}
                <Link to={`/technology/${tech.id}`} className="detail-link">
                  Подробнее →
                </Link>
              </div>
            </div>
          ))
        ) : (
          <div className="empty-state">
            <div className="empty-icon">📚</div>
            <h3>Технологий пока нет</h3>
            <p>Добавьте свою первую технологию для отслеживания</p>
            <Link to="/add-technology" className="btn btn-primary">
              Добавить первую технологию
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

export default TechnologyList;