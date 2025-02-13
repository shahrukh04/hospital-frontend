import { StrictMode } from 'react'
import React from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
// PrimeReact styles

import 'primereact/resources/themes/lara-light-blue/theme.css';  // Choose your theme
import 'primereact/resources/primereact.min.css';                // Core PrimeReact styles
import 'primeicons/primeicons.css';                              // Icons
// import 'primeflex/primeflex.css';                                // Flex utility


createRoot(document.getElementById('root')).render(
  <React.StrictMode>

      <App />
  
  </React.StrictMode>
)
