import express, { Router } from 'express'
import { db } from '../config/db.js'
import { validarMedicoId, validarPacienteId, validarTurno, verificarValidaciones } from '../validaciones.js'

const router = express.Router()

router.get('/', (req, res) => {

})

router.get('/pacientes/:paciente_id', validarPacienteId, verificarValidaciones, async (req, res) => {
    const paciente_id = Number(req.params.paciente_id)
    let sql = 'SELECT * FROM pacientes WHERE id=?'
    const [rows] = await db.execute(sql, [paciente_id])

    return res.status(200).json({ success: true, data: rows[0] })
})

router.get('/medicos/:medico_id', validarMedicoId, verificarValidaciones, async (req, res) => {
    let sql = 'SELECT * FROM medicos'
})