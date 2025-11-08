import { useState } from "react";
import { useAuth } from "./Auth";

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
            <button onClick={() => setOpen(true)}>Ingresar</button>
            <dialog open={open}>
                <article>
                    <h2>Ingrese usuario y contraseña</h2>
                        <form onSubmit={handleSubmit}>
                            <fieldset>
                            <label htmlFor="usuario">Usuario:</label>
                            <input
                                name="usuario"
                                value={usuario}
                                onChange={(e) => setUsuario(e.target.value)}
                            />
                            <label htmlFor="contraseña">Contraseña:</label>
                            <input
                                name="contraseña"
                                type="password"
                                value={contraseña}
                                onChange={(e) => setContraseña(e.target.value)}
                            />
                            {error && <p style={{ color: "red" }}>{error}</p>}
                            </fieldset>
                            <footer>
                            <div className="grid">
                                <input
                                type="button"
                                className="secondary"
                                value="Cancelar"
                                onClick={() => setOpen(false)}
                                />
                                <input type="submit" value="Ingresar" />
                            </div>
                            </footer>
                        </form>
                </article>
            </dialog>
        </>
    )
}