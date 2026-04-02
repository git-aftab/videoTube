import Mailgen from "mailgen";
import nodeMailer from "nodemailer";
import nodemon from "nodemon";

const sendEmail = async (options) => {
  const mailGenerator = new Mailgen({
    theme: "default",
    product: {
      name: "VideoTube",
      link: "https://videoTubelink.com",
    },
  });

  // Does not support Html
  const emailTextual = mailGenerator.generatePlaintext(options.mailgenContent);

  // Supports Html
  const emailHtml = mailGenerator.generate(options.mailgenContent);

  const transporter = nodeMailer.createTransport({
    host: process.env.MAILTRAP_SMTP_HOST,
    port: process.env.MAILTRAP_SMTP_PORT,
    auth: {
      user: process.env.MAILTRAP_SMTP_USER,
      pass: process.env.MAILTRAP_SMTP_PASS,
    },
  });

  const mail = {
    from: "mail.videoTube@example.com",
    to: options.email,
    subject: options.subject,
    text: emailTextual, //if not compatible with html then automatically goes for textual.
    html: emailHtml,
  };

  try {
    await transporter.sendMail(mail);
  } catch (error) {
    console.error("Email service failed!", error);
  }
};

const emailVerificationMailgenContent = (username, verificationUrl) => {
  return {
    body: {
      name: username,
      intro: "Welcome to videoTube!",
      action: {
        instructions:
          "To Verify you email Please click on the following button",
        button: {
          color: "#22BC66",
          text: "Verify Email",
          link: verificationUrl,
        },
      },
      outro:
        "Need help, or have questions? Just reply to this email, we'd love to help.",
    },
  };
};

const forgotPasswordMailgenContent = (username, PasswordResetUrl) => {
  return {
    body: {
      name: username,
      intro: "Hey! this is a password reset request mail.",
      action: {
        instructions:
          "To Reset your Password, please click the following button.",
        button: {
          color: "#22BC66",
          text: "Reset Password",
          link: PasswordResetUrl,
        },
      },
      outro:
        "Need help, or have questions? Just reply to this email, we'd love to help.",
    },
  };
};

export {
  sendEmail,
  emailVerificationMailgenContent,
  forgotPasswordMailgenContent,
};
