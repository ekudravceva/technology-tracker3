import { useParams, Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import useLocalStorage from '../hooks/useLocalStorage';
import '../App.css';

function TechnologyDetail() {
  const { techId } = useParams();
  const navigate = useNavigate();
  const [technologies, setTechnologies] = useLocalStorage('techTrackerData', []);
  const [technology, setTechnology] = useState(null);
  const [localNotes, setLocalNotes] = useState('');

  useEffect(() => {
    const tech = technologies.find(t => t.id === parseInt(techId));
    if (tech) {
      setTechnology(tech);
      setLocalNotes(tech.notes || '');
    }
  }, [techId, technologies]);

  const updateStatus = (newStatus) => {
    const updated = technologies.map(tech =>
      tech.id === parseInt(techId) ? { ...tech, status: newStatus } : tech
    );
    setTechnologies(updated);
    setTechnology({ ...technology, status: newStatus });
  };

  const updateNotes = () => {
    const updated = technologies.map(tech =>
      tech.id === parseInt(techId) ? { ...tech, notes: localNotes } : tech
    );
    setTechnologies(updated);
  };

  const deleteTechnology = () => {
    if (window.confirm('Вы уверены, что хотите удалить эту технологию?')) {
      const updated = technologies.filter(tech => tech.id !== parseInt(techId));
      setTechnologies(updated);
      navigate('/technologies');
    }
  };

  const getNextStatus = (currentStatus) => {
    switch (currentStatus) {
      case 'not-started': return 'in-progress';
      case 'in-progress': return 'completed';
      case 'completed': return 'not-started';
      default: return 'not-started';
    }
  };

  if (!technology) {
    return (
      <div className="page">
        <h1>Технология не найдена</h1>
        <p>Технология с ID {techId} не существует.</p>
        <Link to="/technologies" className="btn">
          ← Назад к списку
        </Link>
      </div>
    );
  }

  const getProgressPercent = () => {
    switch (technology.status) {
      case 'completed': return 100;
      case 'in-progress': return 50;
      case 'not-started': return 0;
      default: return 0;
    }
  };

  return (
    <div className="page">
      <div className="page-header">
        <Link to="/technologies" className="back-link">
          ← Назад к списку
        </Link>
        <div className="header-actions">
          <button 
            className="btn btn-secondary"
            onClick={() => updateStatus(getNextStatus(technology.status))}
          >
            Сменить статус
          </button>
          <button 
            className="btn btn-danger"
            onClick={deleteTechnology}
          >
            Удалить
          </button>
        </div>
      </div>

      <div className="technology-detail-card">
        <div className="detail-header">
          <h1>{technology.title}</h1>
          <span className={`status-badge-detail ${technology.status}`}>
            {technology.status === 'completed' && '✅ Выполнено'}
            {technology.status === 'in-progress' && '⏳ В процессе'}
            {technology.status === 'not-started' && '⭕ Не начато'}
          </span>
        </div>

        <div className="detail-section">
          <h3>Описание</h3>
          <p>{technology.description}</p>
        </div>

        <div className="detail-section">
          <h3>Прогресс изучения</h3>
          <div className="progress-indicator">
            <div className="progress-label">
              <span>Прогресс:</span>
              <span>{getProgressPercent()}%</span>
            </div>
            <div className="progress-bar">
              <div
                className={`progress-fill ${technology.status}`}
                style={{ width: `${getProgressPercent()}%` }}
              ></div>
            </div>
          </div>
          
          <div className="status-buttons">
            <button
              onClick={() => updateStatus('not-started')}
              className={technology.status === 'not-started' ? 'active' : ''}
            >
              Не начато
            </button>
            <button
              onClick={() => updateStatus('in-progress')}
              className={technology.status === 'in-progress' ? 'active' : ''}
            >
              В процессе
            </button>
            <button
              onClick={() => updateStatus('completed')}
              className={technology.status === 'completed' ? 'active' : ''}
            >
              Завершено
            </button>
          </div>
        </div>

        <div className="detail-section">
          <h3>Мои заметки</h3>
          <textarea
            value={localNotes}
            onChange={(e) => setLocalNotes(e.target.value)}
            onBlur={updateNotes}
            placeholder="Записывайте сюда важные моменты, ссылки, команды..."
            rows="6"
            className="notes-textarea"
          />
          <div className="notes-info">
            <small>💡 Заметки автоматически сохраняются при потере фокуса</small>
            <span className="char-count">{localNotes.length} символов</span>
          </div>
        </div>

        <div className="detail-meta">
          <div className="meta-item">
            <strong>ID:</strong> {technology.id}
          </div>
          <div className="meta-item">
            <strong>Добавлена:</strong> {new Date().toLocaleDateString()}
          </div>
        </div>
      </div>
    </div>
  );
}

export default TechnologyDetail;