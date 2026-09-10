
const gmail = require("../utils/googleapi");

function generateRawEmail({to,subject,html}){
  const message = [
    `From: ${process.env.EMAIL_USER}`,
    `To: ${to}`,
    `Subject: ${subject}`,
    "MIME-Version: 1.0",
    "Content-Type: text/html; charset=UTF-8",
    "",
    html,
  ].join("\r\n");

  return Buffer.from(message).toString("base64url")
}

const sendEmail = async ({to,subject,html}) => {
    const content = generateRawEmail({to,subject,html})
   
    const result = await gmail.gmail.users.messages.send({
        userId : "me",
        requestBody : {
            raw : content
        }
    })
    return result.data
}

module.exports = {sendEmail}