import { Navigate, useLocation } from 'react-router-dom';
import { useState } from 'react';

function ProtectedRoute({ children }) {
  const location = useLocation();
  
  // ФИКТИВНАЯ проверка авторизации - всегда разрешаем доступ
  // Но демонстрируем механизм защиты маршрутов
  const [isAuthenticated] = useState(true); // Всегда true для демонстрации
  
  // Для демонстрации можно временно установить false
  // const [isAuthenticated] = useState(false);
  
  if (!isAuthenticated) {
    // Показываем сообщение о необходимости "авторизации" (для демо)
    return (
      <div className="page">
        <div className="protected-route-message">
          <h2>🔐 Требуется авторизация</h2>
          <p>Эта страница защищена. Для демонстрации механизма защиты маршрутов.</p>
          <p className="demo-hint">
            <small>
              ⚠️ Это учебный пример. В реальном приложении здесь была бы проверка прав доступа.
            </small>
          </p>
          <button 
            onClick={() => window.location.reload()} 
            className="btn btn-primary"
          >
            Обновить страницу для "доступа"
          </button>
        </div>
      </div>
    );
  }
  
  return children;
}

export default ProtectedRoute;