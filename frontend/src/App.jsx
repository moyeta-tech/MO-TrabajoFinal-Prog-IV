import { useState } from 'react'
import { Link } from 'react-router';

function App() {

  const [count, setCount] = useState(0)

    return (
    <div className="container mt-5">
      
      <div className="card shadow-sm border-0 rounded-4 p-4 text-center">
        <h2 className="fw-bold mb-3 text-primary">Bienvenido de nuevo </h2>
        <p className="lead text-muted fs-3">
          Desde este panel podés gestionar tus pacientes, médicos y turnos.
        </p>

        <hr className="my-4" />

        <div className="row g-3 justify-content-center">
          <div className="col-6 col-md-3">
            <Link to={'pacientes'} className="btn btn-outline-primary w-100">Pacientes</Link>
          </div>
          <div className="col-6 col-md-3">
            <Link to={'medicos'} className="btn btn-outline-success w-100">Médicos</Link>
          </div>
          <div className="col-6 col-md-3">
            <Link to={'turnos'} className="btn btn-outline-warning w-100">Turnos</Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App
