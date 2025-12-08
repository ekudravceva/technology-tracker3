// src/components/QuickActions.jsx
import './QuickActions.css';

function QuickActions({ technologies, setTechnologies }) {
  // 1. Отметить все как выполненные
  const markAllAsCompleted = () => {
    setTechnologies(prev => 
      prev.map(tech => ({
        ...tech,
        status: 'completed'
      }))
    );
  };

  // 2. Сбросить все статусы
  const resetAllStatuses = () => {
    setTechnologies(prev => 
      prev.map(tech => ({
        ...tech,
        status: 'not-started'
      }))
    );
  };

  // 3. Случайный выбор следующей технологии
  const selectRandomTechnology = () => {
    // Фильтруем невыполненные технологии
    const notCompleted = technologies.filter(
      tech => tech.status !== 'completed'
    );
    
    if (notCompleted.length === 0) {
      alert('🎉 Все технологии уже изучены!');
      return;
    }

    // Выбираем случайную технологию
    const randomIndex = Math.floor(Math.random() * notCompleted.length);
    const randomTech = notCompleted[randomIndex];
    
    // Устанавливаем её статус "in-progress"
    setTechnologies(prev => 
      prev.map(tech => 
        tech.id === randomTech.id 
          ? { ...tech, status: 'in-progress' } 
          : tech
      )
    );
    
    // Показываем сообщение
    alert(`Следующая технология для изучения: "${randomTech.title}"`);
  };

  // Подсчет статистики для информации
  const completedCount = technologies.filter(t => t.status === 'completed').length;
  const totalCount = technologies.length;

  return (
    <div className="quick-actions">
      <h3>Быстрые действия</h3>
      <p className="quick-actions-info">
        Завершено: <strong>{completedCount}/{totalCount}</strong> технологий
      </p>
      
      <div className="actions-buttons">
        <button 
          onClick={markAllAsCompleted}
          className="action-btn complete-all"
          title="Установить статус 'Выполнено' для всех технологий"
        >
          Отметить все как выполненные
        </button>
        
        <button 
          onClick={resetAllStatuses}
          className="action-btn reset-all"
          title="Сбросить статусы всех технологий на 'Не начато'"
        >
          Сбросить все статусы
        </button>
        
        <button 
          onClick={selectRandomTechnology}
          className="action-btn random-tech"
          title="Выбрать случайную технологию для изучения"
          disabled={completedCount === totalCount}
        >
          Случайный выбор следующей технологии
        </button>
      </div>
      
    </div>
  );
}

export default QuickActions;