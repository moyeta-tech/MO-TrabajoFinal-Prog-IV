import express from 'express'
import { db } from '../config/db.js'
import { verificarValidaciones, validarId, validarMedico } from '../validaciones.js'

const router = express.Router()


router.get('/', async (req, res) => {
    const [rows] = await db.execute('SELECT * FROM medicos')

    if(rows.length === 0){
        return res.status(400).json({ success: false, message: 'No tiene datos de medicos' })
    }

    return res.status(200).json({ success: true, medicos: rows })
})

router.get('/:id', validarId, verificarValidaciones, async (req, res) => {
    const id = Number(req.params.id)

    let query = "SELECT * FROM medicos WHERE id = ?"

    const [rows] = await db.execute(query, [id])

    if(rows.length === 0) {
        return res.status(400).json({ success: false, message: 'Medico no encontrado' })
    }

    return res.status(200).json({ success: true, data: rows[0] })
})

router.post('/', validarMedico, verificarValidaciones, async (req, res) => {
    const { nombre, apellido, especialidad, matricula } = req.body
    
    let query = "INSERT INTO medicos (nombre, apellido, \
    especialidad, matricula_profesional) VALUES (?,?,?,?)"
    
    const [rows] = await db.execute(query, [nombre, apellido, especialidad, matricula])
    
    return res.status(200).json({ success: true, data: { id: rows.insertId, nombre, apellido, matricula } })
})

router.put('/:id', validarId, validarMedico, verificarValidaciones, async (req, res) => {
    const id = Number(req.params.id)
    const { nombre, apellido, especialidad, matricula } = req.body
    
    let query = "SELECT * FROM medicos WHERE id=?"

    const [existe] = await db.execute(query, [id])
    if(existe.length === 0){
        return res.status(400).json({ success: false, message: 'No se encontró al medico' })
    }

    await db.execute("UPDATE medicos SET nombre=?, apellido=?, especialidad=?, matricula_profesional=? WHERE id=?",
        [nombre, apellido, especialidad, matricula, id]
    )

    return res.json({ success: true, data: { id, nombre, apellido, especialidad, matricula }})

})

router.delete('/:id', validarId, verificarValidaciones, async (req, res) => {
    const id = Number(req.params.id)

    const query = 'SELECT * FROM medicos WHERE id=?'
    
    const [rows] = await db.execute(query, [id])

    if(rows.length === 0) {
        return res.status(400).json({ success: false, message: 'No se encontró al medico' })
    }

    await db.execute("DELETE FROM medicos WHERE id=?", [id])
    
    return res.status(200).json({ success: true, data: id, message: 'Medico eliminado correctamente' })
})

export default router