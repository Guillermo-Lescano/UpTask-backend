import mongoose from "mongoose";
import bcrypt from 'bcrypt'

//ahora definimos un esquema, que se conoce como la estructura de la base de datos

const usuarioSchema = mongoose.Schema(
  {
    nombre: {
      type: String,
      require: true,
      trim: true, //sirve para eliminar los espacios del inicio y final
    },
    password: {
      type: String,
      require: true,
      trim: true,
    },
    email: {
      type: String,
      require: true,
      trim: true,
      unique: true, //te dice si la cuenta que ingresa esta duplicada o no
    },
    token: {
      type: String,
    },
    confirmado: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true, // crea dos columnas una de creado y otra de actualizado
  }
); //************Se puede ver mas Schema en la documentacion de mongoose************/ es un ORM

usuarioSchema.pre('save', async function(next){ //este codigo se ejecuta antes de almacenar el registor en la db
  if(!this.isModified('password')){ //aca consulto si se modifico algo, pero que no haya sido el pass, next(), debo seguir con lo que sigue
    next()
  }
  const salt = await bcrypt.genSalt(10)  //mientrs mas rondas/saltas , mas seguro el hash, pero consume mas recursos
  this.password = await bcrypt.hash(this.password, salt) //hash(cadena sin hash, y pasamos el salt y esto genera un hash, lo almacena en this.password =  y se guarda en la db hasheado
})

usuarioSchema.methods.comprobarPassword = async function(passwordFormulario){
  return await bcrypt.compare(passwordFormulario, this.password) 
  //el compare de bcryp compara una pass hasheada con una que no esta hasheada ( porque mcuando queres ingresar no lo esta)
  //luego por parametros pasamos el que escribio en el login, y luego el this.password hace referencia al que esta hasheado
}

const Usuario = mongoose.model("Usuario", usuarioSchema);

export default Usuario;
