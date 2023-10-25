//creamos el modelo para los Proyecto
import mongoose from "mongoose";

const proyectosSchema = mongoose.Schema({
    nombre: {
        type: String,
        trim: true,
        require: true,
    },
    descripcion: {
        type: String,
        trim: true,
        require: true,
    },
    fechaEntrega: {
        type: Date,
        default: Date.now(),
    },
    cliente: {
        type: String,
        trim: true,
        require: true,
    },
    creador: {
        type: mongoose.Schema.Types.ObjectId,    //esto hace referencia con la coleccion de Usuarios (en mongoDB no recomiendan relacionar colleciones)
                                                //como en pgAdmin o MySQL, pero se puede hacer igual, hacemos referencia al Id del Usuario ya creado y Confirmado        
        ref:"Usuario"       //el ref es como puse el nombre en Usuario en mongoose.model("Usuario") en este caso
    
    },
    colaboradores: [    //es un arreglo ya que puede haber 1 o muchos colaboradores
    {
        type: mongoose.Schema.Types.ObjectId,
        ref:"Usuario"    
    }
    ],
},{
    timestamps: true, //crea info de cuando fue creada y actualizada CreateAt, updatedAt
    }
);
const Proyecto = mongoose.model('Proyecto', proyectosSchema ) //esto indica cual es el nombre y cual es la forma de datos

export default Proyecto