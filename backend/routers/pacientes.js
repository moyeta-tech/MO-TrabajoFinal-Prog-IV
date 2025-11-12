import express from 'express'
import { db } from '../config/db.js'
import { verificarValidaciones, validarId, validarPaciente } from '../validaciones.js'

const router = express.Router()


router.get('/', async (req, res) => {
    const [rows] = await db.execute('SELECT * FROM pacientes')

    if(rows.length === 0){
        return res.status(400).json({ success: false, message: 'No tiene datos de pacientes' })
    }

    return res.status(200).json({ success: true, pacientes: rows })
})

router.get('/:id', validarId, verificarValidaciones, async (req, res) => {
    const id = Number(req.params.id)

    let query = "SELECT * FROM pacientes WHERE id = ?"

    const [rows] = await db.execute(query, [id])

    if(rows.length === 0) {
        return res.status(400).json({ success: false, message: 'Paciente no encontrado' })
    }

    return res.status(200).json({ success: true, data: rows[0] })
})

router.post('/', validarPaciente, verificarValidaciones, async (req, res) => {
    const { nombre, apellido, dni, fechaNacimiento, obraSocial } = req.body
    
    let query = "INSERT INTO pacientes (nombre, apellido, \
    dni, fecha_nacimiento, obra_social) VALUES (?,?,?,?,?)"
    
    const [rows] = await db.execute(query, [nombre, apellido, dni, fechaNacimiento, obraSocial])
    
    return res.status(200).json({ success: true, data: { id: rows.insertId, nombre, apellido, dni, fechaNacimiento, obraSocial } })
})

router.put('/:id', validarId, validarPaciente, verificarValidaciones, async (req, res) => {
    const id = Number(req.params.id)
    const { nombre, apellido, dni, fechaNacimiento, obraSocial } = req.body
    
    let query = "SELECT * FROM pacientes WHERE id=?"

    const [existe] = await db.execute(query, [id])
    if(existe.length === 0){
        return res.status(400).json({ success: false, message: 'No se encontró al paciente' })
    }

    await db.execute("UPDATE pacientes SET nombre=?, apellido=?, dni=?, fecha_nacimiento=?, obra_social=? WHERE id=?",
        [nombre, apellido, dni, fechaNacimiento, obraSocial, id]
    )

    return res.json({ success: true, data: { id, nombre, apellido, dni, fechaNacimiento, obraSocial }})

})

router.delete('/:id', validarId, verificarValidaciones, async (req, res) => {
    const id = Number(req.params.id)

    const query = 'SELECT * FROM pacientes WHERE id=?'
    
    const [rows] = await db.execute(query, [id])

    if(rows.length === 0) {
        return res.status(400).json({ success: false, message: 'No se encontró al paciente' })
    }

    await db.execute("DELETE FROM pacientes WHERE id=?", [id])
    
    return res.status(200).json({ success: true, data: id, message: 'Paciente eliminado correctamente' })
})

export default router