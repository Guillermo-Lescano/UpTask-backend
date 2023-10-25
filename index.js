//const express = require('express')
import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import prueba from './prueba.js' //se aclara el js porque yo cree ese componente
import conectarDB from './config/db.js'
import usuarioRoutes from './routes/usuarioRoutes.js'
import proyectoRoutes from './routes/proyectoRoutes.js'
import tareaRoutes from './routes/tareaRoutes.js'

const app = express()
app.use(express.json())
dotenv.config()

conectarDB()

//Routing , vamos a agrupar las rutas, para usuarios, proyectos, tareas
/* app.use('/', (req, res) =>{ // cuando alguien visite la diagonal / (seria el endpoint) tenemos accesos a request y response, se puede usar app.get
    //request es lo que envias, y response es lo que recibo
    res.send('Hola mundo')  // antes de send, se puede usar un .json({msg: 'ok})
    haciendo pruebas
}) */

//Configurar cors
//creamos primero un corsList
const whiteList = [process.env.FRONTEND_URL] //aca decimos que aceptamos el dominiode localhost3000

const corsOptions = {
    origin: function(origin, callback) {
        if(whiteList.includes(origin)){
            //Puede consultar a API
            console.log(origin)
            callback(null, true)
        }else{
            //No esta permitido consulta la API
            callback(new Error('Error de Cors'))
        }
    } 
} 

app.use(cors(corsOptions))

app.use('/api/usuarios', usuarioRoutes)
app.use('/api/proyectos', proyectoRoutes)
app.use('/api/tareas', tareaRoutes)


const PORT = process.env.PORT || 4000 //si no existe esa variable de entorno, asigna el 4000

app.listen(PORT, () =>{
    console.log(`servidor corriendo en e l puerto ${PORT}`)
})