import { useEffect, useState } from "react"
import { useAuth } from "./Auth"
import { Link } from "react-router"


export const Pacientes = () => {
    const { fetchAuth } = useAuth()

    const [pacientes, setPacientes] = useState([])

    const fetchPacientes = async () => {
        const response = await fetchAuth('http://localhost:3000/pacientes')

        const data = await response.json()

        if(!response.ok) {
            console.log('Error obteniendo los pacientes: ', data.error)
            return
        }

        setPacientes(data.pacientes)
    }
     

    useEffect(() => {
        fetchPacientes()
    }, [fetchAuth])


      const handleEliminar = async (id) => {
        if(window.confirm('¿Desea eliminar al usuario?')) {
          const response = await fetchAuth(`http://localhost:3000/pacientes/${id}`, 
            { method: 'DELETE' }
          )

          const data = await response.json()

          if(!response.ok || !data.success) {
            throw new Error('Error al quitar al usuario')
          }

          await fetchPacientes()
        }
      }




    return (
        <>
            <h2 className="mb-2" >Pacientes</h2> 
            <Link className="mb-4 btn btn-success" to={'/pacientes/crear'} >
                Crear paciente
            </Link>
            <article className="card">
                <div className="card-body">

                    <table className="table table-striped">
                        <thead>
                        <tr>
                            <th>ID</th>
                            <th>Nombre</th>
                            <th>Apellido</th>
                            <th>DNI</th>
                            <th>Fecha de Nacimiento</th>
                            <th>Obra Social</th>
                            <th className="text-center">Acciones</th>
                        </tr>
                        </thead>
                        <tbody>
                        {pacientes.map((u) => (
                            <tr key={u.id}>
                            <td>{u.id}</td>
                            <td>{u.nombre}</td>
                            <td>{u.apellido}</td>
                            <td>{u.dni}</td>
                            <td>{u.fecha_nacimiento.slice(0, 10)}</td>
                            <td>{u.obra_social}</td>
                            <td>
                                <div className="d-flex gap-3 justify-content-center">
                                <Link className="btn btn-info" to={`/pacientes/${u.id}`}>
                                    Ver
                                </Link>
                                    <Link className="btn btn-primary" to={`/pacientes/${u.id}/modificar`}>
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