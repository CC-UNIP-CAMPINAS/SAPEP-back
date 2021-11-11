const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    host: "smtp.ethereal.email",
    port: 587,
    auth: {
        user: process.env.USER_EMAIL,
        pass: process.env.PASS_EMAIL,
    },
});

async function sendMail(to, subject, text) {
    await transporter.sendMail({
        from: '"SAPEP" <bot@sapep.com>',
        to,
        subject,
        text,
    });

    console.log("Email enviado!");
}

module.exports = sendMail;
