import TechnologyCard from '../components/TechnologyCard.jsx';
import ProgressHeader from '../components/ProgressHeader.jsx';
import QuickActions from '../components/QuickActions';
import AddTechnology from '../components/AddTechnology';
import { useTech } from '../context/TechContext'; // Импорт хука
import { useState } from 'react';
import '../App.css';

function Home() {
    const { technologies, updateTechnologyStatus, updateTechnologyNotes } = useTech();

    const [activeFilter, setActiveFilter] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');

    const handleStatusChange = (id, newStatus) => {
        updateTechnologyStatus(id, newStatus);
    };

    const handleNotesChange = (techId, newNotes) => {
        updateTechnologyNotes(techId, newNotes);
    };

    const getFilteredTechnologies = () => {
        let filtered = technologies;

        switch (activeFilter) {
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

    return (
        <div className="home-page">
            <header className="App-header">
                <h1>Трекер изучения технологий</h1>
                <p>Отслеживайте прогресс изучения технологий и управляйте своими задачами</p>
            </header>

            <ProgressHeader technologies={technologies} />

            <QuickActions
            />

            <AddTechnology
                technologies={technologies}
            />

            <main className="App-main">
                <h2>Дорожная карта изучения</h2>

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

                {/* Отображение текущего активного фильтра */}
                <div className="current-filter">
                    <h3>
                        {activeFilter === 'all' && 'Все технологии'}
                        {activeFilter === 'not-started' && 'Технологии не начаты'}
                        {activeFilter === 'in-progress' && 'Технологии в процессе'}
                        {activeFilter === 'completed' && 'Выполненные технологии'}
                        <span className="filter-count">
                            {searchQuery ? ` (${filteredTechnologies.length} из ${technologies.length})` : ` (${filteredTechnologies.length})`}
                        </span>
                    </h3>
                    {searchQuery && (
                        <p className="search-info">
                            Поиск: "<strong>{searchQuery}</strong>"
                        </p>
                    )}
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
                                notes={tech.notes}
                                onStatusChange={handleStatusChange}
                                onNotesChange={handleNotesChange}
                            />
                        ))
                    ) : (
                        <div className="no-results-message">
                            <div className="no-results-icon">🔍</div>
                            <h3>Нет технологий с выбранными параметрами</h3>
                            <p className="hint">
                                {searchQuery
                                    ? `По запросу "${searchQuery}" ничего не найдено`
                                    : 'Попробуйте изменить фильтр или добавьте новые технологии'}
                            </p>
                            <div className="suggestions">
                                <button
                                    className="action-btn"
                                    onClick={() => {
                                        setSearchQuery('');
                                        setActiveFilter('all');
                                    }}
                                >
                                    Показать все технологии
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}

export default Home;