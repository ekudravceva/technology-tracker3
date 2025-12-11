import { useState, useEffect, useCallback } from 'react';

// Резервные мок-данные на случай если GitHub API недоступен
const MOCK_TECHNOLOGIES = [
  {
    id: 1,
    title: 'React',
    description: 'Библиотека для создания пользовательских интерфейсов',
    category: 'frontend',
    difficulty: 'beginner',
    resources: ['https://react.dev', 'https://ru.reactjs.org']
  },
  {
    id: 2,
    title: 'Node.js',
    description: 'Среда выполнения JavaScript на сервере',
    category: 'backend',
    difficulty: 'intermediate',
    resources: ['https://nodejs.org', 'https://nodejs.org/ru/docs/']
  },
  {
    id: 3,
    title: 'TypeScript',
    description: 'Типизированное надмножество JavaScript',
    category: 'language',
    difficulty: 'intermediate',
    resources: ['https://www.typescriptlang.org']
  }
];

function useTechnologiesApi() {
  const [technologies, setTechnologies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Функция для загрузки технологий из GitHub API
  const fetchTechnologies = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // Популярные технологии для поиска на GitHub
      const techQueries = ['react', 'vue', 'nodejs', 'typescript', 'docker', 'kubernetes'];
      
      // Делаем запросы к GitHub API для каждой технологии
      const promises = techQueries.map(query =>
        fetch(`https://api.github.com/search/repositories?q=${query}&sort=stars&order=desc&per_page=1`)
      );

      const responses = await Promise.all(promises);
      
      // Проверяем все ответы
      for (const response of responses) {
        if (!response.ok) {
          // Если GitHub API недоступен или лимит исчерпан, бросаем ошибку
          if (response.status === 403) {
            throw new Error('Лимит GitHub API исчерпан (60 запросов/час). Используются демо-данные.');
          }
          throw new Error(`GitHub API error: ${response.status}`);
        }
      }

      const data = await Promise.all(responses.map(r => r.json()));

      // Преобразуем данные GitHub в наш формат
      const githubTechnologies = data.flatMap((repoData, index) => {
        if (!repoData.items || repoData.items.length === 0) return [];
        
        const item = repoData.items[0];
        return {
          id: item.id,
          title: item.name,
          description: item.description || 'Описание отсутствует',
          category: getCategoryByTech(techQueries[index]),
          difficulty: getDifficultyByStars(item.stargazers_count),
          resources: [item.html_url],
          githubUrl: item.html_url,
          stars: item.stargazers_count,
          language: item.language,
          forks: item.forks_count
        };
      });

      // Объединяем данные с GitHub и мок-данные
      const allTechnologies = [...githubTechnologies, ...MOCK_TECHNOLOGIES];
      
      // Убираем дубликаты по id
      const uniqueTechnologies = Array.from(
        new Map(allTechnologies.map(tech => [tech.id, tech])).values()
      );

      setTechnologies(uniqueTechnologies);

    } catch (err) {
      console.error('Ошибка загрузки с GitHub:', err.message);
      
      // Если GitHub недоступен, используем только мок-данные
      setTechnologies(MOCK_TECHNOLOGIES);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  // Вспомогательные функции для категоризации
  const getCategoryByTech = (tech) => {
    const categories = {
      'react': 'frontend',
      'vue': 'frontend',
      'angular': 'frontend',
      'nodejs': 'backend',
      'typescript': 'language',
      'python': 'language',
      'docker': 'devops',
      'kubernetes': 'devops'
    };
    return categories[tech] || 'other';
  };

  const getDifficultyByStars = (stars) => {
    if (!stars) return 'beginner';
    if (stars > 50000) return 'advanced';
    if (stars > 10000) return 'intermediate';
    return 'beginner';
  };

  // Функция для добавления новой технологии (оставляем как было)
  const addTechnology = async (techData) => {
    try {
      // Имитация API запроса
      await new Promise(resolve => setTimeout(resolve, 500));

      const newTech = {
        id: Date.now(), // В реальном приложении ID генерируется на сервере
        ...techData,
        createdAt: new Date().toISOString()
      };

      setTechnologies(prev => [...prev, newTech]);
      return newTech;

    } catch (err) {
      throw new Error('Не удалось добавить технологию');
    }
  };

  const fetchAdditionalResources = async (techId) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 800));
      
      return {
        documentation: 'https://docs.example.com',
        tutorials: ['https://tutorial1.com', 'https://tutorial2.com'],
        community: 'https://community.example.com',
        lastUpdated: new Date().toISOString()
      };
    } catch (err) {
      throw new Error('Не удалось загрузить дополнительные ресурсы');
    }
  };

  useEffect(() => {
    fetchTechnologies();
  }, [fetchTechnologies]);

  return {
    technologies,
    loading,
    error,
    refetch: fetchTechnologies,
    addTechnology,
    fetchAdditionalResources 
  };
}

export default useTechnologiesApi;