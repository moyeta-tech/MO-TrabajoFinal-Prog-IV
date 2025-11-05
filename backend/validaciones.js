import { param, body, validationResult } from 'express-validator'

export const validarId = param("id").isInt({ min: 1 }) // Validar id para medicos, pacientes, usuarios

export const validarPacienteId = param("paciente_id").isInt({ min: 1 })
export const validarMedicoId = param("medico_id").isInt({ min: 1 })

export const validarMedico = [ // Validar body medico
    body("nombre").isAlpha('es-ES').isEmpty().isLength({ max: 50 }),
    body("apellido").isAlpha('es-ES').isEmpty().isLength({ max: 50 }),
    body("especialidad").isAlpha('es-ES').isEmpty().isLength({ max: 50 }),
    body("matricula").isEmpty().isInt({min: 1000})
]

export const validarPaciente = [ // Validar body medico
    body("nombre").isEmpty().isAlpha('es-ES').isLength({ max: 50 }),
    body("apellido").isEmpty().isAlpha('es-ES').isLength({ max: 50 }),
    body("dni").isEmpty().isInt().isLength({ min: 8, max: 8 }),
    body("fechaNacimiento").isEmpty().isDate(),
    body('obraSocial').isEmpty().isAlpha('es-ES').isLength({ max: 50 })
]

export const validarUsuario = [ // Validar body usuario
    body("nombre").isAlpha('es-ES').isLength({ max: 50 }),
    body("email").isEmpty().isEmail().isLength({ max: 50 }),
    body("contraseña").isEmpty().isStrongPassword({
        minLength: 8,
        minLowercase: 1,
        minUppercase: 1,
        minNumbers: 1,
        minSymbols: 1
    })
]

export const validarTurno = [ // Validar body turno
    body("fecha").isEmpty().isDate(),
    body("hora").isEmpty().custom((value) => {
    if (!/^([01]\d|2[0-3]):([0-5]\d)$/.test(value)) {
      throw new Error('Value must be time with HH:MM format');
    }
    return true;
  }),
    body("estado").isEmpty().isAlpha('es-ES').isLength({ min: 50 }),
    body("observaciones").isAlpha('es-ES').isLength({ min: 50 })
]

export const verificarValidaciones = (req, res, next) => {
    const validacion = validationResult(req)
    if(!validacion.isEmpty()) {
        return res.status(400).json({
            success: false,
            message: 'Falla de validación',
            errores: validacion.array()
        })
    }
    next()
}