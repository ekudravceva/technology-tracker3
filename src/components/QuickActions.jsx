import './QuickActions.css';
import Modal from './Modal.jsx';
import { useState } from 'react';
import { useTech } from '../context/TechContext'; // Добавляем импорт контекста

function QuickActions() {
  const [showExportModal, setShowExportModal] = useState(false);
  const { technologies, setTechnologies } = useTech(); // Используем контекст

  const handleExport = () => {
    const data = {
      exportedAt: new Date().toISOString(),
      technologies: technologies
    };
    console.log('Данные для экспорта:', JSON.stringify(data, null, 2));
    setShowExportModal(true);
  };

  const handleResetAll = () => {
    if (window.confirm('Вы уверены, что хотите сбросить все технологии?')) {
      const defaultTech = [
        {
          id: 1,
          title: 'React Components',
          description: 'Изучение базовых компонентов',
          status: 'completed',
          notes: 'Освоил создание функциональных и классовых компонентов'
        },
        {
          id: 2,
          title: 'JSX Syntax',
          description: 'Освоение синтаксиса JSX',
          status: 'in-progress',
          notes: 'Работаю с условным рендерингом и списками'
        },
        {
          id: 3,
          title: 'State Management',
          description: 'Работа с состоянием компонентов',
          status: 'not-started',
          notes: 'Планирую изучить useState и useEffect'
        },
        {
          id: 4,
          title: 'React Router',
          description: 'Навигация в React-приложениях',
          status: 'in-progress',
          notes: 'Изучаю маршрутизацию и динамические пути'
        }
      ];
      setTechnologies(defaultTech);
    }
  };

  const handleClearAll = () => {
    if (window.confirm('Вы уверены, что хотите удалить все технологии?')) {
      setTechnologies([]);
    }
  };

  const markAllAsCompleted = () => {
    if (window.confirm('Вы уверены, что хотите отметить ВСЕ технологии как выполненные?')) {
      setTechnologies(prev => 
        prev.map(tech => ({
          ...tech,
          status: 'completed'
        }))
      );
    }
  };

  const resetAllStatuses = () => {
    if (window.confirm('Вы уверены, что хотите сбросить статусы ВСЕХ технологий на "Не начато"?')) {
      setTechnologies(prev => 
        prev.map(tech => ({
          ...tech,
          status: 'not-started'
        }))
      );
    }
  };

  const selectRandomTechnology = () => {
    const notCompleted = technologies.filter(
      tech => tech.status !== 'completed'
    );
    
    if (notCompleted.length === 0) {
      alert('Все технологии уже изучены!');
      return;
    }

    const randomIndex = Math.floor(Math.random() * notCompleted.length);
    const randomTech = notCompleted[randomIndex];

    setTechnologies(prev => 
      prev.map(tech => 
        tech.id === randomTech.id 
          ? { ...tech, status: 'in-progress' } 
          : tech
      )
    );
   
    alert(`Следующая технология для изучения: "${randomTech.title}"`);
  };

  const completedCount = technologies.filter(t => t.status === 'completed').length;
  const totalCount = technologies.length;
  const progressPercentage = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  return (
    <div className="quick-actions">
      <h3>Быстрые действия</h3>
      <div className="progress-summary">
        <p className="quick-actions-info">
          Прогресс: <strong>{completedCount}/{totalCount}</strong> технологий
        </p>
        <div className="progress-bar-mini">
          <div 
            className="progress-fill-mini" 
            style={{ width: `${progressPercentage}%` }}
          ></div>
        </div>
        <span className="progress-percentage">{progressPercentage}%</span>
      </div>
      
      <div className="actions-buttons">
        <button 
          onClick={markAllAsCompleted}
          className="action-btn complete-all"
          title="Установить статус 'Выполнено' для всех технологий"
          disabled={technologies.length === 0}
        >
          ✅ Отметить все как выполненные
        </button>
        
        <button 
          onClick={resetAllStatuses}
          className="action-btn reset-all"
          title="Сбросить статусы всех технологий на 'Не начато'"
          disabled={technologies.length === 0}
        >
          🔄 Сбросить все статусы
        </button>
        
        <button 
          onClick={selectRandomTechnology}
          className="action-btn random-tech"
          title="Выбрать случайную технологию для изучения"
          disabled={completedCount === totalCount || technologies.length === 0}
        >
          🎲 Случайный выбор следующей технологии
        </button>

                <button 
          className="action-btn secondary"
          onClick={handleResetAll}
        >
          🔄 Сбросить к начальным
        </button>
        
        <button 
          className="action-btn danger"
          onClick={handleClearAll}
        >
          🗑️ Удалить все
        </button>
      </div>

      <div className="export-section">
        <button onClick={handleExport} className="action-btn export-btn" disabled={technologies.length === 0}>
          📤 Экспорт данных ({technologies.length})
        </button>
        <p className="export-hint">
          Экспортирует все технологии в консоль разработчика
        </p>
      </div>

      <Modal
        isOpen={showExportModal}
        onClose={() => setShowExportModal(false)}
        title="Экспорт данных"
      >
        <div className="export-modal-content">
          <p>✅ Данные подготовлены для экспорта!</p>
          <p>Проверьте консоль разработчика (F12) для просмотра данных.</p>
          <div className="export-stats">
            <p><strong>Экспортировано:</strong> {technologies.length} технологий</p>
            <p><strong>Выполнено:</strong> {completedCount} ({progressPercentage}%)</p>
            <p><strong>Дата:</strong> {new Date().toLocaleString()}</p>
          </div>
          <div className="modal-actions">
            <button 
              onClick={() => {
                // Функция для скачивания файла (опционально)
                const dataStr = JSON.stringify(technologies, null, 2);
                const dataBlob = new Blob([dataStr], { type: 'application/json' });
                const url = URL.createObjectURL(dataBlob);
                const link = document.createElement('a');
                link.href = url;
                link.download = `tech-tracker-export-${new Date().toISOString().split('T')[0]}.json`;
                link.click();
                URL.revokeObjectURL(url);
              }}
              className="btn btn-primary"
            >
              📥 Скачать JSON файл
            </button>
            <button 
              onClick={() => setShowExportModal(false)} 
              className="btn btn-secondary"
            >
              Закрыть
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

export default QuickActions;