import { useParams, useNavigate } from "react-router";
import { useEffect, useState } from "react";
import { useAuth } from "./Auth"; // si usás fetchAuth

export const ModificarUsuario = () => {
  const { id } = useParams();
  const { fetchAuth } = useAuth();
  const navigate = useNavigate()

  const [usuario, setUsuario] = useState(null);

    const fetchUsuario = async () => {
        const resp = await fetchAuth(`http://localhost:3000/usuarios/${id}`);
        const data = await resp.json();
        if (!resp.ok) {
            console.log('Error obteniendo al usuario: ', data.error)
            return
        }


        setUsuario(data.usuario)
    };

  useEffect(() => {
    fetchUsuario();
  }, [fetchAuth]);


const handleSubmit = async (e) => {
    e.preventDefault();

    const resp = await fetchAuth(`http://localhost:3000/usuarios/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(usuario),
    });
    const data = await resp.json();
    if (!resp.ok || !data.success) {
        return alert('Error al modificar el usuario: ', data.error)
    }
  
    navigate('/usuarios')
};

      if (!usuario) {
    return <p className="text-center mt-5">Cargando datos del usuario...</p>;
  }

  return (
    <div className="container mt-4">
      <h2>Editar Usuario </h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          className="form-control mb-2"
          value={usuario.nombre}
          onChange={(e) =>
            setUsuario({ ...usuario, nombre: e.target.value })
          }
        />
        <input
          type="email"
          className="form-control mb-2"
          value={usuario.email}
          onChange={(e) =>
            setUsuario({ ...usuario, email: e.target.value })
          }
        />
        <button className="btn btn-primary" type="submit">
          Guardar cambios
        </button>
      </form>
    </div>
  );
};
