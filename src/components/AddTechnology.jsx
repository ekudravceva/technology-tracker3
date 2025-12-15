import { useState } from 'react';
import { useTech } from '../context/TechContext';
import './QuickActions.css';

function AddTechnology({ technologies }) {
    const [newTechTitle, setNewTechTitle] = useState('');
    const [newTechDescription, setNewTechDescription] = useState('');
    const [isAdding, setIsAdding] = useState(false);

    // Правильное использование useTech
    const techContext = useTech();
    const { setTechnologies } = techContext;

    const handleAddTechnology = () => {
        if (!newTechTitle.trim()) return;

        const newTech = {
            id: Date.now(),
            title: newTechTitle.trim(),
            description: newTechDescription.trim(),
            status: 'not-started',
            notes: ''
        };

        setTechnologies(prev => [...prev, newTech]);
        setNewTechTitle('');
        setNewTechDescription('');
        setIsAdding(false);
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

  return (
    <div className="quick-actions">
      <div className="actions-header">
        <h3>Быстрые действия</h3>
      </div>
      
      <div className="actions-buttons">
        <button 
          className="action-btn primary"
          onClick={() => setIsAdding(!isAdding)}
        >
          {isAdding ? 'Отменить' : '➕ Добавить технологию'}
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

      {isAdding && (
        <div className="add-tech-form">
          <div className="form-group">
            <label htmlFor="techTitle">Название технологии *</label>
            <input
              id="techTitle"
              type="text"
              placeholder="Например: Redux, TypeScript, Next.js"
              value={newTechTitle}
              onChange={(e) => setNewTechTitle(e.target.value)}
              autoFocus
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="techDescription">Описание</label>
            <textarea
              id="techDescription"
              placeholder="Что вы планируете изучить?"
              value={newTechDescription}
              onChange={(e) => setNewTechDescription(e.target.value)}
              rows="3"
            />
          </div>
          
          <div className="form-actions">
            <button 
              className="save-btn"
              onClick={handleAddTechnology}
              disabled={!newTechTitle.trim()}
            >
              Сохранить технологию
            </button>
            <button 
              className="cancel-btn"
              onClick={() => {
                setIsAdding(false);
                setNewTechTitle('');
                setNewTechDescription('');
              }}
            >
              Отмена
            </button>
          </div>
        </div>
      )}
      
      <div className="stats-info">
        <span className="stat">
          Всего: <strong>{technologies.length}</strong>
        </span>
        <span className="stat">
          Не начато: <strong>{technologies.filter(t => t.status === 'not-started').length}</strong>
        </span>
        <span className="stat">
          В процессе: <strong>{technologies.filter(t => t.status === 'in-progress').length}</strong>
        </span>
        <span className="stat">
          Завершено: <strong>{technologies.filter(t => t.status === 'completed').length}</strong>
        </span>
      </div>
    </div>
  );
}

export default AddTechnology;