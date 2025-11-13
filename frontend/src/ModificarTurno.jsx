import { useParams, useNavigate } from "react-router";
import { useEffect, useState } from "react";
import { useAuth } from "./Auth"; // si usás fetchAuth

export const ModificarTurno = () => {
  const { paciente_id, medico_id } = useParams();
  const { fetchAuth } = useAuth();
  const navigate = useNavigate()

  const [turno, setTurno] = useState(null);

    const fetchTurno = async () => {
        const resp = await fetchAuth(`http://localhost:3000/turnos/medicos/${medico_id}/pacientes/${paciente_id}`);
        const data = await resp.json();
        if (!resp.ok) {
            console.log('Error obteniendo el turno: ', data.error)
            return
        }

        console.log("Respuesta del backend:", data.turno);

        setTurno(data.turno)
    };

  useEffect(() => {
    fetchTurno();
  }, [fetchAuth]);


const handleSubmit = async (e) => {
    e.preventDefault();

  const body = {
    fecha: turno.fecha.split("T")[0],
    hora: turno.hora,
    estado: turno.estado.trim()
  };

    const resp = await fetchAuth(`http://localhost:3000/turnos/pacientes/${paciente_id}/medicos/${medico_id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(turno),
    });
    const data = await resp.json();
    if (!resp.ok || !data.success) {
        return alert('Error al modificar el turno: ', data.error)
    }
  
    navigate('/turnos')
};

      if (!turno) {
    return <p className="text-center mt-5">Cargando datos del turno...</p>;
  }

  return (
    <div className="container mt-4">
      <h2>Editar Turno </h2>
      <form onSubmit={handleSubmit}>
        {/* <input
          type="text"
          className="form-control mb-2"
          value={turno.nombre_paciente}
          onChange={(e) =>
            setTurno({ ...turno, nombre_paciente: e.target.value })
          }
        /> */}
        <p>Paciente: {turno.nombre_paciente}</p>
        {/* <input
          type="text"
          className="form-control mb-2"
          value={turno.nombre_medico}
          onChange={(e) =>
            setTurno({ ...turno, nombre_medico: e.target.value })
          }
        /> */}
        <p>Paciente: {turno.nombre_medico}</p>
        <p>Observaciones: {turno.observaciones  }</p>
        <input
          type="date"
          className="form-control mb-2"
          value={turno.fecha ? new Date(turno.fecha).toISOString().split('T')[0] : ''}
          onChange={(e) =>
            setTurno({ ...turno, fecha: e.target.value })
          }
        />
        <input
          type="time"
          className="form-control mb-2"
          value={turno.hora}
          onChange={(e) =>
            setTurno({ ...turno, hora: e.target.value })
          }
        />
        <input
          type="text"
          className="form-control mb-2"
          value={turno.estado}
          onChange={(e) =>
            setTurno({ ...turno, estado: e.target.value })
          }
        />
        {/* <input
          type="text"
          className="form-control mb-2"
          value={turno.observaciones}
          onChange={(e) =>
            setTurno({ ...turno, observaciones: e.target.value })
          }
        /> */}
        <button className="btn btn-primary" type="submit">
          Guardar cambios
        </button>
      </form>
    </div>
  );
};
