// src/context/TechContext.jsx
import React, { createContext, useContext, useCallback, useState, useEffect } from 'react';

const TechContext = createContext();

export function TechProvider({ children }) {
    // Загружаем данные из localStorage при инициализации
    const [technologies, setTechnologiesState] = useState(() => {
        const saved = localStorage.getItem('techTrackerData');
        return saved ? JSON.parse(saved) : [
            {
                id: 1,
                title: 'React Components',
                description: 'Изучение базовых компонентов',
                status: 'completed',
                notes: 'Освоил создание функциональных и классовых компонентов'
            },
            // ... остальные начальные данные
        ];
    });

    // Сохраняем в localStorage при каждом изменении
    useEffect(() => {
        localStorage.setItem('techTrackerData', JSON.stringify(technologies));
    }, [technologies]);

    const setTechnologies = useCallback((newTechnologies) => {
        setTechnologiesState(newTechnologies);
    }, []);

    // Функция для добавления технологии
    const addTechnology = useCallback((techFromApi) => {
        const isAlreadyAdded = technologies.some(
            tech => tech.title.toLowerCase() === techFromApi.title.toLowerCase()
        );

        if (isAlreadyAdded) {
            alert(`Технология "${techFromApi.title}" уже есть в вашем списке!`);
            return false;
        }

        const newTechnology = {
            id: Date.now(),
            title: techFromApi.title,
            description: techFromApi.description || `Технология ${techFromApi.title}`,
            status: 'not-started',
            notes: `Добавлено из GitHub. Язык: ${techFromApi.language}, Звезды: ${techFromApi.stars}`,
            githubInfo: {
                url: techFromApi.githubUrl,
                stars: techFromApi.stars,
                language: techFromApi.language,
                forks: techFromApi.forks,
                source: 'github'
            },
            source: 'github',
            isFromApi: true,
            category: 'development',
            addedDate: new Date().toISOString()
        };

        setTechnologiesState(prev => [...prev, newTechnology]);
        return true;
    }, [technologies]);

    // Функция для обновления статуса
    const updateTechnologyStatus = useCallback((id, newStatus) => {
        setTechnologiesState(prevTechnologies =>
            prevTechnologies.map(tech =>
                tech.id === id ? { ...tech, status: newStatus } : tech
            )
        );
    }, []);

    // Функция для обновления заметок
    const updateTechnologyNotes = useCallback((id, newNotes) => {
        setTechnologiesState(prevTech =>
            prevTech.map(tech =>
                tech.id === id ? { ...tech, notes: newNotes } : tech
            )
        );
    }, []);

    // Функция для удаления технологии (без подтверждения)
    const deleteTechnology = useCallback((id) => {
        setTechnologiesState(prevTech => prevTech.filter(tech => tech.id !== id));
    }, []);

    // Функция для удаления с подтверждением (добавим новую)
    const deleteTechnologyWithConfirm = useCallback((id, techTitle = 'эту технологию') => {
        return new Promise((resolve) => {
            if (window.confirm(`Вы уверены, что хотите удалить "${techTitle}"?`)) {
                setTechnologiesState(prevTech => prevTech.filter(tech => tech.id !== id));
                resolve(true);
            } else {
                resolve(false);
            }
        });
    }, []);

    // Значение контекста
    const contextValue = {
        technologies,
        setTechnologies: setTechnologiesState,
        addTechnology,
        updateTechnologyStatus,
        updateTechnologyNotes,
        deleteTechnology, // простое удаление
        deleteTechnologyWithConfirm, // удаление с подтверждением
    };

    return (
        <TechContext.Provider value={contextValue}>
            {children}
        </TechContext.Provider>
    );
}

export const useTech = () => {
    const context = useContext(TechContext);
    if (!context) {
        throw new Error('useTech должен использоваться внутри TechProvider');
    }
    return context;
};