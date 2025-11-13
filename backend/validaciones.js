import { param, body, validationResult } from 'express-validator'

export const validarId = param("id").isInt({ min: 1 }) // Validar id para medicos, pacientes, usuarios

export const validarPacienteId = param("paciente_id").isInt({ min: 1 })
export const validarMedicoId = param("medico_id").isInt({ min: 1 })

export const validarMedico = [ // Validar body medico
    body("nombre").isAlpha('es-ES').notEmpty().isLength({ max: 50 }).withMessage('El nombre no puede tener mas de 50 caracteres'),
    body("apellido").isAlpha('es-ES').notEmpty().isLength({ max: 50 }).withMessage('El apellido no puede tener mas de 50 caracteres'),
    body("especialidad").isAlpha('es-ES').notEmpty().isLength({ max: 50 }).withMessage('La especialidad no puede tener mas de 50 caracteres'),
    body("matricula").notEmpty().isInt({min: 1000, max: 100000}).withMessage('entre 1000 y 100000')
]

export const validarPaciente = [ // Validar body medico
    body("nombre").notEmpty().isAlpha('es-ES').isLength({ max: 50 }).withMessage('El nombre no puede tener mas de 50 caracteres'),
    body("apellido").notEmpty().isAlpha('es-ES').isLength({ max: 50 }).withMessage('El apellido no puede tener mas de 50 caracteres'),
    body("dni").notEmpty().isInt().isLength({ min: 8, max: 8 }).withMessage('El dni debe tener 8 caracteres'),
    body("fechaNacimiento").notEmpty().isDate().withMessage('la fecha de nacimiento debe tener formato YYYY-MM-DD'),
    body('obraSocial').notEmpty().isAlpha('es-ES').isLength({ max: 50 }).withMessage('La obra social no puede tener mas de 50 caracteres')
]

export const validarUsuario = [ // Validar body usuario
    body("nombre").isAlphanumeric('es-ES').isLength({ max: 50 }).withMessage('El nombre no puede tener mas de 50 caracteres'),
    body("email").notEmpty().withMessage('El email no puede estar vacío').isEmail().isLength({ max: 50 }).withMessage('El nombre no puede tener mas de 50 caracteres'),
    body("contraseña").notEmpty().withMessage('La contraseña no puede estar vacía').isStrongPassword({
        minLength: 8,
        minLowercase: 1,
        minUppercase: 1,
        minNumbers: 1,
        minSymbols: 1
    }).withMessage('Debe contener al menos 8 caracteres, 1 minuscula, 1 mayuscula, 1 numero y 1 simbolo')
]

export const validarAuth = [
      body("usuario").isAlphanumeric("es-ES").isLength({ max: 20 }).withMessage('El nombre no puede tener mas de 20 caracteres'),
      body("contraseña").isStrongPassword({
        minLength: 8, // Minimo de 8 caracteres
        minLowercase: 1, // Al menos una letra en minusculas
        minUppercase: 1, // Letras mayusculas opcionales
        minNumbers: 1, // Al menos un número
        minSymbols: 1, // Símbolos opcionales
  }).withMessage('Debe contener al menos 8 caracteres, 1 minuscula, 1 mayuscula, 1 numero y 1 simbolo'),
]

export const validarTurno = [ // Validar body turno
    body("fecha").notEmpty().isDate().withMessage('la fecha debe tener formato YYYY-MM-DD'),
    body("hora").notEmpty().custom((value) => {
    if (!/^([01]\d|2[0-3]):([0-5]\d)$/.test(value)) {
      throw new Error('Debe estar en formato HH:MM');
    }
    return true;
  }),
    body("estado").notEmpty().isAlpha('es-ES').isLength({ min: 50 }).withMessage('El estado no puede tener mas de 50 caracteres'),
    body("observaciones").isAlpha('es-ES').isLength({ min: 50 }).withMessage('Las observaciones no puede tener mas de 50 caracteres')
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