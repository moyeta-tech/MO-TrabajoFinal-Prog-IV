import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { Layout } from './Layout.jsx'
import App from './App.jsx'
import { Header } from './Header.jsx'
import { AuthPage, AuthProvider } from './Auth.jsx'
import { BrowserRouter, Route, Routes } from 'react-router'
import { Usuarios } from './Usuarios.jsx'
import { Pacientes } from './Pacientes.jsx'
import { Medicos } from './Medicos.jsx'
import { Turnos } from './Turnos.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={ <AuthPage> <Header /> <Layout /> </AuthPage>}>
            <Route index element={<AuthPage> <App /> </AuthPage>} />
            <Route path='usuarios' element={<AuthPage> <Usuarios /> </AuthPage>} />
            <Route path='pacientes' element={<AuthPage> <Pacientes /> </AuthPage>} />
            <Route path='medicos' element={<AuthPage> <Medicos /> </AuthPage>} />
            <Route path='turnos' element={<AuthPage> <Turnos /> </AuthPage>} />
            
          </Route>
        </Routes>
      </BrowserRouter>
      
    </AuthProvider>
  </StrictMode>,
)
