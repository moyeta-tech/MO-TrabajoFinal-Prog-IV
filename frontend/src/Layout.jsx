import { Outlet, Link } from "react-router";
import { useAuth } from "./Auth";
import { Login } from "./Login";

export const Layout = () => {
    const { isAuthenticated, logout } = useAuth()

    return (
        <main className="container">
            <nav>
                <ul>
                    <li>
                        <Link to='/'>Home</Link>
                    </li>
                    <li>
                        <Link to='/usuarios'>Usuarios</Link>
                    </li>
                    <li>
                        <Link to='/pacientes'>Pacientes</Link>
                    </li>
                    <li>
                        <Link to='/medicos'>Medicos</Link>
                    </li>
                    {isAuthenticated ? ( <button onClick={() => logout()}>Salir</button> ) : ( <Login /> )}
                </ul>
            </nav>
            <Outlet />
        </main>
    )
}