import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'
import { BrowserRouter } from 'react-router-dom'
import { PersistGate } from 'redux-persist/integration/react'
import App from './App.tsx'
import { AdminAuthProvider } from './context/AdminAuthContext.tsx'
import { AdminProvider } from './context/AdminContext.tsx'
import { AuthProvider } from './context/AuthContext.tsx'
import { persistor, store } from './store'
import './index.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <BrowserRouter>
          <AuthProvider>
            <AdminAuthProvider>
              <AdminProvider>
                <App />
              </AdminProvider>
            </AdminAuthProvider>
          </AuthProvider>
        </BrowserRouter>
      </PersistGate>
    </Provider>
  </StrictMode>,
)
