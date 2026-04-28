import nodemailer from "nodemailer";
import i18n from "../config/i18n.js";

export default class Email {
  constructor(user, locale = "en") {
    this.to = user.email;
    this.firstName = user.name.split(" ")[0];
    this.from = `${process.env.EMAIL_FROM_NAME} <${process.env.EMAIL_FROM}>`;
    this.locale = locale;
    i18n.setLocale(this.locale);
  }

  // Create transporter
  newTransport() {
    return nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      secure: false,
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD,
      },
    });
  }

  // Send Email
  async send(subject, message) {
    const mailOptions = {
      from: this.from,
      to: this.to,
      subject,
      html: message,
    };

    await this.newTransport().sendMail(mailOptions);
  }

  // Send Password Reset Code
  async sendPasswordResetCode(resetCode) {
    const subject = i18n.__("email.password_reset_subject");
    const message = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h2 style="color: #333;">${i18n.__("email.password_reset_title")}</h2>
        <p>${i18n.__("email.password_reset_greeting", {
          name: this.firstName,
        })}</p>
        <p>${i18n.__("email.password_reset_message")}</p>
        <div style="background-color: #f8f9fa; border: 2px dashed #4CAF50; border-radius: 8px; padding: 20px; text-align: center; margin: 20px 0;">
          <h1 style="color: #4CAF50; font-size: 36px; letter-spacing: 8px; margin: 0;">${resetCode}</h1>
        </div>
        <p style="color: #666;">${i18n.__("email.password_reset_expiry")}</p>
        <p>${i18n.__("email.password_reset_ignore")}</p>
        <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
        <p style="color: #999; font-size: 12px;">${i18n.__(
          "email.password_reset_regards"
        )}</p>
      </div>
    `;

    await this.send(subject, message);
  }
}
