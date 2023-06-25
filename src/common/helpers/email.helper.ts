const sendgrid = require("@sendgrid/mail");
/**
 * A helper class for sending emails using the SendGrid API.
 */
export class EmailHelper {
  private client;

  constructor() {
    this.client = sendgrid.setApiKey(process.env.SENDGRID_API_KEY);
  }

  async sendForgotPasswordEmail(email: string, url: string, name: string) {
    const html = `<p style = "text-align:'right';font-size:'25px'">לחץ על הכפתור לאיפוס הסיסמה:</p><a href=${url}>אפס סיסמה</a>`;
    var mailOptions = {
      from: `PieChat <nir@techpartners.co.il>`, // sender address
      to: email,
      subject: "לינק לאיפוס סיסמה ",
      html: html,
      template: "email",
      context: {
        name,
        url,
      },
    };

    try {
      const info = await sendgrid.send(mailOptions);

      console.log("Message sent: " + info);
    } catch (error) {
      console.error(error);
      if (error.response) {
        console.error(error.response.body);
      }
    }
  }
}
