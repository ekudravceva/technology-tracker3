import { useState, useRef, useEffect } from 'react';
import { useTech } from '../context/TechContext';
import './TechnologySearch.css';

function TechnologySearch({ onSearchResults }) {
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [results, setResults] = useState([]);
    const [addingTechId, setAddingTechId] = useState(null);

    // Правильное использование useTech
    const techContext = useTech();
    const { technologies, addTechnology } = techContext;

    const searchTimeoutRef = useRef(null);
    const abortControllerRef = useRef(null);

    // Функция для добавления технологии
    const handleAddTechnology = async (techFromApi) => {
        setAddingTechId(techFromApi.id);
        
        // Используем функцию из контекста
        const success = addTechnology(techFromApi);
        
        if (success) {
            setTimeout(() => {
                setAddingTechId(null);
            }, 1500);
        } else {
            setAddingTechId(null);
        }
    };

    // Функция поиска на GitHub API с debounce
    const searchGitHub = async (query) => {
        // Отменяем предыдущий запрос
        if (abortControllerRef.current) {
            abortControllerRef.current.abort();
        }

        abortControllerRef.current = new AbortController();

        try {
            setLoading(true);
            setError(null);

            if (!query.trim()) {
                setResults([]);
                onSearchResults([]);
                return;
            }

            // Ищем репозитории на GitHub
            const response = await fetch(
                `https://api.github.com/search/repositories?q=${encodeURIComponent(query)}+language:javascript+language:typescript+language:python+language:java&sort=stars&order=desc&per_page=10`,
                {
                    signal: abortControllerRef.current.signal,
                    headers: {
                        'Accept': 'application/vnd.github.v3+json'
                    }
                }
            );

            if (!response.ok) {
                if (response.status === 403) {
                    throw new Error('Лимит GitHub API исчерпан (60 запросов/час)');
                }
                throw new Error(`Ошибка GitHub API: ${response.status}`);
            }

            const data = await response.json();

            // Преобразуем результаты в формат технологий
            const technologiesFromApi = data.items.map(item => ({
                id: `github-${item.id}`,
                title: item.name,
                description: item.description || 'Описание отсутствует',
                status: 'not-started',
                notes: null,
                source: 'github',
                githubUrl: item.html_url,
                stars: item.stargazers_count,
                language: item.language || 'Unknown',
                forks: item.forks_count,
                isFromApi: true,
                category: 'development'
            }));

            setResults(technologiesFromApi);
            onSearchResults(technologiesFromApi);

        } catch (err) {
            // Игнорируем ошибки отмены запроса
            if (err.name !== 'AbortError') {
                setError(err.message);
                console.error('Ошибка поиска на GitHub:', err);
                setResults([]);
                onSearchResults([]);
            }
        } finally {
            setLoading(false);
        }
    };

    // Debounce для поиска (500ms)
    const handleSearchChange = (e) => {
        const value = e.target.value;
        setSearchTerm(value);

        // Очищаем предыдущий таймер
        if (searchTimeoutRef.current) {
            clearTimeout(searchTimeoutRef.current);
        }

        // Устанавливаем новый таймер для debounce
        if (value.trim().length >= 2) { // Ищем только если 2+ символа
            searchTimeoutRef.current = setTimeout(() => {
                searchGitHub(value);
            }, 500);
        } else {
            setResults([]);
            onSearchResults([]);
        }
    };

    // Очистка при размонтировании
    useEffect(() => {
        return () => {
            if (searchTimeoutRef.current) {
                clearTimeout(searchTimeoutRef.current);
            }
            if (abortControllerRef.current) {
                abortControllerRef.current.abort();
            }
        };
    }, []);

    // Функция очистки поиска
    const handleClearSearch = () => {
        setSearchTerm('');
        setResults([]);
        onSearchResults([]);
        if (searchTimeoutRef.current) {
            clearTimeout(searchTimeoutRef.current);
        }
    };

    return (
        <div className="github-search-container">
            <h3>🔍 Поиск технологий на GitHub</h3>

            <div className="search-header">
                <div className="search-input-container">
                    <input
                        type="text"
                        placeholder="Введите название технологии (React, Vue, Node.js...)"
                        value={searchTerm}
                        onChange={handleSearchChange}
                        className="github-search-input"
                    />
                    {searchTerm && (
                        <button
                            onClick={handleClearSearch}
                            className="clear-search-btn"
                            title="Очистить поиск"
                        >
                            ✕
                        </button>
                    )}
                </div>

                {loading && (
                    <div className="search-loading">
                        <span className="spinner-mini"></span>
                        <span>Поиск на GitHub...</span>
                    </div>
                )}
            </div>

            {error && (
                <div className="search-error">
                    <p>⚠️ {error}</p>
                    <p className="search-hint">
                        Используются демо-данные. Лимит GitHub API: 60 запросов в час.
                    </p>
                </div>
            )}

            {/* Список найденных технологий */}
            {results.length > 0 && (
                <div className="search-results">
                    <h4>Найдено технологий: {results.length}</h4>
                    <div className="results-grid">
                        {results.map(tech => {
                            const isAlreadyInList = technologies.some(
                                t => t.title.toLowerCase() === tech.title.toLowerCase()
                            );

                            return (
                                <div key={tech.id} className="github-tech-card">
                                    <div className="tech-card-header">
                                        <a
                                            href={tech.githubUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="tech-title-link"
                                        >
                                            <h4>{tech.title}</h4>
                                        </a>
                                        <span className="tech-language">{tech.language}</span>
                                    </div>

                                    <p className="tech-description">
                                        {tech.description}
                                    </p>

                                    <div className="tech-stats">
                                        <span className="stat-item" title="Звезды">
                                            ⭐ {tech.stars.toLocaleString()}
                                        </span>
                                        <span className="stat-item" title="Форки">
                                            🍴 {tech.forks.toLocaleString()}
                                        </span>
                                    </div>

                                    <button
                                        onClick={() => handleAddTechnology(tech)}
                                        disabled={isAlreadyInList || addingTechId === tech.id}
                                        className={`add-tech-btn ${isAlreadyInList ? 'already-added' : ''}`}
                                    >
                                        {addingTechId === tech.id ? (
                                            <>
                                                <span className="spinner-mini"></span>
                                                Добавлено! ✓
                                            </>
                                        ) : isAlreadyInList ? (
                                            '✓ Уже в списке'
                                        ) : (
                                            '➕ Добавить в трекер'
                                        )}
                                    </button>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}

            {!error && searchTerm && !loading && results.length === 0 && searchTerm.length >= 2 && (
                <div className="no-results">
                    <p>По запросу "<strong>{searchTerm}</strong>" ничего не найдено</p>
                    <p className="search-hint">Попробуйте изменить запрос или проверьте лимиты GitHub API</p>
                </div>
            )}

            {searchTerm && searchTerm.length < 2 && (
                <p className="search-info">Введите минимум 2 символа для поиска</p>
            )}
        </div>
    );
}

export default TechnologySearch;