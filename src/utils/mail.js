import { text } from "express";
import Mailgen from "mailgen";
import nodemailer from "nodemailer";

// Configure mailgen by setting a theme and your product info
// var mailGenerator = new Mailgen({
//     theme: 'cerberus',
//     // product: {
//     //     // Appears in header & footer of e-mails
//     //     name: 'Mailgen',
//     //     link: 'https://mailgen.js/'
//     //     // Optional product logo
//     //     // logo: 'https://mailgen.js/img/logo.png'
//     // }
// });

async function sendMail(options) {
    const mailGenerator = new Mailgen({
    theme: 'cerberus',
    product: {
        name: 'Task Manager',
        link: 'https://taskmanagerlink.com'

    }
    });

    console.log("OPTIONS CONTENT: ", options)
    const emailTextual = mailGenerator.generatePlaintext(options.content)
    const emailHTML = mailGenerator.generate(options.content)

    var transport = nodemailer.createTransport({
        host: process.env.MAIL_TRAP_HOST,
        port: process.env.MAIL_TRAP_PORT,
        auth: {
            user: process.env.MAIL_TRAP_AUTH_USER,
            pass: process.env.MAIL_TRAP_AUTH_PASS
            }
        });

    const mail = {
        from: "mail.taskmanager@example.com",
        to: options.email,
        subject: options.subject,
        text: emailTextual,
        html: emailHTML
    }

    try {
        await transport.sendMail(mail)
        console.log("Email sent");
    } catch (err) {
        console.log("Error sending email: Check Credentials (maybe wrong)")        
        console.log("ERROR: ", err)
    }
}

const generateVerificationMail = (username, verificationURL) => {
    var email = {
        body: {
            name: username,
            intro: 'Welcome to PMA! We\'re very excited to have you on board.',
            action: {
                instructions: 'To get verified, please click here:',
                button: {
                    color: '#22BC66', // Optional action button color
                    text: 'Confirm your account',
                    link: `${verificationURL}`
                }
            },
            outro: 'Need help, or have questions? Just reply to this email, we\'d love to help.'
        }
    };

    return email 
}

const generateResetPasswordMail = (username, resetPasswordURL) => {
    var email = {
        body: {
            name: username,
            intro: 'We are so sorry to hear that you are having trouble signing into your acc',
            action: {
                instructions: 'To reset password, please click here:',
                button: {
                    color: '#22BC66', // Optional action button color
                    text: 'reset password',
                    link: resetPasswordURL
                }
            },
            outro: 'Need help, or have questions? Just reply to this email, we\'d love to help.'
        }
    };

    return email 
}


export {
    generateVerificationMail,
    generateResetPasswordMail,
    sendMail
}
