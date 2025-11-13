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
import { CrearPaciente } from './CrearPaciente.jsx'
import { CrearMedico } from './CrearMedico.jsx'
import { CrearUsuario } from './CrearUsuario.jsx'
import { ModificarPaciente } from './ModificarPaciente.jsx'
import { ModificarMedico } from './ModificarMedico.jsx'
import { ModificarTurno } from './ModificarTurno.jsx'

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
            <Route path='pacientes/crear' element={<AuthPage> <CrearPaciente /> </AuthPage>} />
            <Route path='medicos/crear' element={<AuthPage> <CrearMedico /> </AuthPage>} />
            <Route path='pacientes/:id/modificar' element={<AuthPage> <ModificarPaciente /> </AuthPage>} />
            <Route path='medicos/:id/modificar' element={<AuthPage> <ModificarMedico /> </AuthPage>} />
            <Route path='turnos/pacientes/:paciente_id/medicos/:medico_id/modificar' element={<AuthPage> <ModificarTurno /> </AuthPage>} />

          </Route>
            <Route path='usuarios/crear' element={<> <Header /> <CrearUsuario /> </> } />
        </Routes>
      </BrowserRouter>
      
    </AuthProvider>
  </StrictMode>,
)
