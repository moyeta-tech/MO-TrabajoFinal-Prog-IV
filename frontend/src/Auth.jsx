import { createContext, useContext, useState } from "react";

const AuthContext = createContext(null)

export const useAuth = () => {
   return useContext(AuthContext)
}

export const AuthProvider = ({ children }) => {

    const [token, setToken] = useState(null)
    const [usuario, setUsuario] = useState(null)
    const [error, setError] = useState(null)

    const login = async (usuario, contraseña) => {
        setError(null)
        try {
            const response = await fetch("http://localhost:3000/auth/login", {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({usuario, contraseña})
            })

            const session = await response.json()

            if(!response.ok){
                throw new Error(session.error || 'Error al iniciar sesión')
            }

            setToken(session.token)
            setUsuario(session.usuario)
            return { success: true }
        } catch(error) {
            setError(error.message)
            console.log(error.message)
            return { success: false }
        }
    }

    const logout = () => {
        setToken(null)
        setUsuario(null)
        setError(null)
    }

    const fetchAuth = async (url, options = {}) => {
        if(!token){
            throw new Error("No está iniciada la sesión")
        }

        return fetch(url, {
            ...options,
            headers: { ...options.headers, Authorization: `Bearer ${token}` }
        })

    }



    return <AuthContext.Provider value={{ token, usuario, error, isAuthenticated: !!token, login, logout, fetchAuth}}>{children}</AuthContext.Provider>
}

export const AuthPage = ({ children }) => {
    const { isAuthenticated } = useAuth()

    if(!isAuthenticated) {
        return <h2>Ingrese para ver esta pagina</h2>
    }

    return children
}