import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import useLocalStorage from '../hooks/useLocalStorage';
import { useSimpleNotification } from '../components/MuiNotification';
import '../App.css';

function Statistics() {
  const { show, MuiNotification } = useSimpleNotification();
  const [technologies] = useLocalStorage('techTrackerData', []);
  const [chartType, setChartType] = useState('pie');

  // Рассчитываем статистику
  const total = technologies.length;
  const completed = technologies.filter(t => t.status === 'completed').length;
  const inProgress = technologies.filter(t => t.status === 'in-progress').length;
  const notStarted = technologies.filter(t => t.status === 'not-started').length;

  // Статистика по заметкам
  const withNotes = technologies.filter(t => t.notes && t.notes.trim().length > 0).length;
  const totalNotesLength = technologies.reduce((sum, t) => sum + (t.notes ? t.notes.length : 0), 0);
  const avgNotesLength = withNotes > 0 ? Math.round(totalNotesLength / withNotes) : 0;

  // Проценты
  const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;
  const notesRate = total > 0 ? Math.round((withNotes / total) * 100) : 0;

  // Самые длинные заметки
  const longestNotes = [...technologies]
    .filter(t => t.notes)
    .sort((a, b) => (b.notes?.length || 0) - (a.notes?.length || 0))
    .slice(0, 3);

  // Технологии по статусам
  const completedTech = technologies.filter(t => t.status === 'completed');
  const inProgressTech = technologies.filter(t => t.status === 'in-progress');

  return (
    <div className="page">
      <MuiNotification />
      <div className="page-header">
        <h1>Статистика изучения</h1>
        <p>Анализ прогресса и эффективности обучения</p>
      </div>

      <div className="stats-overview-grid">
        <div className="stat-card-large">
          <div className="stat-icon-large">📊</div>
          <div className="stat-content-large">
            <div className="stat-value-large">{completionRate}%</div>
            <div className="stat-label-large">Общий прогресс</div>
          </div>
        </div>

        <div className="stat-card-large">
          <div className="stat-icon-large">⏱️</div>
          <div className="stat-content-large">
            <div className="stat-value-large">{total}</div>
            <div className="stat-label-large">Всего технологий</div>
          </div>
        </div>

        <div className="stat-card-large">
          <div className="stat-icon-large">📝</div>
          <div className="stat-content-large">
            <div className="stat-value-large">{notesRate}%</div>
            <div className="stat-label-large">С заметками</div>
          </div>
        </div>
      </div>

      <div className="stats-container">
        <div className="stats-section">
          <h2>Распределение по статусам</h2>
          <div className="status-distribution">
            <div className="status-item completed">
              <span className="status-label">Выполнено</span>
              <div className="status-bar">
                <div 
                  className="status-fill" 
                  style={{ width: `${total > 0 ? (completed / total) * 100 : 0}%` }}
                ></div>
              </div>
              <span className="status-count">{completed} ({completionRate}%)</span>
            </div>
            
            <div className="status-item in-progress">
              <span className="status-label">В процессе</span>
              <div className="status-bar">
                <div 
                  className="status-fill" 
                  style={{ width: `${total > 0 ? (inProgress / total) * 100 : 0}%` }}
                ></div>
              </div>
              <span className="status-count">{inProgress}</span>
            </div>
            
            <div className="status-item not-started">
              <span className="status-label">Не начато</span>
              <div className="status-bar">
                <div 
                  className="status-fill" 
                  style={{ width: `${total > 0 ? (notStarted / total) * 100 : 0}%` }}
                ></div>
              </div>
              <span className="status-count">{notStarted}</span>
            </div>
          </div>
        </div>

        <div className="stats-section">
          <h2>Статистика заметок</h2>
          <div className="notes-stats-grid">
            <div className="notes-stat-card">
              <div className="notes-stat-value">{withNotes}</div>
              <div className="notes-stat-label">Технологий с заметками</div>
            </div>
            <div className="notes-stat-card">
              <div className="notes-stat-value">{totalNotesLength}</div>
              <div className="notes-stat-label">Всего символов</div>
            </div>
            <div className="notes-stat-card">
              <div className="notes-stat-value">{avgNotesLength}</div>
              <div className="notes-stat-label">Средняя длина</div>
            </div>
          </div>
          
          {longestNotes.length > 0 && (
            <div className="longest-notes">
              <h3>Самые подробные заметки:</h3>
              {longestNotes.map(tech => (
                <div key={tech.id} className="note-item">
                  <Link to={`/technology/${tech.id}`} className="note-title">
                    {tech.title}
                  </Link>
                  <span className="note-length">{tech.notes?.length || 0} симв.</span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="stats-section">
          <h2>Продуктивность</h2>
          <div className="productivity-stats">
            <div className="productivity-item">
              <div className="productivity-label">Средний прогресс</div>
              <div className="productivity-value">{completionRate}%</div>
            </div>
            <div className="productivity-item">
              <div className="productivity-label">Активных задач</div>
              <div className="productivity-value">{inProgress}</div>
            </div>
            <div className="productivity-item">
              <div className="productivity-label">Завершено</div>
              <div className="productivity-value">{completed}</div>
            </div>
          </div>
        </div>

        <div className="stats-section">
          <h2>Выполненные технологии</h2>
          <div className="completed-list">
            {completedTech.length > 0 ? (
              completedTech.map(tech => (
                <div key={tech.id} className="completed-item">
                  <span className="completed-title">{tech.title}</span>
                  {tech.notes && <span className="has-notes-mini">📝</span>}
                </div>
              ))
            ) : (
              <p className="empty-message">Пока нет выполненных технологий</p>
            )}
          </div>
        </div>
      </div>

      <div className="export-section">
        <h3>Экспорт статистики</h3>
        <p>Вы можете экспортировать данные для дальнейшего анализа</p>
        <button 
          className="btn btn-primary"
          onClick={() => {
            const data = {
              exportedAt: new Date().toISOString(),
              statistics: {
                total,
                completed,
                inProgress,
                notStarted,
                completionRate,
                notesRate,
                withNotes,
                totalNotesLength,
                avgNotesLength
              },
              technologies
            };
            console.log('Статистика:', JSON.stringify(data, null, 2));
            show('Успешно! Проверьте консоль', 'success')
          }}
        >
          Экспортировать данные
        </button>
      </div>
    </div>
  );
}

export default Statistics;