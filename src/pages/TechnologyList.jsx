import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import useLocalStorage from '../hooks/useLocalStorage';
import BulkStatusEditor from '../components/BulkStatusEditor';
import '../App.css';

function TechnologyList() {
    const [technologies, setTechnologies] = useLocalStorage('techTrackerData', []);
    const [searchQuery, setSearchQuery] = useState('');
    const [activeFilter, setActiveFilter] = useState('all');
    const [loadingResources, setLoadingResources] = useState({});
    const [additionalResources, setAdditionalResources] = useState({});

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

    const handleFetchResources = async (techId, techTitle) => {
        setLoadingResources(prev => ({ ...prev, [techId]: true }));

        try {
            await new Promise(resolve => setTimeout(resolve, 800));

            const encodedTitle = encodeURIComponent(techTitle);
            const resources = {
                documentation: `https://docs.example.com/tech/${encodedTitle}`,
                tutorials: [
                    `https://tutorial.example.com/${encodedTitle}/part1`,
                    `https://tutorial.example.com/${encodedTitle}/part2`,
                    `https://tutorial.example.com/${encodedTitle}/part3`
                ],
                community: `https://community.example.com/tech/${encodedTitle}`,
                examples: `https://github.com/search?q=${encodedTitle}+example`,
                stackoverflow: `https://stackoverflow.com/questions/tagged/${encodedTitle}`
            };

            setAdditionalResources(prev => ({
                ...prev,
                [techId]: resources
            }));

        } catch (err) {
            console.error('Ошибка загрузки ресурсов:', err);
            // В случае ошибки показываем сообщение
            alert(`Ошибка загрузки ресурсов для "${techTitle}": ${err.message}`);
        } finally {
            setLoadingResources(prev => ({ ...prev, [techId]: false }));
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'completed': return '✅';
            case 'in-progress': return '⏳';
            case 'not-started': return '⭕';
            default: return '❓';
        }
    };

    const getStatusText = (status) => {
        switch (status) {
            case 'completed': return 'Выполнено';
            case 'in-progress': return 'В процессе';
            case 'not-started': return 'Не начато';
            default: return 'Неизвестно';
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'completed': return '#4CAF50';
            case 'in-progress': return '#FF9800';
            case 'not-started': return '#9E9E9E';
            default: return '#757575';
        }
    };

    const handleBulkStatusUpdate = (updates) => {
        setTechnologies(prev =>
            prev.map(tech => {
                const update = updates.find(u => u.id === tech.id);
                if (update) {
                    return {
                        ...tech,
                        status: update.status,
                        updatedAt: update.updatedAt || new Date().toISOString()
                    };
                }
                return tech;
            })
        );

        alert(`Статусы ${updates.length} технологий успешно обновлены!`);
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

            <div className="bulk-editor-section">
                <BulkStatusEditor
                    technologies={technologies}
                    onBulkUpdate={handleBulkStatusUpdate}
                />
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

                            <div className="additional-resources-section" style={{ margin: '10px 0' }}>
                                <button
                                    onClick={() => handleFetchResources(tech.id, tech.title)}
                                    disabled={loadingResources[tech.id]}
                                    style={{
                                        background: '#2196F3',
                                        color: 'white',
                                        border: 'none',
                                        padding: '6px 12px',
                                        borderRadius: '6px',
                                        fontSize: '12px',
                                        cursor: 'pointer',
                                        marginRight: '10px',
                                        transition: 'background 0.3s'
                                    }}
                                    onMouseOver={(e) => e.target.style.background = '#1976D2'}
                                    onMouseOut={(e) => e.target.style.background = '#2196F3'}
                                >
                                    {loadingResources[tech.id] ? '🔄 Загрузка...' : '📚 Загрузить ресурсы'}
                                </button>

                                {additionalResources[tech.id] && (
                                    <div className="resources-details" style={{
                                        marginTop: '10px',
                                        padding: '12px',
                                        background: '#f8f9fa',
                                        borderRadius: '8px',
                                        borderLeft: '3px solid #2196F3',
                                        fontSize: '13px'
                                    }}>
                                        <h4 style={{ marginTop: '0', marginBottom: '10px', color: '#333' }}>
                                            📚 Дополнительные ресурсы:
                                        </h4>
                                        <ul style={{ listStyle: 'none', padding: '0', margin: '0' }}>
                                            <li style={{ marginBottom: '6px' }}>
                                                <strong>Документация:</strong>{' '}
                                                <a
                                                    href={additionalResources[tech.id].documentation}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    style={{ color: '#2196F3', textDecoration: 'none' }}
                                                    onMouseOver={(e) => e.target.style.textDecoration = 'underline'}
                                                    onMouseOut={(e) => e.target.style.textDecoration = 'none'}
                                                >
                                                    {additionalResources[tech.id].documentation}
                                                </a>
                                            </li>
                                            <li style={{ marginBottom: '6px' }}>
                                                <strong>Туториалы:</strong>
                                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '4px' }}>
                                                    {additionalResources[tech.id].tutorials.map((url, idx) => (
                                                        <a
                                                            key={idx}
                                                            href={url}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            style={{
                                                                background: '#e3f2fd',
                                                                color: '#1976D2',
                                                                padding: '3px 8px',
                                                                borderRadius: '4px',
                                                                textDecoration: 'none',
                                                                fontSize: '11px'
                                                            }}
                                                            onMouseOver={(e) => e.target.style.background = '#bbdefb'}
                                                            onMouseOut={(e) => e.target.style.background = '#e3f2fd'}
                                                        >
                                                            Туториал {idx + 1}
                                                        </a>
                                                    ))}
                                                </div>
                                            </li>
                                            <li style={{ marginBottom: '6px' }}>
                                                <strong>Сообщество:</strong>{' '}
                                                <a
                                                    href={additionalResources[tech.id].community}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    style={{ color: '#2196F3', textDecoration: 'none' }}
                                                    onMouseOver={(e) => e.target.style.textDecoration = 'underline'}
                                                    onMouseOut={(e) => e.target.style.textDecoration = 'none'}
                                                >
                                                    {additionalResources[tech.id].community}
                                                </a>
                                            </li>
                                            <li style={{ marginBottom: '6px' }}>
                                                <strong>Примеры кода:</strong>{' '}
                                                <a
                                                    href={additionalResources[tech.id].examples}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    style={{ color: '#2196F3', textDecoration: 'none' }}
                                                    onMouseOver={(e) => e.target.style.textDecoration = 'underline'}
                                                    onMouseOut={(e) => e.target.style.textDecoration = 'none'}
                                                >
                                                    {additionalResources[tech.id].examples}
                                                </a>
                                            </li>
                                            {additionalResources[tech.id].stackoverflow && (
                                                <li style={{ marginBottom: '0' }}>
                                                    <strong>Stack Overflow:</strong>{' '}
                                                    <a
                                                        href={additionalResources[tech.id].stackoverflow}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        style={{ color: '#2196F3', textDecoration: 'none' }}
                                                        onMouseOver={(e) => e.target.style.textDecoration = 'underline'}
                                                        onMouseOut={(e) => e.target.style.textDecoration = 'none'}
                                                    >
                                                        {additionalResources[tech.id].stackoverflow}
                                                    </a>
                                                </li>
                                            )}
                                        </ul>
                                    </div>
                                )}
                            </div>

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