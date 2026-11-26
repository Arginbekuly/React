import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import {HashRouter} from "react-router-dom";
import './index.css'
import App from './App.jsx'
import { AuthProvider } from './context/AuthContext'
import { Provider } from 'react-redux'
import { store } from './app/store.js'




createRoot(document.getElementById('root')).render(
  <StrictMode>
    <HashRouter>
        <Provider store={store}>
            <AuthProvider>
                <App />
            </AuthProvider>
        </Provider>
    </HashRouter>
  </StrictMode>,
)
