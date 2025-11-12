import { useEffect, useState } from "react"
import { useAuth } from "./Auth"
import { Link } from "react-router"


export const Medicos = () => {
    const { fetchAuth } = useAuth()

    const [medicos, setMedicos] = useState([])

    const fetchMedicos = async () => {
        const response = await fetchAuth('http://localhost:3000/medicos')

        const data = await response.json()

        if(!response.ok) {
            console.log('Error obteniendo los medicos: ', data.error)
            return
        }

        setMedicos(data.medicos)
    }
     

    useEffect(() => {
        fetchMedicos()
    }, [fetchAuth])


      const handleEliminar = async (id) => {
        if(window.confirm('¿Desea eliminar al medico?')) {
          const response = await fetchAuth(`http://localhost:3000/medicos/${id}`, 
            { method: 'DELETE' }
          )

          const data = await response.json()

          if(!response.ok || !data.success) {
            throw new Error('Error al quitar al medico')
          }

          await fetchMedicos()
        }
      }




    return (
        <>
            <h2 className="mb-2" >Medicos</h2> 
                    <Link className="mb-4 btn btn-success" to={'/medicos/crear'} >
                        Crear Medico
                    </Link>
            <article className="card">
                <div className="card-body">
                    <table className="table table-striped">
                        <thead>
                        <tr>
                            <th>ID</th>
                            <th>Nombre</th>
                            <th>Apellido</th>
                            <th>Especialidad</th>
                            <th>N° Matricula</th>
                            <th className="text-center">Acciones</th>
                        </tr>
                        </thead>
                        <tbody>
                        {medicos.map((u) => (
                            <tr key={u.id}>
                            <td>{u.id}</td>
                            <td>{u.nombre}</td>
                            <td>{u.apellido}</td>
                            <td>{u.especialidad}</td>
                            <td>{u.matricula_profesional}</td>
                            <td>
                                <div className="d-flex gap-3 justify-content-center">
                                <Link className="btn btn-info" to={`/medicos/${u.id}`}>
                                    Ver
                                </Link>
                                    <Link className="btn btn-primary" to={`/medicos/${u.id}/modificar`}>
                                    Modificar
                                    </Link>
                                    <button className="btn btn-danger" onClick={() => handleEliminar(u.id)}>Quitar</button>
                                </div>
                            </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            </article>
        </>
    )
}