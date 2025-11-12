import { Outlet, Link } from "react-router";
import { useAuth } from "./Auth";
import { Login } from "./Login";

export const Layout = () => {
    const { isAuthenticated, logout } = useAuth()

    return (
        <main className="container">
            <nav className="navbar navbar-expand-lg navbar-light bg-light">
                <div className="collapse navbar-collapse">
                    <ul className="navbar-nav">
                        <li className="navbar-item">
                            <Link className="nav-link" to='/'>Home</Link>
                        </li>
                        <li className="navbar-item">
                            <Link className="nav-link" to='/usuarios'>Usuarios</Link>
                        </li>
                        <li className="navbar-item">
                            <Link className="nav-link" to='/pacientes'>Pacientes</Link>
                        </li>
                        <li className="navbar-item">
                            <Link className="nav-link" to='/medicos'>Medicos</Link>
                        </li>
                        <li className="navbar-item">
                            <Link className="nav-link" to='/turnos'>Turnos</Link>
                        </li>
                        {isAuthenticated ? ( <button className="btn btn-secondary" onClick={() => logout()}>Salir</button> ) : ( <Login /> )}
                    </ul>
                </div>
            </nav>
            <Outlet />
        </main>
    )
}