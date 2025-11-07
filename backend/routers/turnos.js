import express, { Router } from 'express'
import { db } from '../config/db.js'
import { validarMedicoId, validarPacienteId, validarTurno, verificarValidaciones } from '../validaciones.js'

const router = express.Router()

router.get('/', (req, res) => {

})

router.get('/pacientes/:paciente_id', validarPacienteId, verificarValidaciones, async (req, res) => {
    const pacienteId = Number(req.params.paciente_id)
    let sql = `SELECT t.id AS turno_id,
                t.fecha,
                t.hora,
                t.estado,
                t.observaciones,
                m.id AS medico_id,
                m.nombre AS nombre_medico,
                m.apellido AS apellido_medico
                FROM turnos t JOIN medicos m ON m.id = t.medico_id
                WHERE t.paciente_id = ? `
    
    const [rows] = await db.execute(sql, [pacienteId])
    
    if(rows.length === 0) {
        return res.status(404).json({ success: false, message: 'El paciente no tiene turnos registrados' })
    }
    
    return res.status(200).json({ success: true, data: rows })
})

router.get('/medicos/:medico_id', validarMedicoId, verificarValidaciones, async (req, res) => {
    const medicoId = Number(req.params.medico_id)
    let sql = `SELECT t.id AS turno_id,
                    t.fecha,
                    t.hora,
                    t.estado,
                    t.observaciones,
                    p.id AS paciente_id,
                    p.nombre AS nombre_paciente,
                    p.apellido AS apellido_paciente,
                    p.dni AS dni_paciente,
                    p.fecha_nacimiento AS fecha_nacimiento_paciente,
                    p.obra_social AS obra_social_paciente
               FROM turnos t JOIN pacientes p ON t.paciente_id = p.id
               WHERE t.medico_id = ?
    `
    const [rows] = await db.execute(sql, [medicoId])

    if(rows.length === 0) {
        return res.status(404).json({ success: false, message: 'El medico no esta registrado a ningun turno' })
    }

    return res.status(200).json({ success: true, data: rows })
})

router.post('/', validarMedicoId, validarPacienteId, validarTurno,  async (req, res) => {
    const { medicoId, pacienteId, fecha, hora, estado, observaciones } = req.body


    // Verificamos si existen los pacientes
    let sqlExistenPacientes = 'SELECT id FROM pacientes WHERE id=?'

    let sqlExistenMedicos = 'SELECT id FROM medicos WHERE id=?'

    
   const [pacientes] = await db.execute(sqlExistenPacientes, [pacienteId])

   if(pacientes.length === 0) {
    return res.status(404).json({ success: false, message: 'No se encuentran pacientes en la tabla' })
   }

   // Verificamos si existen los medicos
    const [medicos] = await db.execute(sqlExistenMedicos, [medicoId])

   if(medicos.length === 0) {
    return res.status(404).json({ success: false, message: 'No se encuentran medicos en la tabla' })
   }

   // Verificamos si ya hay un turno registrado con esos datos
   let sqlExisteTurno = 'SELECT * FROM turnos WHERE paciente_id=? AND medico_id=? AND fecha=? AND hora=?'

   const [existeTurno] = await db.execute(sqlExisteTurno, [pacienteId, medicoId, fecha, hora])

   if(existeTurno.length > 0) {
     return res.status(400).json({ success: false, message: 'Ya se encuentra un turno registrado con esos datos' })
   }

   let sqlInsert = 'INSERT INTO turnos (medico_id, paciente_id, fecha, hora, estado, observaciones) VALUES (?,?,?,?,?,?)'

   const [rows] = await db.execute(sqlInsert, [medicoId, pacienteId, fecha, hora, estado, observaciones])

   return res.status(200).json({ success: true, data: { id: rows.insertId, medicoId, pacienteId, fecha, hora, estado, observaciones } })

})

   // Por hacer: put y delete
   router.put('/pacientes/:paciente_id/medicos/:medico_id',validarPacienteId, validarMedicoId, validarTurno, verificarValidaciones, async (req, res) => {
        const paciente_id = Number(req.params.paciente_id)
        const medico_id = Number(req.params.medico_id)
        const { fecha, hora, estado } = req.body

        let sqlExisteTurno = "SELECT * FROM turnos WHERE paciente_id=? AND medico_id=? AND fecha=? AND hora=?"

        const [existeTurno] = await db.execute(sqlExisteTurno, [paciente_id, medico_id, fecha, hora])

        if(existeTurno.length === 0){
            return res.status(404).json({ success: false, message: 'No existe ese turno para el paciente' })
        }
        
        let sqlUpdate = "UPDATE turnos SET fecha=?, hora=?, estado=? WHERE paciente_id=? AND medico_id=?"

        const [rows] = await db.execute(sqlUpdate, [fecha, hora, estado, paciente_id, medico_id])

        return res.status(200).json({ success: true, data: rows })

   }) 

   router.delete('/pacientes/:paciente_id/medicos/:medico_id', async (req, res) => {
        const paciente_id = Number(req.params.paciente_id)
        const medico_id = Number(req.params.medico_id)

        let sqlDelete = 'DELETE FROM turnos WHERE paciente_id=? AND medico_id=?'
        const [result] = await db.execute(sqlDelete, [paciente_id, medico_id])

        if (result.affectedRows === 0) {
            return res.status(404).json({ success: false, message: 'No se encontró el turno para eliminar' })
        }

        return res.status(200).json({ success: true, message: 'Turno eliminado correctamente' })

   }) 

export default router