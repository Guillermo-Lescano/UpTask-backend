//vamos a colocar todos los emails, que van a ser dos, olvide, reset y el de confirmar

import nodemailer from "nodemailer";

export const emailRegistro = async (datos) => {
  const { email, nombre, token } = datos;

  //creamos esto que lo sacamos de mailtrap, con sus credenciales
  const transport = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  //Informacion del email

  const info = await transport.sendMail({
    //sendmail envia el mail una vez configurado todo
    from: '"UpTask - Administrador de proyecto" <cuentas@uptask.com>',
    to: email,
    subject: "UpTask - Confirma tu cuenta",
    text: "Comprueba tu cuenta en UpTask",
    html: `<p>Hola: ${nombre} comprueba tu cuenta en UpTask</p>

    <p>Tu cuenta ya esta casi lista, solo debes comprobarla en el siguiente enlace</p>
    
    <a href="${process.env.FRONTEND_URL}/confirmar-cuenta/${token}">Comprobar cuenta</a>

    <p>Si tu no creaste esta cuenta puedes ignorar este email</p>
    `,
  });
};

export const emailOlvidePass = async (datos) => {
  const { email, nombre, token } = datos;

  //creamos esto que lo sacamos de mailtrap, con sus credenciales
  const transport = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  //Informacion del email

  const info = await transport.sendMail({
    //sendmail envia el mail una vez configurado todo
    from: '"UpTask - Administrador de proyecto" <cuentas@uptask.com>',
    to: email,
    subject: "UpTask - Restablece tu password",
    text: "Restablece tu password",
    html: `<p>Hola: ${nombre} has solicitado restablecer tus password</p>

    <p>Sigue el siguiente enlace para generar un nuevo password: </p>
    
    <a href="${process.env.FRONTEND_URL}/olvide-password/${token}">Restablecer password</a>

    <p>Si tu no solicitaste este email, puedes ignorar este mensaje</p>
    `,
  });
};
