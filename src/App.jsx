import './App.css';
import TechnologyCard from './components/TechnologyCard.jsx';
import ProgressHeader from './components/ProgressHeader.jsx';

function App() {
  const technologies = [
    {
      id: 1, title: 'React Components', description: 'Изучение базовых компонентов',
      status: 'completed'
    },
    {
      id: 2, title: 'JSX Syntax', description: 'Освоение синтаксиса JSX', status: 'in-progress'
    },
    {
      id: 3, title: 'State Management', description: 'Работа с состоянием компонентов', status: 'not - started'
    }
  ];

  return (
    <div className="App">
      <header className="App-header">
        <h1>Трекер изучения технологий</h1>
      </header>

      <ProgressHeader technologies={technologies} />

      <main className="App-main">
        <div className="stats-summary">
          <div className="stat-item">
            <span className="stat-number">{technologies.length}</span>
            <span className="stat-label">Всего технологий</span>
          </div>
          <div className="stat-item">
            <span className="stat-number">
              {technologies.filter(tech => tech.status === 'completed').length}
            </span>
            <span className="stat-label">Изучено</span>
          </div>
          <div className="stat-item">
            <span className="stat-number">
              {technologies.filter(tech => tech.status === 'in-progress').length}
            </span>
            <span className="stat-label">В процессе</span>
          </div>
        </div>

        <h2>Дорожная карта изучения</h2>

        <div className="technology-list">
          {technologies.map((tech) => (
            <TechnologyCard
              key={tech.id}
              title={tech.title}
              description={tech.description}
              status={tech.status}
            />
          ))}
        </div>
      </main>
    </div>
  );
}

export default App;