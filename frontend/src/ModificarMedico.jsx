import { useParams, useNavigate } from "react-router";
import { useEffect, useState } from "react";
import { useAuth } from "./Auth"; // si usás fetchAuth

export const ModificarMedico = () => {
  const { id } = useParams();
  const { fetchAuth } = useAuth();
  const navigate = useNavigate()

  const [medico, setMedico] = useState(null);

    const fetchMedico = async () => {
        const resp = await fetchAuth(`http://localhost:3000/medicos/${id}`);
        const data = await resp.json();
        if (!resp.ok) {
            console.log('Error obteniendo al medico: ', data.error)
            return
        }

        console.log("Respuesta del backend:", data.medico);

        setMedico(data.medico)
    };

  useEffect(() => {
    fetchMedico();
  }, [fetchAuth]);


const handleSubmit = async (e) => {
    e.preventDefault();

    const body = {
        ...medico,
        matricula: medico.matricula_profesional
    }

    const resp = await fetchAuth(`http://localhost:3000/medicos/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const data = await resp.json();
    if (!resp.ok || !data.success) {
        return alert('Error al modificar el medico: ', data.error)
    }
  
    navigate('/medicos')
};

      if (!medico) {
    return <p className="text-center mt-5">Cargando datos del medico...</p>;
  }

  return (
    <div className="container mt-4">
      <h2>Editar Medico </h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          className="form-control mb-2"
          value={medico.nombre}
          onChange={(e) =>
            setMedico({ ...medico, nombre: e.target.value })
          }
        />
        <input
          type="text"
          className="form-control mb-2"
          value={medico.apellido}
          onChange={(e) =>
            setMedico({ ...medico, apellido: e.target.value })
          }
        />
        <input
          type="text"
          className="form-control mb-2"
          value={medico.especialidad}
          onChange={(e) =>
            setMedico({ ...medico, especialidad: e.target.value })
          }
        />
        <input
          type="number"
          className="form-control mb-2"
          value={medico.matricula_profesional}
          onChange={(e) =>
            setMedico({ ...medico, matricula_profesional: e.target.value })
          }
        />
        <button className="btn btn-primary" type="submit">
          Guardar cambios
        </button>
      </form>
    </div>
  );
};
