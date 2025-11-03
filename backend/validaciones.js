import { param, body, validationResult } from 'express-validator'

export const validarId = param("id").isInt({min: 1}) // Validar id para todos

export const validarMedico = [ // Validar body medico
    body("nombre").isAlpha('es-ES').isLength({ max: 50 }),
    body("apellido").isAlpha('es-ES').isLength({ max: 50 }),
    body("especialidad").isAlpha('es-ES').isLength({ max: 50 }),
    body("matricula").isInt({min: 1000})
]

export const validarUsuario = [ // Validar body usuario
    body("nombre").isAlpha('es-ES').isLength({ max: 50 }),
    body("email").isEmail().isLength({ max: 50 }),
    body("contraseña").isStrongPassword({
        minLength: 8,
        minLowercase: 1,
        minUppercase: 1,
        minNumbers: 1,
        minSymbols: 1
    })

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