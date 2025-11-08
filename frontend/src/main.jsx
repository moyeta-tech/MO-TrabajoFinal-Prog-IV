import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { Layout } from './Layout.jsx'
import App from './App.jsx'
import { Header } from './Header.jsx'
import { AuthPage, AuthProvider } from './Auth.jsx'
import { BrowserRouter, Route, Routes } from 'react-router'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={ <AuthPage> <Header /> <Layout /> </AuthPage>}>
            <Route index element={<AuthPage> <App /> </AuthPage>} />
            
          </Route>
        </Routes>
      </BrowserRouter>
      
    </AuthProvider>
  </StrictMode>,
)
