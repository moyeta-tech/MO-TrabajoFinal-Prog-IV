import { useParams, useNavigate } from "react-router";
import { useEffect, useState } from "react";
import { useAuth } from "./Auth"; // si usás fetchAuth

export const ModificarPaciente = () => {
  const { id } = useParams();
  const { fetchAuth } = useAuth();
  const navigate = useNavigate()

  const [paciente, setPaciente] = useState(null);

    const fetchPaciente = async () => {
        const resp = await fetchAuth(`http://localhost:3000/pacientes/${id}`);
        const data = await resp.json();
        if (!resp.ok) {
            console.log('Error obteniendo al paciente: ', data.error)
            return
        }

        // console.log("Respuesta del backend:", data.paciente);

        setPaciente(data.paciente)
    };

  useEffect(() => {
    fetchPaciente();
  }, [fetchAuth]);


const handleSubmit = async (e) => {
    e.preventDefault();

      const body = {
        ...paciente,
        fechaNacimiento: paciente.fechaNacimiento
        ? paciente.fechaNacimiento.split('T')[0] // Deja pasar la hora que enviamos en el put para que no de error con express-validator
        : null
    };

    const resp = await fetchAuth(`http://localhost:3000/pacientes/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const data = await resp.json();
    if (!resp.ok || !data.success) {
        return alert('Error al modificar el paciente: ', data.error)
    }
  
    navigate('/pacientes')
};

      if (!paciente) {
    return <p className="text-center mt-5">Cargando datos del paciente...</p>;
  }

  return (
    <div className="container mt-4">
      <h2>Editar Paciente </h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          className="form-control mb-2"
          value={paciente.nombre}
          onChange={(e) =>
            setPaciente({ ...paciente, nombre: e.target.value })
          }
        />
        <input
          type="text"
          className="form-control mb-2"
          value={paciente.apellido}
          onChange={(e) =>
            setPaciente({ ...paciente, apellido: e.target.value })
          }
        />
        <input
          type="number"
          className="form-control mb-2"
          value={paciente.dni}
          onChange={(e) =>
            setPaciente({ ...paciente, dni: e.target.value })
          }
        />
        <input
          type="date"
          className="form-control mb-2"
          value={paciente.fechaNacimiento ?
            new Date(paciente.fechaNacimiento).toISOString().split('T')[0] 
            : ""
          }
          onChange={(e) =>
            setPaciente({ ...paciente, fechaNacimiento: e.target.value })
          }
        />
        <input
          type="text"
          className="form-control mb-2"
          value={paciente.obraSocial}
          onChange={(e) =>
            setPaciente({ ...paciente, obraSocial: e.target.value })
          }
        />
        <button className="btn btn-primary" type="submit">
          Guardar cambios
        </button>
      </form>
    </div>
  );
};
