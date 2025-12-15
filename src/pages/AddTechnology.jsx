import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTech } from '../context/TechContext'; // Импортируем хук
import '../App.css';

function AddTechnology() {
  const navigate = useNavigate();
  const { technologies, setTechnologies } = useTech(); // Используем контекст
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    status: 'not-started',
    notes: '',
    deadline: ''
  });

  const [errors, setErrors] = useState({});
  const [isFormValid, setIsFormValid] = useState(false);

  const validateForm = () => {
    const newErrors = {};

    // Валидация названия
    if (!formData.title.trim()) {
      newErrors.title = 'Название технологии обязательно';
    } else if (formData.title.trim().length < 2) {
      newErrors.title = 'Название должно содержать минимум 2 символа';
    }

    // Валидация дедлайна (если заполнен)
    if (formData.deadline) {
      const deadlineDate = new Date(formData.deadline);
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      if (deadlineDate < today) {
        newErrors.deadline = 'Дедлайн не может быть в прошлом';
      }
    }

    setErrors(newErrors);
    setIsFormValid(Object.keys(newErrors).length === 0);
  };

  // Запускаем валидацию при каждом изменении
  useEffect(() => {
    validateForm();
  }, [formData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!isFormValid) {
      const firstError = Object.keys(errors)[0];
      if (firstError) {
        document.getElementById(`${firstError}-error`)?.scrollIntoView({ behavior: 'smooth' });
      }
      return;
    }

    if (!formData.title.trim()) {
      alert('Пожалуйста, введите название технологии');
      return;
    }

    const newTech = {
      id: technologies.length > 0 ? Math.max(...technologies.map(t => t.id)) + 1 : 1,
      title: formData.title.trim(),
      description: formData.description.trim(),
      status: formData.status,
      notes: formData.notes.trim(),
      createdAt: new Date().toISOString()
    };

    setTechnologies([...technologies, newTech]); // Используем setTechnologies из контекста

    alert('Технология успешно добавлена!');
    navigate('/technologies');
  };

  return (
    <div className="page">
      <div className="page-header">
        <h1>Добавить новую технологию</h1>
        <button
          onClick={() => navigate('/technologies')}
          className="btn btn-secondary"
        >
          ← Назад к списку
        </button>
      </div>

      <div className="add-tech-form-container">
        <form onSubmit={handleSubmit} className="add-tech-form">
          <div className="form-group">
            <label htmlFor="title">Название технологии *</label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Например: React Hooks, Express.js, MongoDB"
              required
              className={`form-input ${errors.title ? 'error' : ''}`}
              aria-required="true"
              aria-invalid={!!errors.title}
              aria-describedby={errors.title ? 'title-error' : undefined}
            />
            <div className="form-hint">Краткое и понятное название</div>
            {errors.title && (
              <span id="title-error" className="error-message" role="alert">
                {errors.title}
              </span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="deadline">Дедлайн изучения</label>
            <input
              type="date"
              id="deadline"
              name="deadline"
              value={formData.deadline}
              onChange={handleChange}
              className={`form-input ${errors.deadline ? 'error' : ''}`}
              aria-invalid={!!errors.deadline}
              aria-describedby={errors.deadline ? 'deadline-error' : undefined}
            />
            {errors.deadline && (
              <span id="deadline-error" className="error-message" role="alert">
                {errors.deadline}
              </span>
            )}
            <div className="form-hint">Необязательное поле</div>
          </div>

          <div className="form-group">
            <label htmlFor="description">Описание</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Что вы планируете изучить? Задачи, цели..."
              rows="4"
              className="form-textarea"
            />
            <div className="form-hint">Опишите, что вы хотите изучить</div>
          </div>

          <div className="form-group">
            <label htmlFor="status">Начальный статус</label>
            <div className="status-options">
              <label className="status-option">
                <input
                  type="radio"
                  name="status"
                  value="not-started"
                  checked={formData.status === 'not-started'}
                  onChange={handleChange}
                />
                <span className="status-badge-option not-started">
                  ⭕ Не начато
                </span>
              </label>
              <label className="status-option">
                <input
                  type="radio"
                  name="status"
                  value="in-progress"
                  checked={formData.status === 'in-progress'}
                  onChange={handleChange}
                />
                <span className="status-badge-option in-progress">
                  ⏳ В процессе
                </span>
              </label>
              <label className="status-option">
                <input
                  type="radio"
                  name="status"
                  value="completed"
                  checked={formData.status === 'completed'}
                  onChange={handleChange}
                />
                <span className="status-badge-option completed">
                  ✅ Выполнено
                </span>
              </label>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="notes">Первоначальные заметки</label>
            <textarea
              id="notes"
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              placeholder="Ссылки на документацию, полезные ресурсы, план изучения..."
              rows="5"
              className="form-textarea"
            />
            <div className="form-hint">Эти заметки можно будет редактировать позже</div>
          </div>

          <div className="form-actions">
            <button
              type="button"
              onClick={() => navigate('/technologies')}
              className="btn btn-secondary"
            >
              Отмена
            </button>
            <button
              type="submit"
              className="btn btn-primary"
            >
              Добавить технологию
            </button>
          </div>
        </form>

        <div className="form-preview">
          <h3>Предварительный просмотр</h3>
          <div className="preview-card">
            <div className="preview-header">
              <h4>{formData.title || 'Название технологии'}</h4>
              <span className={`preview-status ${formData.status}`}>
                {formData.status === 'completed' && '✅'}
                {formData.status === 'in-progress' && '⏳'}
                {formData.status === 'not-started' && '⭕'}
              </span>
            </div>
            <p className="preview-description">
              {formData.description || 'Описание технологии появится здесь...'}
            </p>
            {formData.notes && (
              <div className="preview-notes">
                <strong>Заметки:</strong>
                <p>{formData.notes.substring(0, 100)}...</p>
              </div>
            )}
          </div>
        </div>
      </div>
      {/* Область для скринридера */}
      <div
        role="status"
        aria-live="polite"
        aria-atomic="true"
        className="sr-only"
      >
        {Object.keys(errors).length > 0 && 'В форме есть ошибки'}
      </div>
    </div>
  );
}

export default AddTechnology;