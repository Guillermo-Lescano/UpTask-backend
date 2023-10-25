import express from 'express'
import {agregarTarea,
    obtenerTarea,
    actualizarTarea,
    eliminarTarea,
    cambiarEstado} from '../controllers/tareaController.js'
import checkAouth from '../middleware/checkAuth.js'


const router = express.Router()

router.post('/', checkAouth, agregarTarea)
router
    .route('/:id')
    .get(checkAouth, obtenerTarea)
    .put(checkAouth, actualizarTarea)
    .delete(checkAouth, eliminarTarea)

    router.post('/estado/:id',checkAouth, cambiarEstado)

export default router