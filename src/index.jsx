import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.jsx'

// createRoot(document.getElementById('root')).render(
//   <StrictMode>
//     <BrowserRouter basename="/technology-tracker3"></BrowserRouter>
//       <App />
//     </BrowserRouter>
//   </StrictMode>
// )

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter basename="/technology-tracker3"> {/* Добавьте BrowserRouter с basename */}
      <App />
    </BrowserRouter>
  </StrictMode>
)