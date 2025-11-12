import { useEffect, useState } from "react"
import { useAuth } from "./Auth"
import { Link } from "react-router"


export const Usuarios = () => {
    const { fetchAuth } = useAuth()

    const [usuarios, setUsuarios] = useState([])

    const fetchUsuarios = async () => {
        const response = await fetchAuth('http://localhost:3000/usuarios')

        const data = await response.json()

        if(!response.ok) {
            console.log('Error obteniendo los usuarios: ', data.error)
            return
        }

        setUsuarios(data.usuarios)
    }
     

    useEffect(() => {
        fetchUsuarios()
    }, [fetchAuth])


      const handleEliminar = async (id) => {
        if(window.confirm('¿Desea eliminar al usuario?')) {
          const response = await fetchAuth(`http://localhost:3000/usuarios/${id}`, 
            { method: 'DELETE' }
          )

          const data = await response.json()

          if(!response.ok || !data.success) {
            throw new Error('Error al quitar al usuario')
          }

          await fetchUsuarios()
        }
      }




    return (
      <>
        <h2 className="mb-2" >Usuarios</h2>
          <article className="card">
            <div className="card-body">
                {/* <Link role="button" to="/usuarios/crear">
                  Nuevo usuario
                  </Link> */}
              <table className="table table-responsive table-striped">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Username</th>
                    <th>Email</th>
                    <th className="text-center">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {usuarios.map((u) => (
                    <tr key={u.id}>
                      <td>{u.id}</td>
                      <td>{u.nombre}</td>
                      <td>{u.email}</td>
                      <td>
                        <div className="d-flex gap-3 justify-content-center">
                          <Link className="btn btn-info" to={`/usuarios/${u.id}`}>
                            Ver
                          </Link>
                            <Link className="btn btn-primary" to={`/usuarios/${u.id}/modificar`}>
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