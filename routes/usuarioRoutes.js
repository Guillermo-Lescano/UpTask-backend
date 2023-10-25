import express from "express";

const router = express.Router(); //en el router es donde podemos usar , get, put, post, delete

//Segunda parte con controladores ya
/* import { usuarios, creandoUsuario } from '../controllers/usuarioController.js'

router.get('/confirmado', usuarios);
router.post('/confirmado', creandoUsuario); */


//Primer parte sin controladores
/* router.post('/', (req, res) => {
  res.send("Corriendo desde POST /API/USUARIOS");
});

router.put('/', (req, res) => {
  res.send("Corriendo desde PUT /API/USUARIOS");
});

router.delete('/', (req, res) => {
  res.send("Corriendo desde DELETE /API/USUARIOS");
}); */

//Autenticacion, Regristro y confirmaicon de usuarios
import {registrar, autenticar, confirmar, olvidePassword, comprobarToken, nuevoPassword, perfil} from '../controllers/usuarioController.js'
import checkAouth from "../middleware/checkAuth.js";

router.post('/', registrar); //crea un nuevo usuario

//creamos una nueva ruta endpoint para autenticacion
router.post('/login', autenticar)

//crear una ruta para confirmar el token dinamico
router.get('/confirmar/:token', confirmar)

//creamos una ruta para poder recuperar la pass
router.post('/olvide-password', olvidePassword) //es post porque mandamos el email y vemos si existe , si esta confirmado, si es asi mandamos el token para cambiarla
/* 
//ruta para validar el token envidado al cambiar la pass
router.get('/olvide-password/:token', comprobarToken)
//para generar el nuevo Password
router.post('/olvide-password/:token', nuevoPassword) */

//como tenemos dos rutas que apuntan a una misma url podemos hacer
router.route('/olvide-password/:token').get(comprobarToken).post(nuevoPassword)

//creamos esta ruta para proteger, en el checkaouth ponemos el codigo para protegener las rutas
router.get('/perfil', checkAouth, perfil)
//checkAuth es un middlare porque ahi dentro que el token sea valido, que el usuario sea valido, etc un middleware es una ejecucion de linea por linea

export default router;
