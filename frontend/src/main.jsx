import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { Layout } from './Layout.jsx'
import App from './App.jsx'
import { Header } from './Header.jsx'
import { AuthPage, AuthProvider } from './Auth.jsx'
import { BrowserRouter, Route, Routes } from 'react-router'
import { Usuarios } from './Usuarios.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={ <AuthPage> <Header /> <Layout /> </AuthPage>}>
            <Route index element={<AuthPage> <App /> </AuthPage>} />
            <Route path='usuarios' element={<AuthPage> <Usuarios /> </AuthPage>} />
            
          </Route>
        </Routes>
      </BrowserRouter>
      
    </AuthProvider>
  </StrictMode>,
)
