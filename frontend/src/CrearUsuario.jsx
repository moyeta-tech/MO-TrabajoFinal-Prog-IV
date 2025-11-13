import { useState } from "react";
import { useAuth } from "./Auth";
import { useNavigate } from "react-router";

export const CrearUsuario = () => {
  const { fetchRegistrarse } = useAuth();
  const navigate = useNavigate();
  const [errores, setErrores] = useState()

  const [usuarios, setUsuarios] = useState({
    id: "",
    nombre: "",
    email: "",
    contraseña: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    setErrores(null)

    try {
      const response = await fetchRegistrarse("http://localhost:3000/usuarios", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(usuarios),
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
    navigate("/");
  };

  return (
    <>
      <h2 style={{textAlign: 'center'}}>Crear Usuario</h2>
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
              value={usuarios.nombre}
              onChange={(e) =>
                setUsuarios({ ...usuarios, nombre: e.target.value })
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
            <label htmlFor="email">Email</label>
            <input
              type="email"
              required
              className="form-control ps-4"
              id="email"
              placeholder="Email"
              value={usuarios.email}
              onChange={(e) =>
                setUsuarios({ ...usuarios, email: e.target.value })
              }
              aria-invalid={
                errores && errores.some((e) => e.path === 'email')
              }
            />
            {errores && (
                <small style={{color: 'red'}}>
                    {errores
                  .filter((e) => e.path === "email")
                  .map((e) => e.msg)
                  .join(", ")}
              </small>
            )}
          </div>
          <div className="form-group mb-3">
            <label htmlFor="contraseña">Contraseña</label>
            <input
              type="password"
              required
              className="form-control ps-4"
              id="contraseña"
              placeholder="Contraseña"
              value={usuarios.contraseña}
              onChange={(e) =>
                setUsuarios({ ...usuarios, contraseña: e.target.value })
              }
              aria-invalid={
                errores && errores.some((e) => e.path === 'contraseña')
              }
            />
            {errores && (
                <small style={{color: 'red'}}>
                    {errores
                  .filter((e) => e.path === "contraseña")
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
