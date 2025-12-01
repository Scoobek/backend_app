import nodemailer from "nodemailer";

export const transporter = nodemailer.createTransport({
    host: process.env.SMPT_HOST,
    port: process.env.SMPT_PORT,
    secure: true,
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD,
    },
});

export async function sendMail(addressMail: string, generatedCode: number) {
    const info = await transporter.sendMail({
        from: `"Won$$" <${process.env.SMTP_USER}>`,
        to: addressMail,
        subject: "Password recorvery",
        text: `This is yours 6-digit generatedCode for new password generation ${generatedCode}, below is link to reset password form:`,
    });

    console.error("Message sent:", info.messageId);
}
