import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useLocalStorage from '../hooks/useLocalStorage';
import '../App.css';

function Settings() {
    const navigate = useNavigate();
    const [technologies, setTechnologies] = useLocalStorage('techTrackerData', []);
    const [settings, setSettings] = useLocalStorage('appSettings', {
        theme: 'light',
        language: 'ru',
        notifications: true,
        autoSave: true
    });

    const [confirmDelete, setConfirmDelete] = useState(false);
    // Состояния для экспорта/импорта
    const [importStatus, setImportStatus] = useState('');
    const [exportStatus, setExportStatus] = useState('');
    const [importError, setImportError] = useState('');
    const [isImporting, setIsImporting] = useState(false);

    const handleSettingChange = (key, value) => {
        const updated = { ...settings, [key]: value };
        setSettings(updated);
    };

    const resetToDefault = () => {
        if (window.confirm('Вернуть все настройки к значениям по умолчанию?')) {
            setSettings({
                theme: 'light',
                language: 'ru',
                notifications: true,
                autoSave: true
            });
        }
    };

    const clearAllData = () => {
        if (confirmDelete) {
            setTechnologies([]);
            setConfirmDelete(false);
            alert('Все данные удалены!');
            navigate('/');
        } else {
            setConfirmDelete(true);
        }
    };

    // Функция проверки валидности данных технологии
    const validateTechnology = (tech) => {
        const errors = [];

        if (!tech.id || typeof tech.id !== 'number') {
            errors.push('Некорректный ID технологии');
        }

        if (!tech.title || typeof tech.title !== 'string' || tech.title.trim().length === 0) {
            errors.push('Некорректное название технологии');
        }

        if (!tech.status || !['not-started', 'in-progress', 'completed'].includes(tech.status)) {
            errors.push('Некорректный статус технологии');
        }

        if (tech.description && typeof tech.description !== 'string') {
            errors.push('Некорректное описание технологии');
        }

        if (tech.notes && typeof tech.notes !== 'string') {
            errors.push('Некорректные заметки');
        }

        return errors;
    };

    // Функция проверки валидности всего массива данных
    const validateImportData = (data) => {
        // Проверяем, что data - объект
        if (!data || typeof data !== 'object') {
            throw new Error('Некорректный формат данных: ожидается объект JSON');
        }

        // Проверяем наличие массива технологий
        if (!Array.isArray(data.technologies)) {
            throw new Error('Некорректный формат данных: отсутствует массив technologies');
        }

        // Проверяем каждую технологию
        const invalidTechs = [];
        data.technologies.forEach((tech, index) => {
            const errors = validateTechnology(tech);
            if (errors.length > 0) {
                invalidTechs.push({
                    index,
                    title: tech.title || 'Без названия',
                    errors
                });
            }
        });

        if (invalidTechs.length > 0) {
            const errorMessage = `Найдены некорректные данные в ${invalidTechs.length} технологиях.\n\n` +
                invalidTechs.slice(0, 3).map(t =>
                    `Технология "${t.title}" (позиция ${t.index + 1}):\n${t.errors.join('\n')}`
                ).join('\n\n');

            if (invalidTechs.length > 3) {
                throw new Error(`${errorMessage}\n\n...и еще ${invalidTechs.length - 3} технологий`);
            }
            throw new Error(errorMessage);
        }

        return true;
    };

    // Улучшенная функция экспорта
    const exportData = () => {
        try {
            // Проверяем, есть ли данные для экспорта
            if (technologies.length === 0) {
                setExportStatus('Нет данных для экспорта');
                setTimeout(() => setExportStatus(''), 3000);
                return;
            }

            // Подготовка данных для экспорта
            const data = {
                exportedAt: new Date().toISOString(),
                version: '1.0.0',
                meta: {
                    technologiesCount: technologies.length,
                    exportedBy: 'TechTracker App'
                },
                technologies: technologies.map(tech => ({
                    ...tech,
                    // Гарантируем корректные типы данных
                    id: Number(tech.id),
                    title: String(tech.title || ''),
                    description: String(tech.description || ''),
                    status: tech.status || 'not-started',
                    notes: String(tech.notes || ''),
                    createdAt: tech.createdAt || new Date().toISOString()
                })),
                settings: {
                    ...settings,
                    // Убираем функции, если они есть
                    theme: String(settings.theme),
                    language: String(settings.language),
                    notifications: Boolean(settings.notifications),
                    autoSave: Boolean(settings.autoSave)
                }
            };

            // Проверяем, что JSON валиден
            const jsonString = JSON.stringify(data, null, 2);
            JSON.parse(jsonString); // Проверка, что строка парсится обратно

            // Создаем файл
            const blob = new Blob(
                [jsonString],
                {
                    type: 'application/json; charset=utf-8'
                }
            );
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `tech-tracker-backup-${new Date().toISOString().split('T')[0]}.json`;
            a.setAttribute('type', 'application/json');

            // Инициируем скачивание
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);

            // Очищаем URL
            URL.revokeObjectURL(url);

            setExportStatus(`Экспортировано ${technologies.length} технологий`);
            setTimeout(() => setExportStatus(''), 3000);

        } catch (error) {
            console.error('Ошибка экспорта:', error);
            setExportStatus('Ошибка при экспорте данных');
            setTimeout(() => setExportStatus(''), 3000);
            alert('Произошла ошибка при экспорте данных. Проверьте консоль для подробностей.');
        }
    };

    // Улучшенная функция импорта
    const importData = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        // Сбрасываем ошибки
        setImportError('');
        setImportStatus('');
        setIsImporting(true);

        // Проверяем расширение файла
        if (!file.name.toLowerCase().endsWith('.json')) {
            setImportError('Файл должен иметь расширение .json');
            setIsImporting(false);
            e.target.value = ''; // Сбрасываем input
            return;
        }

        // Проверяем размер файла (макс 10MB)
        if (file.size > 10 * 1024 * 1024) {
            setImportError('Файл слишком большой (максимум 10MB)');
            setIsImporting(false);
            e.target.value = '';
            return;
        }

        const reader = new FileReader();

        reader.onload = (event) => {
            try {
                // Парсим JSON
                const data = JSON.parse(event.target.result);

                // Валидируем данные
                validateImportData(data);

                // Показываем предварительный просмотр
                const techCount = data.technologies ? data.technologies.length : 0;
                const currentCount = technologies.length;

                if (!window.confirm(
                    `Найдено ${techCount} технологий для импорта.\n` +
                    `У вас сейчас ${currentCount} технологий.\n\n` +
                    `Заменить текущие данные импортированными?\n` +
                    `(Старые данные будут удалены)`
                )) {
                    setIsImporting(false);
                    e.target.value = '';
                    return;
                }

                // Обновляем данные
                setTechnologies(data.technologies || []);

                if (data.settings) {
                    setSettings(prev => ({
                        ...prev,
                        ...data.settings
                    }));
                }

                setImportStatus(`Успешно импортировано ${techCount} технологий`);
                setTimeout(() => setImportStatus(''), 3000);

            } catch (error) {
                console.error('Ошибка импорта:', error);
                setImportError(`Ошибка импорта: ${error.message}`);

                if (error instanceof SyntaxError) {
                    setImportError('Ошибка: файл содержит некорректный JSON');
                }

            } finally {
                setIsImporting(false);
                e.target.value = ''; // Сбрасываем input для повторного выбора
            }
        };

        reader.onerror = () => {
            setImportError('Ошибка чтения файла');
            setIsImporting(false);
            e.target.value = '';
        };

        // Читаем файл как текст
        reader.readAsText(file, 'UTF-8');
    };

    return (
        <div className="page">
            <div className="route-info-section">
                <div className="route-info-content">
                    <h3>Доступ разрешен</h3>
                    <p>Вы успешно прошли защиту маршрута /settings</p>
                </div>
            </div>
            <div className="page-header">
                <h1>Настройки приложения</h1>
                <p>Управление параметрами и данными</p>
            </div>

            <div className="settings-container">
                <div className="settings-section">
                    <h2>Основные настройки</h2>

                    <div className="setting-item">
                        <div className="setting-info">
                            <h4>Тема оформления</h4>
                            <p>Выберите светлую или тёмную тему</p>
                        </div>
                        <div className="setting-control">
                            <select
                                value={settings.theme}
                                onChange={(e) => handleSettingChange('theme', e.target.value)}
                                className="setting-select"
                            >
                                <option value="light">Светлая</option>
                                <option value="dark">Тёмная</option>
                                <option value="auto">Авто</option>
                            </select>
                        </div>
                    </div>

                    <div className="setting-item">
                        <div className="setting-info">
                            <h4>Автосохранение</h4>
                            <p>Автоматически сохранять изменения</p>
                        </div>
                        <div className="setting-control">
                            <label className="switch">
                                <input
                                    type="checkbox"
                                    checked={settings.autoSave}
                                    onChange={(e) => handleSettingChange('autoSave', e.target.checked)}
                                />
                                <span className="slider"></span>
                            </label>
                        </div>
                    </div>
                </div>

                <div className="settings-section">
                    <h2>Управление данными</h2>

                    {/* Статусные сообщения */}
                    {exportStatus && (
                        <div className="alert alert-success" role="alert">
                            ✅ {exportStatus}
                        </div>
                    )}

                    {importStatus && (
                        <div className="alert alert-success" role="alert">
                            ✅ {importStatus}
                        </div>
                    )}

                    {importError && (
                        <div className="alert alert-error" role="alert">
                            ❌ {importError}
                        </div>
                    )}

                    <div className="data-actions">
                        <div className="data-action">
                            <h4>Экспорт данных</h4>
                            <p>Скачайте резервную копию всех данных в формате JSON</p>
                            <div className="export-info">
                                <div className="info-item">
                                    <strong>Технологий для экспорта:</strong> {technologies.length}
                                </div>
                                <div className="info-item">
                                    <strong>Размер данных:</strong> {JSON.stringify(technologies).length} байт
                                </div>
                            </div>
                            <button
                                onClick={exportData}
                                className="btn btn-primary"
                                disabled={technologies.length === 0}
                                aria-disabled={technologies.length === 0}
                            >
                                {isImporting ? '🔄 Обработка...' : '📥 Экспортировать JSON'}
                            </button>
                            <p className="form-hint">
                                Будет создан файл с расширением .json
                            </p>
                        </div>

                        <div className="data-action">
                            <h4>Импорт данных</h4>
                            <p>Загрузите данные из JSON файла</p>
                            <div className="import-info">
                                <div className="info-item">
                                    <strong>Текущие данные:</strong> {technologies.length} технологий
                                </div>
                                <div className="info-item">
                                    <strong>Поддерживаемый формат:</strong> JSON
                                </div>
                            </div>
                            <div>
                                <input
                                    type="file"
                                    accept=".json,application/json"
                                    onChange={importData}
                                    id="import-file"
                                    style={{ display: 'none' }}
                                    disabled={isImporting}
                                    aria-label="Выберите JSON файл для импорта"
                                />
                                <label
                                    htmlFor="import-file"
                                    className={`btn btn-secondary ${isImporting ? 'disabled' : ''}`}
                                >
                                    {isImporting ? '🔄 Импорт...' : '📤 Выбрать JSON файл'}
                                </label>
                            </div>
                            <p className="form-hint">
                                Поддерживаются только валидные JSON файлы
                            </p>
                        </div>
                    </div>
                </div>

                <div className="settings-section danger-zone">
                    <h2>Опасная зона</h2>

                    <div className="danger-actions">
                        <div className="danger-action">
                            <h4>Сброс настроек</h4>
                            <p>Вернуть все настройки к значениям по умолчанию</p>
                            <button onClick={resetToDefault} className="btn btn-warning">
                                🔄 Сбросить настройки
                            </button>
                        </div>

                        <div className="danger-action">
                            <h4>Удаление всех данных</h4>
                            <p>Удалить все технологии и заметки. Действие необратимо!</p>
                            {confirmDelete ? (
                                <div className="confirm-delete">
                                    <p>Вы уверены?</p>
                                    <button onClick={clearAllData} className="btn btn-danger">
                                        Да, удалить всё
                                    </button>
                                    <button
                                        onClick={() => setConfirmDelete(false)}
                                        className="btn btn-secondary"
                                    >
                                        Отмена
                                    </button>
                                </div>
                            ) : (
                                <button onClick={() => setConfirmDelete(true)} className="btn btn-danger">
                                    Удалить все данные
                                </button>
                            )}
                        </div>
                    </div>
                </div>

                <div className="settings-section">
                    <h2>Информация о приложении</h2>
                    <div className="app-info">
                        <div className="info-item">
                            <strong>Версия:</strong> 1.0.0
                        </div>
                        <div className="info-item">
                            <strong>Технологий в базе:</strong> {technologies.length}
                        </div>
                        <div className="info-item">
                            <strong>Размер данных:</strong> {JSON.stringify(technologies).length} байт
                        </div>
                        <div className="info-item">
                            <strong>Дата создания:</strong> 2025
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Settings;