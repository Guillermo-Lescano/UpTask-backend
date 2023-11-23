import Proyecto from "../models/Proyecto.js"
import Tarea from '../models/Tarea.js'

const agregarTarea = async (req, res)=>{
    //console.log(req.body)
    const { proyecto } = req.body //extraigo el id del proyecti que cargue , cuando quiero agregar la tarea para saber si existe
    const existeProyecto = await Proyecto.findById(proyecto)

    if(!existeProyecto){    //esta condicion no anda, igual que en proyecto
        const error = new Error('El proyecto no existe')
        return res.status(404).json({msg: error.message})
    }

    if (existeProyecto.creador.toString() !== req.usuario._id.toString()){  //solo una puede añadir tareas 
        //solo quien crea el proyecto puede añadir tareas
        const error = new Error('No tiene los permisos para añadir tarea')
        return res.status(403).json({msg: error.message})
    }

    try {
        const tareaAlmacenada = await Tarea.create(req.body);   //agrego al paquete Tarea, lo que puse en postman req.body
        //almacenar el id de la tarea en el proyecto
        existeProyecto.tareas.push(tareaAlmacenada._id)
        await existeProyecto.save()
        return res.json(tareaAlmacenada)

    } catch (error) {
        console.log(error)
    }

    //console.log(existeProyecto)
}

const obtenerTarea = async (req, res)=>{
    const {id} = req.params     //saco el id de la url de postman
    const tarea = await Tarea.findById(id).populate('proyecto')  //consulto en la DB de tarea si hay una tarea con ese id
    //el papulate lo que haces e ahorarnos de hacer dos consultas para saber el creador, ya que el creador lo sabemos con el id del proyecto
    //lo que hace es directamente en esa linea es relacionar el id con el proyecto y tenemos toda la info en una sola consulta

    if(!tarea){
        const error = new Error('No se encontro tarea')
        return res.status(404).json({msg: error.message})
    }

    if(tarea.proyecto.creador.toString() !== req.usuario._id.toString()){
        const error = new Error('Accion no valida')
        return res.status(403).json({msg: error.message})
    }

    res.json(tarea)
   // console.log(tarea)

}

const actualizarTarea = async (req, res)=>{
    const {id} = req.params     //saco el id de la url de postman
    console.log(id)
    const tarea = await Tarea.findById(id).populate('proyecto')  
    if(!tarea){
        const error = new Error('No se encontro tarea')
        return res.status(404).json({msg: error.message})
    }

    if(tarea.proyecto.creador.toString() !== req.usuario._id.toString()){
        console.log('no es valido')
        const error = new Error('Accion no valida')
        return res.status(403).json({msg: error.message})
    }

    tarea.nombre = req.body.nombre || tarea.nombre;
    tarea.descripcion = req.body.descripcion || tarea.descripcion;
    tarea.prioridad = req.body.prioridad || tarea.prioridad;
    tarea.fechaEntrega = req.body.fechaEntrega || tarea.fechaEntrega;

    console.log('entro')

    try {
        const tareaAlmacenada = await tarea.save()
        res.json(tareaAlmacenada) 
    } catch (error) {
        console.log(error)
    }

}

const eliminarTarea = async (req, res)=>{
    const {id} = req.params     //saco el id de la url de postman
    console.log(id)
    const tarea = await Tarea.findById(id).populate('proyecto')  
    if(!tarea){
        const error = new Error('No se encontro tarea')
        return res.status(404).json({msg: error.message})
    }

    if(tarea.proyecto.creador.toString() !== req.usuario._id.toString()){
        console.log('no es valido')
        const error = new Error('Accion no valida')
        return res.status(403).json({msg: error.message})
    }

    try {
        await tarea.deleteOne()
        res.json({msg: "tarea eliminada"})
    } catch (error) {
        console.log(error)
    }

}

const cambiarEstado = async (req, res)=>{
    
}

export {
    agregarTarea,
    obtenerTarea,
    actualizarTarea,
    eliminarTarea,
    cambiarEstado
}
