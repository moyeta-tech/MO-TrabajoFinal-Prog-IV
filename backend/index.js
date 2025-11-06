import express from 'express'
import { conectarDB } from './config/db.js'
import medicosRouter from './routers/medicos.js'
import usuariosRouter from './routers/usuarios.js'
import pacientesRouter from './routers/pacientes.js'
import turnosRouter from './routers/turnos.js'
import authRouter from './routers/auth.js'

conectarDB()

const app = express()
const port = process.env.PORT

app.get('/', (req, res) => {
    res.send('Bienvenidos a mi api')
})

app.use(express.json())

// Decimos a la app que utilice los routers
app.use('/medicos', medicosRouter)
app.use('/usuarios', usuariosRouter)
app.use('/pacientes', pacientesRouter)
app.use('/turnos', turnosRouter)
app.use('/auth', authRouter)



app.listen(port ,() => {
    console.log(`Aplicación funcionando en http://localhost:${port}`);
})