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

    const exportData = () => {
        const data = {
            exportedAt: new Date().toISOString(),
            technologies,
            settings
        };

        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `tech-tracker-backup-${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    const importData = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (event) => {
            try {
                const data = JSON.parse(event.target.result);
                if (data.technologies) {
                    if (window.confirm('Заменить текущие данные импортированными?')) {
                        setTechnologies(data.technologies);
                        if (data.settings) {
                            setSettings(data.settings);
                        }
                        alert('Данные успешно импортированы!');
                    }
                } else {
                    alert('Файл не содержит корректных данных');
                }
            } catch (error) {
                alert('Ошибка при чтении файла');
            }
        };
        reader.readAsText(file);
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
                            <h4>Язык интерфейса</h4>
                            <p>Выберите предпочитаемый язык</p>
                        </div>
                        <div className="setting-control">
                            <select
                                value={settings.language}
                                onChange={(e) => handleSettingChange('language', e.target.value)}
                                className="setting-select"
                            >
                                <option value="ru">Русский</option>
                                <option value="en">English</option>
                            </select>
                        </div>
                    </div>

                    <div className="setting-item">
                        <div className="setting-info">
                            <h4>Уведомления</h4>
                            <p>Получать напоминания о задачах</p>
                        </div>
                        <div className="setting-control">
                            <label className="switch">
                                <input
                                    type="checkbox"
                                    checked={settings.notifications}
                                    onChange={(e) => handleSettingChange('notifications', e.target.checked)}
                                />
                                <span className="slider"></span>
                            </label>
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

                    <div className="data-actions">
                        <div className="data-action">
                            <h4>Экспорт данных</h4>
                            <p>Скачайте резервную копию всех данных</p>
                            <button onClick={exportData} className="btn btn-primary">
                                📥 Экспортировать
                            </button>
                        </div>

                        <div className="data-action">
                            <h4>Импорт данных</h4>
                            <p>Загрузите данные из файла</p>
                            <div>
                                <input
                                    type="file"
                                    accept=".json"
                                    onChange={importData}
                                    id="import-file"
                                    style={{ display: 'none' }}
                                />
                                <label htmlFor="import-file" className="btn btn-secondary">
                                    📤 Выбрать файл
                                </label>
                            </div>
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