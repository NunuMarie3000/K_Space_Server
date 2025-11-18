// const nodemailer = require('nodemailer');
// require('dotenv').config();

// const transporter = nodemailer.createTransport({
//   host: 'smtp.gmail.com',
//   port: 465,
//   secure: true,
//   auth: {
//     user: process.env.EMAIL_USER,
//     pass: process.env.EMAIL_PASS
//   },
//   tls: {
//     rejectUnauthorized: false
//   }
// });

// // Add verification before export
// transporter.verify((error, success) => {
//   if (error) {
//     console.error('Transporter verification failed:', error);
//   } else {
//     console.log('Transporter is ready to send emails');
//   }
// });

// const sendResetEmail = async (email, resetToken) => {
//   console.log('starting sendREsetEmail')
//   console.log('Email configs: ', {
//     user: process.env.EMAIL_USER,
//     pass: process.env.EMAIL_PASS
//   });
//   const resetLink = `${process.env.WEBSITE_URL}/reset-password?token=${resetToken}&email=${encodeURIComponent(email)}`

//   try {
//     const info = await transporter.sendMail({
//       from: `"K_Space" <${process.env.EMAIL_USER}>`,
//       to: email,
//       subject: 'Password Reset - K_Space',
//       html: `
//         <p>You requested a password reset for your K_Space account.</p>
//         <p>Click the link below to reset your password:</p>
//         <a href="${resetLink}">Reset Password</a>
//         <p>This link will expire in 1 hour.</p>
//         <p>If you didn't request this reset, please ignore this email.</p>
//       `
//     });
    
//     console.log('Message sent: %s', info.messageId);
//     return true;
//   } catch (error) {
//     console.error('Detailed email error:', {
//       message: error.message,
//       code: error.code,
//       command: error.command,
//       response: error.response
//     });
//     return false;
//   }
// }

// module.exports = { sendResetEmail } 