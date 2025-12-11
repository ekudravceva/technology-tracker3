import { useState, useRef, useEffect } from 'react';

function TechnologySearch({ onSearchResults }) {
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [results, setResults] = useState(null);

    const searchTimeoutRef = useRef(null);
    const abortControllerRef = useRef(null);

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
                onSearchResults([]);
                return;
            }

            // Ищем репозитории на GitHub
            const response = await fetch(
                `https://api.github.com/search/repositories?q=${encodeURIComponent(query)}&sort=stars&order=desc&per_page=5`,
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
            console.log(data)

            // Преобразуем результаты в формат технологий
            const technologies = data.items.map(item => ({
                id: `github-${item.id}`, // Оставляем как было
                title: item.name,
                description: item.description || 'Описание отсутствует',
                status: 'not-started', // ОБЯЗАТЕЛЬНОЕ ПОЛЕ для вашего TechnologyList
                notes: null, // ОБЯЗАТЕЛЬНОЕ ПОЛЕ
                source: 'github',
                githubUrl: item.html_url,
                stars: item.stargazers_count,
                language: item.language || 'Unknown',
                forks: item.forks_count,
                isFromApi: true,
                // Добавляем любые другие поля, которые использует ваш TechnologyList
                category: 'development'
            }));
            setResults(technologies);
            onSearchResults(technologies);

        } catch (err) {
            // Игнорируем ошибки отмены запроса
            if (err.name !== 'AbortError') {
                setError(err.message);
                console.error('Ошибка поиска на GitHub:', err);
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
        searchTimeoutRef.current = setTimeout(() => {
            searchGitHub(value);
        }, 500);
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

    return (
        <div className="github-search-container">
            <h3>🔍 Поиск технологий на GitHub</h3>

            <div className="search-input-container">
                <input
                    type="text"
                    placeholder="Введите название технологии (React, Vue, Node.js...)"
                    value={searchTerm}
                    onChange={handleSearchChange}
                    className="github-search-input"
                />
                {loading && (
                    <div className="search-loading">
                        <span className="spinner-mini"></span>
                        <span>Поиск...</span>
                    </div>
                )}
            </div>
            {results && results.map(tech => (
                <div key={tech.id} style={{ border: '1px solid red', margin: '10px', padding: '10px' }}>
                    <a href={tech.githubUrl} target='_blank'>{tech.title}</a>
                </div>
            ))}

            {error && (
                <div className="search-error">
                    <p>⚠️ {error}</p>
                    <p className="search-hint">
                        Используются демо-данные. Лимит GitHub API: 60 запросов в час.
                    </p>
                </div>
            )}

            {!error && searchTerm && !loading && (
                <p className="search-info">
                    Поиск работает с debounce (500ms). Результаты загружаются с GitHub API.
                </p>
            )}
        </div>
    );
}

export default TechnologySearch;