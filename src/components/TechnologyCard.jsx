// src/components/TechnologyCard.jsx
import './TechnologyCard.css';

function TechnologyCard({ id, title, description, status, onStatusChange }) {
  // Определяем порядок смены статусов
  const getNextStatus = (currentStatus) => {
    switch (currentStatus) {
      case 'not-started': return 'in-progress';
      case 'in-progress': return 'completed';
      case 'completed': return 'not-started';
      default: return 'not-started';
    }
  };

  // Обработчик клика по карточке
  const handleCardClick = () => {
    if (onStatusChange) {
      const newStatus = getNextStatus(status);
      onStatusChange(id, newStatus);
    }
  };

  // Определяем процент прогресса в зависимости от статуса
  const getProgressPercent = () => {
    switch(status) {
      case 'completed': return 100;
      case 'in-progress': return 50;
      case 'not-started': return 0;
      default: return 0;
    }
  };

  // Определяем текст для статуса
  const getStatusText = () => {
    switch(status) {
      case 'completed': return '✅ Выполнено';
      case 'in-progress': return '⏳ В процессе';
      case 'not-started': return '⭕ Не начато';
      default: return '❓ Неизвестно';
    }
  };

  // Определяем иконку для статуса
  const getStatusIcon = () => {
    switch(status) {
      case 'completed': return '✓';
      case 'in-progress': return '⏳';
      case 'not-started': return '○';
      default: return '?';
    }
  };

  return (
    <div 
      className={`technology-card ${status}`}
      onClick={handleCardClick}
      style={{ cursor: onStatusChange ? 'pointer' : 'default' }}
    >
      <div className="card-header">
        <h3>{title}</h3>
        <span className={`status-badge ${status}`}>
          {getStatusIcon()} {getStatusText()}
        </span>
      </div>
      
      <div className="card-body">
        <p>{description}</p>
      </div>
      
      <div className="progress-indicator">
        <div className="progress-label">
          <span>Прогресс изучения:</span>
          <span>{getProgressPercent()}%</span>
        </div>
        <div className="progress-bar">
          <div 
            className={`progress-fill ${status}`}
            style={{ width: `${getProgressPercent()}%` }}
          ></div>
        </div>
      </div>
      
      {/* Подсказка для пользователя */}
      {onStatusChange && (
        <div className="click-hint">
          <small>Нажмите на карточку, чтобы изменить статус</small>
        </div>
      )}
    </div>
  );
}

export default TechnologyCard;