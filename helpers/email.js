//vamos a colocar todos los emails, que van a ser dos, olvide, reset y el de confirmar

import nodemailer from "nodemailer";

export const emailRegistro = async(datos) => {
  const { email, nombre, token } = datos;

  //creamos esto que lo sacamos de mailtrap, con sis credenciales
  const transport = nodemailer.createTransport({
    host: "sandbox.smtp.mailtrap.io",
    port: 2525,
    auth: {
      user: "60651dbe778ba4",
      pass: "fef64292443c57",
    },
  });

  //Informacion del email

  const info = await transport.sendMail({ //sendmail envia el mail una vez configurado todo
    from: '"UpTask - Administrador de proyecto" <cuentas@uptask.com>',
    to: email,
    subject: 'UpTask - Confirma tu cuenta',
    text: "Comprueba tu cuenta en UpTask",
    html: `<p>Hola: ${nombre} comprueba tu cuenta en UpTask</p>

    <p>Tu cuenta ya esta casi lista, solo debes comprobarla en el siguiente enlace</p>
    
    <a href="${process.env.FRONTEND_URL}/confirmar-cuenta/${token}">Comprobar cuenta</a>

    <p>Si tu no creaste esta cuenta puedes ignorar este email</p>
    `
  })
};
