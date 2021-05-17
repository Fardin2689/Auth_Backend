import * as nodemailer from 'nodemailer';
import * as config from 'config';

const smtpConfig = config.get('smtp');

interface mailOptionsInterface {
  from: string;
  to: string;
  subject: string;
  text: string;
  html: string;
}

const setMailOptions = (to: string, token: string): mailOptionsInterface => {
  const link = `http://localhost:3000/resetpassword/${token}`;
  const options = {
    from: smtpConfig.user,
    to: `${to}`,
    subject: 'Reset Password',
    text: 'Do not reply to this Email.',
    html: `<b>Hey there! </b>
    <p>We received a request to reset the password for your account.<br>
    If you did not make this request then please ignore this email.</p>
    To reset your password, click on the link below:<br>
    <button>
    <a href="${link}" target="_blank">Reset Password</a>
    </button>
    <br><br>
    Or copy and paste the URL into your browser:<br>
    <a href="${link}" target="_blank">${link}</a>`,
  };
  return options;
};

const transport = nodemailer.createTransport({
  host: process.env.SMTP_HOSTNAME || smtpConfig.host,
  port: process.env.SMTP_PORT || smtpConfig.port,
  auth: {
    user: process.env.SMTP_USERNAME || smtpConfig.user,
    pass: process.env.SMTP_PASSWORD || smtpConfig.pass,
  },
});

const verify = () => {
  transport.verify(function (error, success) {
    if (error) {
      console.log(error);
    } else {
      console.log('Server is ready to take our messages ', success);
    }
  });
};

const sendEmail = async (
  mailOptions: mailOptionsInterface,
): Promise<Boolean> => {
  try {
    const info = await transport.sendMail(mailOptions);
    console.log('Email sent: %s', info.messageId);
    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
};

const exportedFunc = { sendEmail, verify, setMailOptions };

export default exportedFunc;
