import { useState } from "react";
import { useAuth } from "./Auth";
import { useNavigate } from "react-router";

export const CrearPaciente = () => {
  const { fetchAuth } = useAuth();
  const navigate = useNavigate();
  const [errores, setErrores] = useState()

  const [pacientes, setPacientes] = useState({
    id: "",
    nombre: "",
    apellido: "",
    dni: "",
    fechaNacimiento: "",
    obraSocial: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    setErrores(null)

    try {
      const response = await fetchAuth("http://localhost:3000/pacientes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(pacientes),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        if(response.status === 400) {
            return setErrores(data.errores)
        }
        return alert('Error al crear el paciente')
      }
    } catch (e) {
      alert(e.message || "Error creando paciente");
    }
    navigate("/pacientes");
  };

  return (
    <>
      <h2>Crear Paciente</h2>
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
              value={pacientes.nombre}
              onChange={(e) =>
                setPacientes({ ...pacientes, nombre: e.target.value })
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
              value={pacientes.apellido}
              onChange={(e) =>
                setPacientes({ ...pacientes, apellido: e.target.value })
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
            <label htmlFor="dni">DNI</label>
            <input
              type="number"
              required
              className="form-control ps-4"
              id="dni"
              placeholder="Dni"
              value={pacientes.dni}
              onChange={(e) =>
                setPacientes({ ...pacientes, dni: e.target.value })
              }
              aria-invalid={
                errores && errores.some((e) => e.path === 'dni')
              }
            />
            {errores && (
                <small style={{color: 'red'}}>
                    {errores
                  .filter((e) => e.path === "dni")
                  .map((e) => e.msg)
                  .join(", ")}
              </small>
            )}
          </div>
          <div className="form-group mb-3">
            <label htmlFor="born">Fecha de Nacimiento</label>
            <input
              type="date"
              required
              className="form-control ps-4"
              id="born"
              placeholder="Fecha de nacimiento"
              value={pacientes.fechaNacimiento}
              onChange={(e) =>
                setPacientes({ ...pacientes, fechaNacimiento: e.target.value })
              }
              aria-invalid={
                errores && errores.some((e) => e.path === 'fechaNacimiento')
              }
            />
            {errores && (
                <small style={{color: 'red'}}>
                    {errores
                  .filter((e) => e.path === "fechaNacimiento")
                  .map((e) => e.msg)
                  .join(", ")}
              </small>
            )}
          </div>
          <div className="form-group mb-3">
            <label htmlFor="obraSocial">Obra Social</label>
            <input
              type="text"
              required
              className="form-control ps-4"
              id="obraSocial"
              placeholder="obra social"
              value={pacientes.obraSocial}
              onChange={(e) =>
                setPacientes({ ...pacientes, obraSocial: e.target.value })
              }
              aria-invalid={
                errores && errores.some((e) => e.path === 'obraSocial')
              }
            />
            {errores && (
                <small style={{color: 'red'}}>
                    {errores
                  .filter((e) => e.path === "obraSocial")
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
