const nodemailer = require('nodemailer')
const Email = require('email-templates')


let transporter = nodemailer.createTransport({
    host: process.env.MAIL_SENDER_HOST,
    port: process.env.MAIL_SENDER_PORT,
    secure: true,
    auth: {
        user: process.env.MAIL_SENDER_USERNAME,
        pass: process.env.MAIL_SENDER_PASSWORD
    }
});

const email = new Email({
    transport: transporter,
    preview:false,
    send:true
})

async function send() {
    try {
        // let info = await transporter.sendMail({
        //     from: '"Crit" <rajeshkhadka@incwelltechnology.com>', // sender address
        //     to: email, // list of receivers
        //     subject: "Email Verification", // Subject line
        //     text: "Hello world?", // plain text body
        //     html: "<b>Hello world?</b>" // html body
        // });
        await email.send({
            template: 'hello',
            message: {
                from: 'Rajesh Khadka <rajeshkhadka@incwelltechnology.com>',
                to: 'rajesh.k.khadka@gmail.com'
            },
            locals: {
                fname: 'Rajesh',
                lname: 'khadka'
            }
        })
    } catch (error) {
        console.log(error)
    }
}



module.exports = {
    send
}

// var host = process.env.MAIL_SENDER_HOST
// let transporter = nodemailer.createTransport({
//     host: process.env.MAIL_SENDER_HOST,
//     port: process.env.MAIL_SENDER_PORT,
//     secure: true,
//     auth: {
//         user: process.env.MAIL_SENDER_USERNAME,
//         pass: process.env.MAIL_SENDER_PASSWORD
//     }
// });
