import jwt from 'jsonwebtoken'

const generarJWT = (id) =>{
    return jwt.sign({id}, process.env.JWT_SECRET, {
        expiresIn:'30d' //tiempo de cuanto dura el token
    }) //esto genera el JWT , primero el nombre y luego lo de la variable de entorno
}

export default generarJWT