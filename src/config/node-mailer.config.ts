import nodemailer from "nodemailer";

export const transporter = nodemailer.createTransport({
    host: "poczta.o2.pl",
    port: 465,
    secure: true,
    auth: {
        user: "januszwonss@o2.pl",
        pass: "Poczta123!@#",
    },
});

export async function sendMail(addressMail: string, generatedCode: number) {
    const info = await transporter.sendMail({
        from: '"Won$$" <januszwonss@o2.pl>',
        to: addressMail,
        subject: "Password recorvery",
        text: `This is yours 6-digit generatedCode for new password generation ${generatedCode}, below is link to reset password form:`, // plain‑text body,
    });

    console.error("Message sent:", info.messageId);
}
