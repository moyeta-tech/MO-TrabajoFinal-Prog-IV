import { useState } from "react";
import { useAuth } from "./Auth";
import { Link } from "react-router";
import './index.css'

export const Login = () => {
    const { error, login } = useAuth()

    const [open, setOpen] = useState(false)
    const [usuario, setUsuario] = useState("")
    const [contraseña, setContraseña] = useState("")


    const handleSubmit = async (e) => {
        e.preventDefault()
        login(usuario, contraseña)

    }



    return (
        <>
            <Link className="btn btn-success" to={'/usuarios/crear'} >Registrarse</Link>
            <button className="btn btn-primary" onClick={() => setOpen(true)}>Ingresar</button>
            <dialog open={open} className={open ? 'card' : ''}>
                <article>
                    <h2>Ingrese usuario y contraseña</h2>
                        <form onSubmit={handleSubmit}>
                            <fieldset>
                            <label htmlFor="usuario">Usuario:</label>
                            <input
                                className="form-control mb-3 shadow-sm"
                                name="usuario"
                                value={usuario}
                                onChange={(e) => setUsuario(e.target.value)}
                                required
                            />
                            <label htmlFor="contraseña">Contraseña:</label>
                            <input
                                className="form-control mb-3 shadow-sm"
                                name="contraseña"
                                type="password"
                                value={contraseña}
                                onChange={(e) => setContraseña(e.target.value)}
                                required
                            />
                            {error && <p style={{ color: "red" }}>{error}</p>}
                            </fieldset>
                            <footer>
                            <div className="grid d-flex justify-content-between">
                                <input
                                type="button"
                                className="secondary btn btn-danger"
                                value="Cancelar"
                                onClick={() => setOpen(false)}
                                />
                                <input className="btn btn-primary" type="submit" value="Ingresar" />
                            </div>
                            </footer>
                        </form>
                </article>
            </dialog>
        </>
    )
}