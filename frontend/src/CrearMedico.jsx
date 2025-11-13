import { useState } from "react";
import { useAuth } from "./Auth";
import { useNavigate } from "react-router";

export const CrearMedico = () => {
  const { fetchAuth } = useAuth();
  const navigate = useNavigate();
  const [errores, setErrores] = useState()

  const [medicos, setMedicos] = useState({
    id: "",
    nombre: "",
    apellido: "",
    especialidad: "",
    matricula: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    setErrores(null)

    try {
      const response = await fetchAuth("http://localhost:3000/medicos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(medicos),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        if(response.status === 400) {
            return setErrores(data.errores)
        }
        return alert('Error al crear el medico')
      }
    } catch (e) {
      alert(e.message || "Error creando medico");
    }
    navigate("/medicos");
  };

  return (
    <>
      <h2>Crear Medicos</h2>
      <form className="container card w-50" onSubmit={handleSubmit}>
        <div className="card-body">
          <div className="form-group mb-3">
            <label htmlFor="nombre">Nombre</label>
            <input
              type="text"
              required
              className="form-control ps-4"
              id="nombre"
              placeholder="nombre"
              value={medicos.nombre}
              onChange={(e) =>
                setMedicos({ ...medicos, nombre: e.target.value })
              }
              aria-invalid={
                errores && errores.some((e) => e.path === 'nombre')
              }
            />
            {errores && (
                <small style={{color: 'red'}}>
                    {errores
                  .filter((e) => e.path === "nombre")
                  .map((e) => e.msg)
                  .join(", ")}
              </small>
            )}
          </div>
          <div className="form-group mb-3">
            <label htmlFor="apellido">Apellido</label>
            <input
              type="text"
              required
              className="form-control ps-4"
              id="apellido"
              placeholder="apellido"
              value={medicos.apellido}
              onChange={(e) =>
                setMedicos({ ...medicos, apellido: e.target.value })
              }
              aria-invalid={
                errores && errores.some((e) => e.path === 'apellido')
              }
            />
            {errores && (
                <small style={{color: 'red'}}>
                    {errores
                  .filter((e) => e.path === "apellido")
                  .map((e) => e.msg)
                  .join(", ")}
              </small>
            )}
          </div>
          <div className="form-group mb-3">
            <label htmlFor="especialidad">Especialidad</label>
            <input
              type="text"
              required
              className="form-control ps-4"
              id="especialidad"
              placeholder="especialidad"
              value={medicos.especialidad}
              onChange={(e) =>
                setMedicos({ ...medicos, especialidad: e.target.value })
              }
              aria-invalid={
                errores && errores.some((e) => e.path === 'especialidad')
              }
            />
            {errores && (
                <small style={{color: 'red'}}>
                    {errores
                  .filter((e) => e.path === "especialidad")
                  .map((e) => e.msg)
                  .join(", ")}
              </small>
            )}
          </div>
          <div className="form-group mb-3">
            <label htmlFor="matricula">N° Matricula</label>
            <input
              type="number"
              required
              className="form-control ps-4"
              id="matricula"
              placeholder="Fecha de nacimiento"
              value={medicos.matricula}
              onChange={(e) =>
                setMedicos({ ...medicos, matricula: e.target.value })
              }
              aria-invalid={
                errores && errores.some((e) => e.path === 'matricula')
              }
            />
            {errores && (
                <small style={{color: 'red'}}>
                    {errores
                  .filter((e) => e.path === "matricula")
                  .map((e) => e.msg)
                  .join(", ")}
              </small>
            )}
          </div>
          <div className="col-12">
            <button className="btn btn-primary" type="submit">
              Crear
            </button>
          </div>
        </div>
      </form>
    </>
  );
};
