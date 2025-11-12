import { useEffect, useState } from 'react'
import { useAuth } from './Auth'
import { Link } from 'react-router'

export function Turnos({ onCreated }) {
  const { fetchAuth } = useAuth()

  const [turnos, setTurnos] = useState([])
  const [pacientes, setPacientes] = useState([])
  const [profesionales, setProfesionales] = useState([])
  const [loading, setLoading] = useState('')
  const [error, setError] = useState('')

  const fetchTurnos = async () => {
    
      const response = await fetchAuth('http://localhost:3000/turnos')
      const data = await response.json()

      if(!response.ok) {
        console.log("error: ", data.error)
        return
      }

      setTurnos(data.turnos)
  }

    useEffect(() => {

      fetchTurnos()
  }, [fetchAuth])

  const onSubmit = async (data) => {
    const turno = {
      paciente_id: parseInt(data.paciente_id),
      profesional_id: parseInt(data.profesional_id),
      fecha: data.fecha,
      hora: data.hora,
    }

    try {
      await api.post('/turnos', turno);
      reset();
      onCreated?.();
    } catch (e) {
      alert(e?.response?.data?.detail || 'Error creando turno');
    }
  }

  const onDelete = async (id) => {
    if(!confirm('¿Deseas eliminar este turno?')) return
    setLoading(true)
    try {
      await api.delete(`/turnos/${id}`)
      await cargar()

    } catch(e) {
      console.error('Error eliminando el turno: ', e.response?.data || e.message)
      setError('No se pudo eliminar el turno')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>

        {/* <div className='container py-5'>
        <h1>Nuevo Turno</h1>
          <form className="row g-3" onSubmit={handleSubmit(onSubmit)}>
            <div className="col-md-6">
              <label className="form-label">Paciente</label>
              <select className="form-select" {...register('paciente_id', { required: true })}>
                <option value="">Seleccione…</option>
                {pacientes.map(p => <option key={p.id} value={p.id}>{p.nombre} {p.apellido}</option>)}
              </select>
            </div>

            <div className="col-md-6">
              <label className="form-label">Profesional</label>
              <select className="form-select" {...register('profesional_id', { required: true })}>
                <option value="">Seleccione…</option>
                {profesionales.map(p => <option key={p.id} value={p.id}>{p.nombre} {p.apellido}</option>)}
              </select>
            </div>

            <div className="col-md-6">
              <label className="form-label">Fecha</label>
              <input type="date" className="form-control" {...register('fecha', { required: true })}/>
            </div>

            <div className="col-md-6">
              <label className="form-label">Hora</label>
              <input type="time" className="form-control" {...register('hora', { required: true })}/>
            </div>

            <div className="col-12">
              <button className="btn btn-primary" type="submit">Guardar</button>
            </div>
          </form>
        </div> */}

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
