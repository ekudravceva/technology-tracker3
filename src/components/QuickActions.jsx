import './QuickActions.css';
import Modal from './Modal.jsx';
import { useState } from 'react';


function QuickActions({ technologies, setTechnologies }) {
  const [showExportModal, setShowExportModal] = useState(false);

  const handleExport = () => {
    const data = {
      exportedAt: new Date().toISOString(),
      technologies: technologies
    };
    console.log('Данные для экспорта:', JSON.stringify(data, null, 2));
    setShowExportModal(true);
  };

  const markAllAsCompleted = () => {
    setTechnologies(prev => 
      prev.map(tech => ({
        ...tech,
        status: 'completed'
      }))
    );
  };

  const resetAllStatuses = () => {
    setTechnologies(prev => 
      prev.map(tech => ({
        ...tech,
        status: 'not-started'
      }))
    );
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

      <button onClick={handleExport} className="action-btn">Экспорт данных
      </button>

      <Modal
        isOpen={showExportModal}
        onClose={() => setShowExportModal(false)}
        title="Экспорт данных"
      >
        <p>Данные подготовлены для экспорта!</p>
        <p>Проверьте консоль разработчика для просмотра данных.</p>
        <button onClick={() => setShowExportModal(false)}>Закрыть</button>
      </Modal>


    </div>
  );
}

export default QuickActions;