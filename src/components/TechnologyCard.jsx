// // src/components/TechnologyCard.jsx
// import './TechnologyCard.css';

// function TechnologyCard({ id, title, description, status, onStatusChange }) {
//   // Определяем порядок смены статусов
//   const getNextStatus = (currentStatus) => {
//     switch (currentStatus) {
//       case 'not-started': return 'in-progress';
//       case 'in-progress': return 'completed';
//       case 'completed': return 'not-started';
//       default: return 'not-started';
//     }
//   };

//   // Обработчик клика по карточке
//   const handleCardClick = () => {
//     if (onStatusChange) {
//       const newStatus = getNextStatus(status);
//       onStatusChange(id, newStatus);
//     }
//   };

//   // Определяем процент прогресса в зависимости от статуса
//   const getProgressPercent = () => {
//     switch(status) {
//       case 'completed': return 100;
//       case 'in-progress': return 50;
//       case 'not-started': return 0;
//       default: return 0;
//     }
//   };

//   // Определяем текст для статуса
//   const getStatusText = () => {
//     switch(status) {
//       case 'completed': return '✅ Выполнено';
//       case 'in-progress': return '⏳ В процессе';
//       case 'not-started': return '⭕ Не начато';
//       default: return '❓ Неизвестно';
//     }
//   };

//   // Определяем иконку для статуса
//   const getStatusIcon = () => {
//     switch(status) {
//       case 'completed': return '✓';
//       case 'in-progress': return '⏳';
//       case 'not-started': return '○';
//       default: return '?';
//     }
//   };

//   return (
//     <div 
//       className={`technology-card ${status}`}
//       onClick={handleCardClick}
//       style={{ cursor: onStatusChange ? 'pointer' : 'default' }}
//     >
//       <div className="card-header">
//         <h3>{title}</h3>
//         <span className={`status-badge ${status}`}>
//           {getStatusIcon()} {getStatusText()}
//         </span>
//       </div>
      
//       <div className="card-body">
//         <p>{description}</p>
//       </div>
      
//       <div className="progress-indicator">
//         <div className="progress-label">
//           <span>Прогресс изучения:</span>
//           <span>{getProgressPercent()}%</span>
//         </div>
//         <div className="progress-bar">
//           <div 
//             className={`progress-fill ${status}`}
//             style={{ width: `${getProgressPercent()}%` }}
//           ></div>
//         </div>
//       </div>
      
//       {/* Подсказка для пользователя */}
//       {onStatusChange && (
//         <div className="click-hint">
//           <small>Нажмите на карточку, чтобы изменить статус</small>
//         </div>
//       )}
//     </div>
//   );
// }

// export default TechnologyCard;

// src/components/TechnologyCard.jsx
import { useState } from 'react';
import './TechnologyCard.css';

function TechnologyCard({ 
  id, 
  title, 
  description, 
  status, 
  notes, 
  onStatusChange,
  onNotesChange 
}) {
  // Состояние для управления раскрытием/скрытием заметок
  const [isNotesExpanded, setIsNotesExpanded] = useState(false);
  // Локальное состояние для заметок (для оптимизации рендеринга)
  const [localNotes, setLocalNotes] = useState(notes || '');

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

  // Обработчик клика по кнопке заметок
  const handleNotesClick = (e) => {
    e.stopPropagation(); // Предотвращаем всплытие клика на карточку
    setIsNotesExpanded(!isNotesExpanded);
  };

  // Обработчик изменения текста заметок
  const handleNotesChange = (e) => {
    const newNotes = e.target.value;
    setLocalNotes(newNotes);
    
    // Отправляем изменения родительскому компоненту
    if (onNotesChange) {
      onNotesChange(id, newNotes);
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

  // Подсчитываем символы в заметках
  const getNotesInfo = () => {
    if (!localNotes || localNotes.trim() === '') {
      return 'Заметок нет';
    }
    
    const charCount = localNotes.length;
    const wordCount = localNotes.trim().split(/\s+/).filter(word => word.length > 0).length;
    
    return `${charCount} символов, ${wordCount} слов`;
  };

  // Получаем предварительный просмотр заметок
  const getNotesPreview = () => {
    if (!localNotes || localNotes.trim() === '') {
      return 'Добавить заметку...';
    }
    
    const preview = localNotes.substring(0, 60);
    return localNotes.length > 60 ? `${preview}...` : preview;
  };

  return (
    <div 
      className={`technology-card ${status}`}
      onClick={handleCardClick}
      style={{ cursor: onStatusChange ? 'pointer' : 'default' }}
    >
      <div className="card-header">
        <div className="header-content">
          <h3>{title}</h3>
          <div className="header-controls">
            {/* Кнопка управления заметками */}
            <button 
              className={`notes-button ${localNotes ? 'has-notes' : ''} ${isNotesExpanded ? 'expanded' : ''}`}
              onClick={handleNotesClick}
              title={isNotesExpanded ? "Скрыть заметки" : "Показать заметки"}
            >
              📝
            </button>
            
            <span className={`status-badge ${status}`}>
              {getStatusIcon()} {getStatusText()}
            </span>
          </div>
        </div>
      </div>
      
      <div className="card-body">
        <p>{description}</p>
        
        {/* Блок заметок */}
        {isNotesExpanded && (
          <div 
            className="notes-section"
            onClick={(e) => e.stopPropagation()} // Предотвращаем клик на карточку
          >
            <div className="notes-header">
              <h4>Мои заметки:</h4>
              <span className="notes-info">{getNotesInfo()}</span>
            </div>
            
            <textarea
              value={localNotes}
              onChange={handleNotesChange}
              placeholder="Записывайте сюда важные моменты, ссылки, команды..."
              rows="4"
              className="notes-textarea"
              onClick={(e) => e.stopPropagation()} // Предотвращаем клик на карточку
            />
            
            <div className="notes-hint">
              <small>💡 Заметки автоматически сохраняются при вводе</small>
            </div>
          </div>
        )}
        
        {/* Предварительный просмотр заметок (когда свёрнуто) */}
        {!isNotesExpanded && localNotes && localNotes.trim() !== '' && (
          <div 
            className="notes-preview"
            onClick={handleNotesClick}
          >
            <span className="preview-icon">📌</span>
            <span className="preview-text">{getNotesPreview()}</span>
          </div>
        )}
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
          {localNotes && (
            <small className="notes-hint"> • Есть заметки</small>
          )}
        </div>
      )}
    </div>
  );
}

export default TechnologyCard;