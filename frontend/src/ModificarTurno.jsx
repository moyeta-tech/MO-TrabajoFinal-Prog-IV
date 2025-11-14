import { useParams, useNavigate } from "react-router";
import { useEffect, useState } from "react";
import { useAuth } from "./Auth"; // si usás fetchAuth

export const ModificarTurno = () => {
  const { id } = useParams();
  const { fetchAuth } = useAuth();
  const navigate = useNavigate()

  const [turno, setTurno] = useState(null);
  const [errores, setErrores] = useState(null)

    const fetchTurno = async () => {
        const resp = await fetchAuth(`http://localhost:3000/turnos/${id}`);
        const data = await resp.json();
        if (!resp.ok) {
            console.log('Error obteniendo el turno: ', data.message)
            return
        }


        setTurno(data.turno)
    };

  useEffect(() => {
    fetchTurno();
  }, [fetchAuth, id]);


const handleSubmit = async (e) => {
    e.preventDefault();

  const body = {
    fecha: turno.fecha.split("T")[0],
    hora: turno.hora,
    estado: turno.estado.trim()
  };

    const resp = await fetchAuth(`http://localhost:3000/turnos/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const data = await resp.json();
    if (!resp.ok || !data.success) {
        setErrores(data.message)
        return

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
        {errores && ( <p style={{color: 'red'}}>{errores}</p> )}
        <select className="form-select mb-2" 
          value={turno.estado}
          onChange={(e) => 
            setTurno({ ...turno, estado: e.target.value })
          }
          >
            <option value="">Seleccione...</option>
            <option value="pendiente">Pendiente</option>
            <option value="confirmado">Confirmado</option>
            <option value="cancelado">Cancelado</option>
        </select>
        
        <button className="btn btn-primary" type="submit">
          Guardar cambios
        </button>
      </form>
    </div>
  );
};
