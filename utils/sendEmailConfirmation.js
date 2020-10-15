import nodemailer from "nodemailer";

export default async (data) => {
  const { name, email, phone, postCode, message } = data;

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.GOOGLE_EMAIL_FROM,
      pass: process.env.GOOGLE_EMAIL_PASSWORD,
    },
  });

  const emailData = {
    from: process.env.GOOGLE_EMAIL_FROM,
    to: email,
    subject: "Bekreftelse på sending av kontaktskjema",
    html: `<b>Data sendt</b><br /><br /><b>Navn:</b> ${name}<br /><b>E-post:</b> ${email}<br /><b>Telefon:</b> ${phone}<br /><b>Postnummer:</b> ${postCode}<br /><b>Kommentar:</b> ${message}`,
  };

  await transporter.sendMail(emailData);
};
