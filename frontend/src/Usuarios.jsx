import { useEffect, useState } from "react"
import { useAuth } from "./Auth"


export const Usuarios = () => {
    const { fetchAuth } = useAuth()

    const [usuarios, setUsuarios] = useState([])

    useEffect(() => {
        const fetchUsuarios = async () => {
            const response = await fetchAuth('http://localhost:3000/usuarios')

            const data = await response.json()

            if(!response.ok) {
                console.log('Error obteniendo los usuarios: ', data.usuarios)
                return
            }

            return data.usuarios
        }

        fetchUsuarios().then((usuarios) => setUsuarios(usuarios))
    }, [fetchAuth])




    return (
    <article>
      <h2>Usuarios</h2>
        {/* <Link role="button" to="/usuarios/crear">
          Nuevo usuario
        </Link> */}
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Username</th>
            <th>Email</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {usuarios.map((u) => (
            <tr key={u.id}>
              <td>{u.id}</td>
              <td>{u.nombre}</td>
              <td>{u.email}</td>
              <td>
                <div>
                  {/* <Link role="button" to={`/usuarios/${u.id}`}>
                    Ver
                  </Link>
                    <Link role="button" to={`/usuarios/${u.id}/modificar`}>
                      Modificar
                    </Link> */}
                    {/* <button onClick={() => handleQuitar(u.id)}>Quitar</button> */}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </article>
    )
}