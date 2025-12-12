import { useState } from 'react';
import './BulkStatusEditor.css';

function BulkStatusEditor({ technologies, onBulkUpdate }) {
  // Состояние для выбранных технологий
  const [selectedTechs, setSelectedTechs] = useState([]);
  // Состояние для нового статуса
  const [newStatus, setNewStatus] = useState('not-started');
  // Состояние для подтверждения
  const [isConfirming, setIsConfirming] = useState(false);

  // Обработчик выбора технологии
  const handleTechSelect = (techId) => {
    setSelectedTechs(prev => {
      if (prev.includes(techId)) {
        return prev.filter(id => id !== techId);
      } else {
        return [...prev, techId];
      }
    });
  };

  // Обработчик выбора всех
  const handleSelectAll = () => {
    if (selectedTechs.length === technologies.length) {
      setSelectedTechs([]); // Снять все
    } else {
      setSelectedTechs(technologies.map(tech => tech.id)); // Выбрать все
    }
  };

  // Применить изменения
  const handleApplyChanges = () => {
    if (selectedTechs.length === 0) {
      alert('Выберите хотя бы одну технологию');
      return;
    }

    setIsConfirming(true);
  };

  // Подтвердить изменения
  const handleConfirm = () => {
    const updates = selectedTechs.map(id => ({
      id,
      status: newStatus,
      updatedAt: new Date().toISOString()
    }));

    onBulkUpdate(updates);
    setSelectedTechs([]);
    setIsConfirming(false);
    setNewStatus('not-started');
  };

  // Отмена подтверждения
  const handleCancelConfirm = () => {
    setIsConfirming(false);
  };

  return (
    <div className="bulk-status-editor" role="region" aria-label="Массовое редактирование статусов">
      <h2 className="editor-title">Массовое редактирование статусов</h2>
      
      {/* Панель управления */}
      <div className="editor-controls">
        <div className="selection-controls">
          <button
            type="button"
            onClick={handleSelectAll}
            className="btn-select-all"
            aria-label={selectedTechs.length === technologies.length ? 'Снять выделение со всех' : 'Выбрать все технологии'}
          >
            {selectedTechs.length === technologies.length ? '☑ Снять все' : '☐ Выбрать все'}
          </button>
          <span className="selection-count" aria-live="polite">
            Выбрано: {selectedTechs.length} из {technologies.length}
          </span>
        </div>

        <div className="status-controls">
          <label htmlFor="bulk-status-select" className="status-label">
            Новый статус для выбранных:
          </label>
          <select
            id="bulk-status-select"
            value={newStatus}
            onChange={(e) => setNewStatus(e.target.value)}
            className="status-select"
            aria-describedby="status-help"
          >
            <option value="not-started">⭕ Не начато</option>
            <option value="in-progress">⏳ В процессе</option>
            <option value="completed">✅ Выполнено</option>
          </select>
          <span id="status-help" className="help-text">
            Этот статус будет применен ко всем выбранным технологиям
          </span>
        </div>

        <button
          type="button"
          onClick={handleApplyChanges}
          disabled={selectedTechs.length === 0}
          className="btn-apply"
          aria-disabled={selectedTechs.length === 0}
        >
          Применить к {selectedTechs.length} техн.
        </button>
      </div>

      {/* Список технологий с чекбоксами */}
      <div className="tech-list-editor" role="listbox" aria-multiselectable="true">
        {technologies.map(tech => (
          <div
            key={tech.id}
            className={`tech-item ${selectedTechs.includes(tech.id) ? 'selected' : ''}`}
            role="option"
            aria-selected={selectedTechs.includes(tech.id)}
          >
            <input
              type="checkbox"
              id={`tech-${tech.id}`}
              checked={selectedTechs.includes(tech.id)}
              onChange={() => handleTechSelect(tech.id)}
              className="tech-checkbox"
              aria-label={`Выбрать технологию ${tech.title}`}
            />
            
            <label htmlFor={`tech-${tech.id}`} className="tech-label">
              <div className="tech-info">
                <span className="tech-title">{tech.title}</span>
                <span className={`tech-status ${tech.status}`}>
                  {tech.status === 'completed' && '✅'}
                  {tech.status === 'in-progress' && '⏳'}
                  {tech.status === 'not-started' && '⭕'}
                  {tech.status === 'completed' ? 'Выполнено' : 
                   tech.status === 'in-progress' ? 'В процессе' : 'Не начато'}
                </span>
              </div>
              {tech.description && (
                <p className="tech-description">{tech.description}</p>
              )}
            </label>
          </div>
        ))}
      </div>

      {/* Модальное окно подтверждения */}
      {isConfirming && (
        <div className="confirmation-modal" role="dialog" aria-labelledby="confirm-title">
          <div className="modal-content">
            <h3 id="confirm-title">Подтверждение изменений</h3>
            <p>
              Вы уверены, что хотите изменить статус <strong>{selectedTechs.length}</strong> технологий на 
              <strong>
                {newStatus === 'completed' ? ' ✅ Выполнено' : 
                 newStatus === 'in-progress' ? ' ⏳ В процессе' : ' ⭕ Не начато'}
              </strong>?
            </p>
            
            <div className="selected-preview">
              <h4>Будут изменены:</h4>
              <ul>
                {technologies
                  .filter(tech => selectedTechs.includes(tech.id))
                  .slice(0, 5) // Показываем только первые 5
                  .map(tech => (
                    <li key={tech.id}>
                      {tech.title} ({tech.status} → {newStatus})
                    </li>
                  ))}
                {selectedTechs.length > 5 && (
                  <li>...и еще {selectedTechs.length - 5} технологий</li>
                )}
              </ul>
            </div>

            <div className="modal-actions">
              <button
                type="button"
                onClick={handleCancelConfirm}
                className="btn-cancel"
                aria-label="Отмена"
              >
                Отмена
              </button>
              <button
                type="button"
                onClick={handleConfirm}
                className="btn-confirm"
                aria-label="Подтвердить изменения"
              >
                Подтвердить
              </button>
            </div>
          </div>
          <div className="modal-overlay" onClick={handleCancelConfirm} aria-hidden="true" />
        </div>
      )}

      {/* Сообщение для скринридера */}
      <div
        role="status"
        aria-live="polite"
        aria-atomic="true"
        className="sr-only"
      >
        {selectedTechs.length > 0 
          ? `Выбрано ${selectedTechs.length} технологий для изменения` 
          : 'Технологии не выбраны'}
      </div>
    </div>
  );
}

export default BulkStatusEditor;