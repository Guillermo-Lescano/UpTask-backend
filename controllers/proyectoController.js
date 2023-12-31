import Proyecto from "../models/Proyecto.js"
import Usuario from "../models/Usuario.js"


//obtenemos todos los proyectos del usuario auntenticado 
const obtenerProyectos = async (req, res) =>{
    const proyectos = await Proyecto.find().where('creador').equals(req.usuario).select('-tareas')
    //el find nos trae todos los proyectos que tenemos en la DB
    res.json(proyectos)
}

//nuevos proyectos
const nuevoProyecto = async (req, res) =>{
    const proyecto = new Proyecto(req.body)
        proyecto.creador = req.usuario._id
    
    try {
        const proyectoAlmacenado = await proyecto.save()
        res.json(proyectoAlmacenado)
    } catch (error) {
        console.log(error)
    }
}

//nuevo proyecto
const obtenerProyecto = async (req, res) =>{
    const {id} = req.params
    const proyecto = await Proyecto.findById(id).populate('tareas')//busco en la db el primer proyecto que encuentre con el id que le esto pasando
                                                        //Aca usamos el tareas como lo pusimos en el modelo del Proyecto
    if(!proyecto){
        const error = new Error("No Encontrado")
        return res.status(404).json({msg: error.message })
    }
    if(proyecto.creador.toString() !== req.usuario._id.toString()){ //verifico si el creador es distinto al id de user, si no lo es, aviso que no tiene acceso a ese proyecto, ya que no le pertenece
        const error = new Error("Accion no Valida")
        return res.status(401).json({msg: error.message })
    }

    //Obtener las tareas del proyecto  
    //const tareas = await Tarea.find().where('proyecto').equals(proyecto._id)
    res.json(
        proyecto
        //tareas
    )

    //Para obtener las tareas, tenes que ser el creado del proyecto, o colaborador

   
}

//editar un proyecto
const editarProyecto = async (req, res) =>{
    const {id} = req.params
    const proyecto = await Proyecto.findById(id)    //busco en la db el primer proyecto que encuentre con el id que le esto pasando

    if(!proyecto){
        const error = new Error("No Encontrado")
        return res.status(404).json({msg: error.message })
    }
    if(proyecto.creador.toString() !== req.usuario._id.toString()){ //verifico si el creador es distinto al id de user, si no lo es, aviso que no tiene acceso a ese proyecto, ya que no le pertenece
        const error = new Error("Accion no Valida")
        return res.status(401).json({msg: error.message })
    }

    proyecto.nombre = req.body.nombre || proyecto.nombre
    proyecto.descripcion = req.body.descripcion || proyecto.descripcion
    proyecto.fechaEntrega = req.body.fechaEntrega || proyecto.fechaEntrega
    proyecto.cliente = req.body.cliente || proyecto.cliente

    try {
        const proyectoAlmacenado = await proyecto.save()
        res.json(proyectoAlmacenado)
    } catch (error) {
        console.log(error)
    }
}

//eliminar un proyecto
const eliminarProyecto = async (req, res) =>{
    const {id} = req.params
    const proyecto = await Proyecto.findById(id)    //busco en la db el primer proyecto que encuentre con el id que le esto pasando

    if(!proyecto){
        const error = new Error("No Encontrado")
        return res.status(404).json({msg: error.message })
    }
    if(proyecto.creador.toString() !== req.usuario._id.toString()){ //verifico si el creador es distinto al id de user, si no lo es, aviso que no tiene acceso a ese proyecto, ya que no le pertenece
        const error = new Error("Accion no Valida")
        return res.status(401).json({msg: error.message })
    }
    try {
        await proyecto.deleteOne();
        res.json({msg: "Proyecto eliminado"})
    } catch (error) {
        console.log(error)
    }

}

//buscar colaborador
const buscarColaborador = async (req, res) =>{
    const { email } = req.body

    const usuario = await Usuario.findOne({email}).select('-confirmado -createdAt -password -token -updatedAt -__v ')

    if(!usuario){
        const error = new Error('Usuario no encontrado')
        return res.status(404).json({msg: error.message})
    }

    res.json(usuario)

}

//agregar colaborador
const agregarColaborador = async (req, res) =>{
    const proyecto = await Proyecto.findById(req.params.id);

    if(!proyecto) {
        const error = new Error('Proyecto no encontrado')
        return res.status(404).json({msg: error.message})
    }

    if(proyecto.creador.toString() !== req.usuario._id.toString()){
        const error = new Error('Accion no valida')
        return res.status(404).json({msg: error.message})
    }
    
    const { email } = req.body

    const usuario = await Usuario.findOne({email}).select('-confirmado -createdAt -password -token -updatedAt -__v ')

    if(!usuario){
        const error = new Error('Usuario no encontrado')
        return res.status(404).json({msg: error.message})
    }

    //res.json(usuario)

    //el colaborador no es el admin del proyecto
    if(proyecto.creador.toString() === usuario._id.toString()){
        const error = new Error('El creador del proyecto no puede ser colaborador')
        return res.status(404).json({msg: error.message})
    }

    //revisar que no este agregado al proyecto el colaborador
    if(proyecto.colaboradores.includes(usuario._id)){
        const error = new Error('El usuario ya pertenece al proyecto')
        return res.status(404).json({msg: error.message})
    }

    //si esta todo bien ya podemos agregar al usuario
    proyecto.colaboradores.push(usuario._id)
    await proyecto.save()
    res.json({msg: 'Colaborador agregado correctamente'})

}

//eliminar un colaborador
const eliminarColaborador = async (req, res) =>{

}

//obtener tareas
const obtenerTareas = async (req, res) =>{
    //a esta endpoint lo hacemos directamente en obteneres poryecto
}

export {
 obtenerProyectos,
 nuevoProyecto,
 obtenerProyecto,
 editarProyecto,
 eliminarProyecto,
 agregarColaborador,
 eliminarColaborador,
 obtenerTareas,
 buscarColaborador
}