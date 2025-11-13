import { useEffect, useState } from 'react'
import { useAuth } from './Auth'
import { Link } from 'react-router'

export function Turnos() {
  const { fetchAuth } = useAuth()

  const [turnos, setTurnos] = useState([])
  const [pacientes, setPacientes] = useState([])
  const [medicos, setMedicos] = useState([])
  const [loading, setLoading] = useState('')
  const [error, setError] = useState('')

  const [nuevoTurno, setNuevoTurno] = useState({
      pacienteId: "",
      medicoId: "",
      fecha: "",
      hora: "",
      estado: "",
      observaciones: ""
  });

  const fetchTurnos = async () => {
    
      const response = await fetchAuth('http://localhost:3000/turnos')
      const data = await response.json()

      if(!response.ok) {
        console.log("error: ", data.error)
        return
      }

      setTurnos(data.turnos)
  }

  const fetchPacientes = async () => {
    const response = await fetchAuth('http://localhost:3000/pacientes')
    const data = await response.json()

    if(!response.ok) {
      console.log("error: ", data.error)
      return
    }

    setPacientes(data.pacientes)
  }

    const fetchMedicos = async () => {
    const response = await fetchAuth('http://localhost:3000/medicos')
    const data = await response.json()

    if(!response.ok) {
      console.log("error: ", data.error)
      return
    }

    setMedicos(data.medicos)
  }

    useEffect(() => {

      fetchTurnos()
      fetchPacientes()
      fetchMedicos()
  }, [fetchAuth])

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const response = await fetchAuth('http://localhost:3000/turnos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(nuevoTurno)
      })

      const data = await response.json()
      if(!response.ok) {
        throw new Error(data.message || 'Error al asignar turno')
      }

      alert('Turno asignado con éxito')
      setNuevoTurno({ pacienteId: "", medicoId: "", fecha: "", hora: "", estado: "", observaciones: "" })
      await fetchTurnos()
    } catch (e) {
      alert(e.message || 'Error creando turno');
    }
  }

      const handleEliminar = async (id) => {
        if(window.confirm('¿Desea eliminar el turno?')) {
          const response = await fetchAuth(`http://localhost:3000/turnos/${id}`, 
            { method: 'DELETE' }
          )

          const data = await response.json()

          if(!response.ok || !data.success) {
            throw new Error('Error al quitar el turno')
          }

          await fetchTurnos()
        }
      }

  return (
    <>

        <div className='container py-5'>
        <h1>Nuevo Turno</h1>
          <form className="row g-3" onSubmit={handleSubmit}>
            <div className="col-md-6">
              <label className="form-label">Paciente</label>
              <select className="form-select" 
              value={nuevoTurno.pacienteId} 
              onChange={(e) => setNuevoTurno({...nuevoTurno, pacienteId: e.target.value})} >
                <option value="">Seleccione…</option>
                {pacientes.map(p => <option key={p.id} value={p.id}>{p.nombre} {p.apellido}</option>)}
              </select>
            </div>

            <div className="col-md-6">
              <label className="form-label">Profesional</label>
              <select className="form-select" 
              value={nuevoTurno.medicoId} 
              onChange={(e) => setNuevoTurno({ ...nuevoTurno, medicoId: e.target.value })}>
                <option value="">Seleccione…</option>
                {medicos.map(m => <option key={m.id} value={m.id}>{m.nombre} {m.apellido}</option>)}
              </select>
            </div>

            <div className="col-md-6">
              <label className="form-label">Fecha</label>
              <input type="date" className="form-control" 
              value={nuevoTurno.fecha} 
              onChange={(e) => setNuevoTurno({ ...nuevoTurno, fecha: e.target.value })}/>
            </div>

            <div className="col-md-6">
              <label className="form-label">Hora</label>
              <input type="time" className="form-control" 
              value={nuevoTurno.hora} 
              onChange={(e) => setNuevoTurno({ ...nuevoTurno, hora: e.target.value })}/>
            </div>

            <div className="col-md-6">
              <label className="form-label">Estado</label>
              <select className="form-select" 
              value={nuevoTurno.estado} 
              onChange={(e) => setNuevoTurno({ ...nuevoTurno, estado: e.target.value })}>
                <option value="">Seleccione…</option>
                <option value="pendiente">Pendiente</option>
                <option value="confirmado">Confirmado</option>
                <option value="cancelado">Cancelado</option>
              </select>
            </div>

            <div className="col-md-6">
              <label className="form-label">Observaciones</label>
              <input type="text" className="form-control" 
              value={nuevoTurno.observaciones} 
              onChange={(e) => setNuevoTurno({ ...nuevoTurno, observaciones: e.target.value })}/>
            </div>

            <div className="col-12">
              <button className="btn btn-primary" type="submit">Guardar</button>
            </div>
          </form>
        </div>

      <h2>Turnos</h2>
      <div className="card">
          <div className="card-body">
            {loading ? (
              'Cargando…'
            ) : (
              <div className="table-responsive">
                <table className="table table-hover">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Fecha</th>
                      <th>Hora</th>
                      <th>Paciente</th>
                      <th>Medico</th>
                      <th>Observaciones</th>
                      <th>Estado</th>
                      <th className='text-center'>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {turnos.map((t) => (
                      <tr key={t.id}>
                        <td>{t.id}</td>
                        <td>{t.fecha.slice(0,10)}</td>
                        <td>{t.hora}</td>
                        <td>{t.nombre_paciente}</td>
                        <td>{t.nombre_medico ?? ''}</td>
                        <td>{t.observaciones ?? ''}</td>
                        <td>{t.estado ?? ''}</td>
                        <td>
                          <div className="d-flex gap-3 justify-content-center">
                            <Link className="btn btn-info" to={`/usuarios/${t.id}`}>
                              Ver
                            </Link>
                              <Link className="btn btn-primary" to={`/usuarios/${t.id}/modificar`}>
                                Modificar
                              </Link>
                              <button className="btn btn-danger" onClick={() => handleEliminar(t.id)}>Quitar</button>
                          </div>
                        </td>
                      </tr>
                    ))}
                    {turnos.length === 0 && (
                      <tr>
                        <td colSpan="7" className="text-center text-muted">
                          Sin Turnos
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
    </>
  )
}
