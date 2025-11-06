import express from 'express'
import { db } from '../config/db.js'
import { verificarValidaciones, validarAuth } from '../validaciones.js'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import passport from 'passport'
import { Strategy, ExtractJwt } from 'passport-jwt'

const router = express.Router()


export function authConfig(){
    const jwtOptions = {
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
        secretKey: process.env.JWT_SECRET
    }

    passport.use(
        new Strategy(jwtOptions, async (payload, next) => {

            next(null, payload)
        })
    )
}

router.post('/login', validarAuth, verificarValidaciones, async (req, res) => {
    const { usuario, contraseña } = req.body

    const [rows] = await db.execute("SELECT * FROM usuarios WHERE nombre=?", [usuario])

    if(rows.length === 0) {
        return res.status(400).json({ success: false, message: 'Usuario inválido' })
    }

    const passwordHash = rows[0].hash_contraseña

    const passwordComparada = await bcrypt.compare(contraseña, passwordHash)

    if(!passwordComparada) {
        return res.status(400).json({ success: false, message: 'Contraseña inválida' })
    }

    const payload = { usuarioId: rows[0].id, direccion: rows[0].email }
    const token = jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: "15min"
    })

    return res.json({ success: true, token })

})

export default router