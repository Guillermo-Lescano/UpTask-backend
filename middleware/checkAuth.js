//se creo para proteger las rutas, es un middleware
import jwt from "jsonwebtoken"
import Usuario from '../models/Usuario.js'

const checkAouth = async (req, res, next) =>{
    let token
    console.log('desde checkAouth.js')
    //si ejecutamos el endpoint /perfil en postman, se queda en desde checkAuth, pero necesitamos ejecutar el proximo middleware
    //asi que cuando termine esta tarea (en este caso mostrar el print, usamos el next para pasar al siguiente endpoint , que es perfil)
    //es perfil ene ste caso, pero nos referimos al proximo endpoint despues de este checkAuth
    //esto se usa para proteger las rutas de tu API
    //Aca revisamos que este usuario este autenticado, y que el token sea valido
    
    //console.log(req.header.authorization) //imprime undefined, en los header es donde mandamos los jsonwebtoken, estos se envian primeros (los header)
    
    if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')){ //si hay un bearer , obtengo el token
        try {
            token = req.headers.authorization.split(' ')[1]
            const decoded = jwt.verify(token, process.env.JWT_SECRET)   //el verify es para decodificar, el sing para codificar
            req.usuario = await Usuario.findById(decoded.id).select('-password -confirmado -token -createdAt -updatedAt -__v')
            console.log(req.usuario)
            return next()
        } catch (error) {
            return res.status(404).json({msg:'Hubo un error'})
        }
    }

    if(!token){
        const error = new Error('Token no valido')
        return res.status(401).json({msg: error.message})
    }

    next()
}

export default checkAouth