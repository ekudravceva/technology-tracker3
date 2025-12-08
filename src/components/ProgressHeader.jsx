// src/components/ProgressHeader.jsx
import './ProgressHeader.css';

function ProgressHeader({ technologies }) {
  // Рассчитываем статистику
  const total = technologies.length;
  const completed = technologies.filter(tech => tech.status === 'completed').length;
  const inProgress = technologies.filter(tech => tech.status === 'in-progress').length;
  const notStarted = technologies.filter(tech => tech.status === 'not-started').length;
  
  // Процент выполнения (округляем до целого)
  const completionPercentage = total > 0 ? Math.round((completed / total) * 100) : 0;
  
  // Определяем цвет прогресс-бара в зависимости от процента
  const getProgressColor = () => {
    if (completionPercentage >= 80) return 'high';
    if (completionPercentage >= 40) return 'medium';
    return 'low';
  };

  // Определяем текстовое описание прогресса
  const getProgressDescription = () => {
    if (completionPercentage === 0) return 'Начните изучение!';
    if (completionPercentage < 30) return 'Есть над чем работать';
    if (completionPercentage < 60) return 'Хороший прогресс!';
    if (completionPercentage < 90) return 'Отличные результаты!';
    return 'Почти завершено!';
  };

  return (
    <div className="progress-header">
      <div className="stats-overview">
        <div className="stat-card">
          <div className="stat-icon">📚</div>
          <div className="stat-content">
            <div className="stat-value">{total}</div>
            <div className="stat-label">Всего технологий</div>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon">✅</div>
          <div className="stat-content">
            <div className="stat-value">{completed}</div>
            <div className="stat-label">Изучено</div>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon">⏳</div>
          <div className="stat-content">
            <div className="stat-value">{inProgress}</div>
            <div className="stat-label">В процессе</div>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon">⭕</div>
          <div className="stat-content">
            <div className="stat-value">{notStarted}</div>
            <div className="stat-label">Не начато</div>
          </div>
        </div>
      </div>

      <div className="progress-section">
        <div className="progress-info">
          <div className="progress-title">
            <h3>Общий прогресс</h3>
            <span className="percentage">{completionPercentage}%</span>
          </div>
          <p className="progress-description">{getProgressDescription()}</p>
        </div>
        
        <div className="progress-bar-container">
          <div 
            className={`progress-bar-main ${getProgressColor()}`}
            style={{ width: `${completionPercentage}%` }}
          >
            <div className="progress-fill"></div>
          </div>
          <div className="progress-labels">
            <span>0%</span>
            <span>50%</span>
            <span>100%</span>
          </div>
        </div>
        
        <div className="progress-details">
          <div className="progress-item completed">
            <span className="dot"></span>
            <span>Изучено: {completed} из {total}</span>
          </div>
          <div className="progress-item in-progress">
            <span className="dot"></span>
            <span>В процессе: {inProgress}</span>
          </div>
          <div className="progress-item not-started">
            <span className="dot"></span>
            <span>Не начато: {notStarted}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProgressHeader;