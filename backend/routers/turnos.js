import express from 'express'
import { db } from '../config/db.js'
import { validarMedicoId, validarPacienteId, validarTurno, verificarValidaciones } from '../validaciones.js'
import { verificarAutenticacion } from './auth.js'

const router = express.Router()

router.get('/', verificarAutenticacion, async (req, res) => {
    let sql = `SELECT t.id,
               t.fecha AS fecha,
               t.hora AS hora,
               t.estado AS estado,
               p.id AS paciente_id,
                    CONCAT(p.nombre, ' ', p.apellido) AS nombre_paciente,
                m.id AS medico_id,
                    CONCAT(m.nombre, ' ', m.apellido) AS nombre_medico,
               observaciones 
               FROM turnos t
               JOIN medicos m on m.id = t.medico_id
               JOIN pacientes p on p.id = t.paciente_id
               ORDER BY fecha, hora
               `
    const [rows] = await db.execute(sql)

    if(rows.length === 0) {
        return res.status(404).json({ success: false, message: 'No hay turnos asignados'})
    }

    return res.status(200).json({ success: true, turnos: rows })
})

router.get('/pacientes/:paciente_id', verificarAutenticacion, validarPacienteId, verificarValidaciones, async (req, res) => {
    const pacienteId = Number(req.params.paciente_id)
    let sql = `SELECT t.id AS turno_id,
                t.fecha,
                t.hora,
                t.estado,
                t.observaciones,
                m.id AS medico_id,
                m.nombre AS nombre_medico,
                m.apellido AS apellido_medico
                FROM turnos t 
                JOIN medicos m ON m.id = t.medico_id
                WHERE t.paciente_id = ? `
    
    const [rows] = await db.execute(sql, [pacienteId])
    
    if(rows.length === 0) {
        return res.status(404).json({ success: false, message: 'El paciente no tiene turnos registrados' })
    }
    
    return res.status(200).json({ success: true, data: rows })
})

router.get('/medicos/:medico_id', verificarAutenticacion, validarMedicoId, verificarValidaciones, async (req, res) => {
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
               FROM turnos t 
               JOIN pacientes p ON t.paciente_id = p.id
               WHERE t.medico_id = ?
    `
    const [rows] = await db.execute(sql, [medicoId])

    if(rows.length === 0) {
        return res.status(404).json({ success: false, message: 'El medico no esta registrado a ningun turno' })
    }

    return res.status(200).json({ success: true, data: rows })
})

router.get('/medicos/:medico_id/pacientes/:paciente_id', verificarAutenticacion, validarMedicoId, validarPacienteId, verificarValidaciones, async (req, res) => {
    const medicoId = Number(req.params.medico_id);
    const pacienteId = Number(req.params.paciente_id);

    let sql = `
        SELECT t.id,
               t.fecha AS fecha,
               t.hora AS hora,
               t.estado AS estado,
               p.id AS paciente_id,
               CONCAT(p.nombre, ' ', p.apellido) AS nombre_paciente,
               m.id AS medico_id,
               CONCAT(m.nombre, ' ', m.apellido) AS nombre_medico,
               t.observaciones 
        FROM turnos t
        JOIN medicos m ON m.id = t.medico_id
        JOIN pacientes p ON p.id = t.paciente_id
        WHERE t.medico_id = ? AND t.paciente_id = ?
        ORDER BY fecha, hora
    `;

    const [rows] = await db.execute(sql, [medicoId, pacienteId]);

    if (rows.length === 0) {
        return res.status(404).json({ success: false, message: 'No se encontró turno con ese médico y paciente' });
    }

    return res.status(200).json({ success: true, turno: rows[0] });
});


// GET /turnos/:id
router.get('/:id', verificarAutenticacion, async (req, res) => {
  const id = Number(req.params.id);

  const sql = `
    SELECT t.id,
           t.fecha,
           t.hora,
           t.estado,
           t.observaciones,
           p.id AS paciente_id,
           CONCAT(p.nombre, ' ', p.apellido) AS nombre_paciente,
           m.id AS medico_id,
           CONCAT(m.nombre, ' ', m.apellido) AS nombre_medico
    FROM turnos t
    JOIN pacientes p ON p.id = t.paciente_id
    JOIN medicos   m ON m.id = t.medico_id
    WHERE t.id = ?
  `;

  const [rows] = await db.execute(sql, [id]);

  if (rows.length === 0) {
    return res.status(404).json({ success: false, message: 'No existe ese turno' });
  }

  return res.json({ success: true, turno: rows[0] });
});

// PUT /turnos/:id
router.put('/:id', verificarAutenticacion, validarTurno, verificarValidaciones, async (req, res) => {
  const id = Number(req.params.id);
  const { fecha, hora, estado } = req.body;

  // 1) Verificar que exista el turno
  const [rows] = await db.execute('SELECT * FROM turnos WHERE id=?', [id]);
  if (rows.length === 0) {
    return res.status(404).json({ success: false, message: 'No existe ese turno' });
  }
  const turno = rows[0];

  // 2) Chequear horario ocupado para ese médico, excluyendo ESTE id
  const sqlMedicoOcupado = `
    SELECT * FROM turnos
    WHERE medico_id=? AND fecha=? AND hora=? AND id<>?
  `;
  const [ocupado] = await db.execute(sqlMedicoOcupado, [turno.medico_id, fecha, hora, id]);
  if (ocupado.length > 0) {
    return res.status(400).json({ success: false, message: 'Horario ocupado' });
  }

  // 3) Actualizar solo ese turno
  const sqlUpdate = `
    UPDATE turnos SET fecha=?, hora=?, estado=?
    WHERE id=?
  `;
  await db.execute(sqlUpdate, [fecha, hora, estado, id]);

  return res.json({ success: true });
});


router.post('/', verificarAutenticacion, validarMedicoId, validarPacienteId, validarTurno,  async (req, res) => {
    console.log('Datos recibidos:', req.body)

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

   // Verificamos que no exista un turno con ese profesional en ese mismo horario
   let sqlMedicoOcupado = 'SELECT * FROM turnos WHERE medico_id=? AND fecha=? AND hora=?'

   const [ocupado] = await db.execute(sqlMedicoOcupado, [medicoId, fecha, hora])

   if(ocupado.length > 0) {
        return res.status(400).json({ success: false, message: 'Horario ocupado' })
   }

   let sqlInsert = 'INSERT INTO turnos (medico_id, paciente_id, fecha, hora, estado, observaciones) VALUES (?,?,?,?,?,?)'

   const [rows] = await db.execute(sqlInsert, [medicoId, pacienteId, fecha, hora, estado, observaciones])

   return res.status(200).json({ success: true, data: { id: rows.insertId, medicoId, pacienteId, fecha, hora, estado, observaciones } })

})

   router.put('/pacientes/:paciente_id/medicos/:medico_id', verificarAutenticacion, validarPacienteId, validarMedicoId, validarTurno, verificarValidaciones, async (req, res) => {
        const paciente_id = Number(req.params.paciente_id)
        const medico_id = Number(req.params.medico_id)
        const { fecha, hora, estado } = req.body

        const sqlBuscar = `
            SELECT * FROM turnos
            WHERE paciente_id=? AND medico_id=?
            LIMIT 1
        `;
        const [turnos] = await db.execute(sqlBuscar, [paciente_id, medico_id]);

        if (turnos.length === 0) {
            return res.status(404).json({
                success: false,
                message: "No existe ese turno para el paciente"
            });
        }

        
        //    let sqlMedicoOcupado = 'SELECT * FROM turnos WHERE medico_id=? AND fecha=? AND hora=? AND id<>?'

        //     const [ocupado] = await db.execute(sqlMedicoOcupado, [medico_id, fecha, hora, turnos[0].id])

        //     if(ocupado.length > 0) {
        //             return res.status(400).json({ success: false, message: 'Horario ocupado' })
        //     }

        let sqlUpdate = "UPDATE turnos SET fecha=?, hora=?, estado=? WHERE paciente_id=? AND medico_id=?"

        const [rows] = await db.execute(sqlUpdate, [fecha, hora, estado, paciente_id, medico_id])

        return res.status(200).json({ success: true, data: rows })

   }) 

   router.delete('/pacientes/:paciente_id/medicos/:medico_id', verificarAutenticacion, async (req, res) => {
        const paciente_id = Number(req.params.paciente_id)
        const medico_id = Number(req.params.medico_id)

        let sqlDelete = 'DELETE FROM turnos WHERE paciente_id=? AND medico_id=?'
        const [result] = await db.execute(sqlDelete, [paciente_id, medico_id])

        if (result.length === 0) {
            return res.status(404).json({ success: false, message: 'No se encontró el turno para eliminar' })
        }

        return res.status(200).json({ success: true, message: 'Turno eliminado correctamente' })

   }) 

   router.delete('/:id', verificarAutenticacion, async (req, res) => {
        const id = req.params.id

        let sqlDelete = 'DELETE FROM turnos WHERE id=?'

        const [result] = await db.execute(sqlDelete, [id])

        if (result.length === 0) {
            return res.status(404).json({ success: false, message: 'No se encontró el turno para eliminar' })
        }

        return res.status(200).json({ success: true, message: 'Turno eliminado correctamente' })


   })
export default router