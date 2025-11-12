import express from 'express'
import { db } from '../config/db.js'
import bcrypt from 'bcrypt'
import { verificarValidaciones, validarId, validarUsuario } from '../validaciones.js'

const router = express.Router()


router.get('/', async (req, res) => {
    
    const [rows] = await db.execute("SELECT * FROM usuarios")
    
    if(rows.length === 0){
        return res.status(400).json({ success: false, message: 'No tiene datos de usuarios' })
    }

    return res.status(200).json({ success: true, usuarios: rows.map((u) => ({...u, hash_contraseña: undefined})) })


})

router.get('/:id', validarId, verificarValidaciones, async (req, res) => {
     const id = Number(req.params.id)

    let query = "SELECT * FROM usuarios WHERE id = ?"

    const [rows] = await db.execute(query, [id])

    if(rows.length === 0) {
        return res.status(400).json({ success: false, message: 'Usuario no encontrado' })
    }

    return res.status(200).json({ success: true, data: rows.map((u) => ({...u, hash_contraseña: undefined})) })

})

router.post('/', validarUsuario, verificarValidaciones, async (req, res) => {
    const { nombre, email, contraseña } = req.body

    const hashContraseña = await bcrypt.hash(contraseña, 12)
    
    let emailExistente = "SELECT * FROM usuarios WHERE email=?"
    
    const [emailExiste] = await db.execute(emailExistente, [email])
    
    if(emailExiste.length > 0) {
        return res.status(400).json({ success: false, message: 'Ya existe una cuenta de usuario con ese email' })
    }

    let query = "INSERT INTO usuarios (nombre, email, \
    hash_contraseña) VALUES (?,?,?)"
    
    const [rows] = await db.execute(query, [nombre, email, hashContraseña])
    
    return res.status(200).json({ success: true, data: { id: rows.insertId, nombre, email } })

})

router.put('/:id', validarId, validarUsuario, verificarValidaciones, async (req, res) => {
    const id = Number(req.params.id)
    const { nombre, email, contraseña } = req.body
    
    const hashContraseña = await bcrypt.hash(contraseña, 12)

    let emailExistente = "SELECT * FROM usuarios WHERE id<>? AND email=?"

    let query = "SELECT * FROM usuarios WHERE id=?"

    const [existe] = await db.execute(query, [id])

        if(existe.length === 0){
            return res.status(400).json({ success: false, message: 'No se encontró al usuario' })
        }

    const [emailExiste] = await db.execute(emailExistente, [id, email])
    
    if(emailExiste.length > 0) {
        return res.status(400).json({ success: false, message: 'Ya existe una cuenta de usuario con ese email' })
    }

    await db.execute("UPDATE usuarios SET nombre=?, email=?, hash_contraseña=? WHERE id=?",
        [nombre, email, hashContraseña, id]
    )

    return res.status(200).json({ success: true, data: id, nombre, email })


})

router.delete('/:id', validarId, verificarValidaciones, async (req, res) => {
const id = Number(req.params.id)

    let query = 'SELECT * FROM usuarios WHERE id=?'
    
    const [rows] = await db.execute(query, [id])

    if(rows.length === 0) {
        return res.status(400).json({ success: false, message: 'No se encontró al usuario' })
    }

    await db.execute("DELETE FROM usuarios WHERE id=?", [id])
    
    return res.status(200).json({ success: true, data: id, message: 'Usuario eliminado correctamente' })

})

export default router