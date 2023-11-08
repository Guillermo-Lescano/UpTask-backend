//aqui vamos a definir toda la funcionalidad que va a comunicar routing con modelos, todo se hace por medio del controller

//usando controladores
/* const usuarios = (req, res) => {
  res.json({ msg: "Confirmado" });
};
const creandoUsuario = (req, res) => {
  res.json({ msg: "creando usuario" });
};
export { usuarios, creandoUsuario };
 */

import Usuario from '../models/Usuario.js'
import generarId from '../helpers/generarId.js';
import generarJWT from '../helpers/generarJWT.js';
import {emailRegistro} from '../helpers/email.js'

const registrar = async (req, res) => {
    //console.log(req.body)   //es bodi porque asi se lo pasamos en postman

    //evitar registors duplicados de email
    const { email } = req.body
    const existeUsuario = await Usuario.findOne({email}); //el find() trae todos los email de la base, el findOne solo el primero

    if(existeUsuario) {
      const error = new Error ("Existe un usuario ya registrado")
      return res.status(400).json({msg: error.message})
    }

    try {
        const usuario = new Usuario(req.body)
        usuario.token = generarId() //creamos una instancia del usuario y despues lo guarda
        const usuarioAlmacenado = await usuario.save()
        //enviar el email de confirmacion
        emailRegistro({
          nombre: usuario.nombre,
          email: usuario.email,
          token: usuario.token 
        })

        res.json({msg: 'Usuario creado exitosamente, Revisa tu Email para confirmar tu cuenta'})
    } catch (error) {
        console.log(error)
    }    
}

const autenticar = async (req, res) =>{
  const {email, password} = req.body
  //Comprobar si el usuario existe
  const usuario = await Usuario.findOne({email})
  console.log(usuario)
  if(!usuario){
    const error = new Error("El usuario no existe")
    return res.status(404).json({msg: error.message })  //es 404 porque es ecodigo es cuando no encuentra algo
  }

  //Comprobar si el usuario esta confirmadio
  if(!usuario.confirmado){
    const error = new Error("Tu cuenta no a sido confirmada")
    return res.status(403).json({msg: error.message })  //es 403 porque es ecodigo es cuando 
  }

  //comprobar el password
  //el password esta hasheado asi que usamos bcrypt
  if(await usuario.comprobarPassword(password)){ //el password que paso por parametro a la funcion, es el que saco de req-body (lo traido de postman)
    res.json({
      _id: usuario._id,
      usuario: usuario.nombre,
      email: usuario.email,
      token: generarJWT(usuario._id)
    })
  }else{
    const error = new Error("El password es incorrecto")
    return res.status(403).json({msg: error.message })
  }
}

const confirmar = async (req, res) =>{
  const {token} = req.params  //es params porque toma lo que le ponemos despues de los : en la ruta, al ser dinamico puede ir cambiando
  const usuarioConfirmar = await Usuario.findOne({token})
  if(!usuarioConfirmar){
    const error = new Error("El token no es correcto")
    return res.status(403).json({msg: error.message })
  }
  try {
    usuarioConfirmar.confirmado = true    //si el token es correcto, pasa a ser confirmado true, y abajo el token es de un solo uso
    usuarioConfirmar.token = ""           //asi qie se elimina dejandolo vacio
    usuarioConfirmar.save()   //se hace para ya guardar los cambios en la db de mongo
    res.json({msg:'El usuario fue confirmadio correctamente'})
  } catch (error) {
    console.log(error)
  }
}

const olvidePassword = async (req, res) =>{
  const { email } = req.body
  //Comprobar si el usuario existe
  const usuario = await Usuario.findOne({email})
  console.log(usuario)
  if(!usuario){
    const error = new Error("El usuario no existe")
    return res.status(404).json({msg: error.message })  //es 404 porque es ecodigo es cuando no encuentra algo
  }
  try {
    usuario.token = generarId()
    await usuario.save()
    res.json({msj: 'Hemos enviado un email con las instrucciones'})
  } catch (error) {
    console.log(error)
  }
}

const comprobarToken = async (req, res) =>{
  const { token } = req.params // es params porque extraemos valores de la url, si es de formulario es por .body
  const tokenValido = await Usuario.findOne({token})

  if(tokenValido){
    res.json({msj: 'Token Valido y el Usuario existe'})
  }
  else{
    const error = new Error("El Token no es valido")
    return res.status(404).json({msg: error.message })
  }
}

const nuevoPassword = async (req, res) =>{
  const { token } = req.params
  const { password } = req.body

  const usuario = await Usuario.findOne({token})

  if(usuario){
    usuario.password = password
    usuario.token = ""
    try {
      await usuario.save()
      res.json({msg: 'Password modificado correctamente'})
    } catch (error) {
      console.log(error)
    }
  }
  else{
    const error = new Error("El Token no es valido")
    return res.status(404).json({msg: error.message })
  }
  console.log(token, password)
}

const perfil = async (req, res) => {
  const {usuario} = req

  res.json(usuario)
}

export { registrar, autenticar, confirmar, olvidePassword, comprobarToken, nuevoPassword, perfil };