
const gmail = require("../utils/googleapi");
function generateRawEmail({to,subject,html}){
  const message = [
    `From: SkillFlow <yourgmail@gmail.com>`,
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
    const content = generateRawEmail(to,subject,html)
   
    const result = await gmail.users.messages({
        userId : "me",
        requestBody : {
            content
        }
    }
    )
    return result.data
}

module.exports = {sendEmail}