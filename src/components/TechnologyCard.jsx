import './TechnologyCard.css';

function TechnologyCard({ title, description, status }) {
  const getProgressPercent = () => {
    switch (status) {
      case 'completed': return 100;
      case 'in-progress': return 50;
      case 'not-started': return 0;
      default: return 0;
    }
  };

  return (
    <div className={`technology-card ${status}`}>
      <div className="card-header">
        <h3>{title}</h3>
        <span className={`status-badge ${status}`}>
          {status === 'completed' && 'Выполнено'}
          {status === 'in-progress' && 'В процессе'}
          {status === 'not-started' && 'Не начато'}
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
    </div>
  );
}

export default TechnologyCard;