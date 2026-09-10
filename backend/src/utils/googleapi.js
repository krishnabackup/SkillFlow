const  {google} = require('googleapis')
const express = require("express")
const app = express()

const outh2client = new google.auth.OAuth2(
    process.env.CLIENT_ID,
    process.env.CLIENT_PASS,
    process.env.GMAIL_REDIRECT_URI
)

outh2client.setCredentials({
    refresh_token : process.env.GMAIL_REFRESH_TOKEN
})

const gmail = google.gmail({
    version : "v1",
    auth : outh2client
})

app.get('/test',(req,res) => {
    console.log("Hello")
})

const googleAuth = (req,res) => {
    const url = outh2client.generateAuthUrl({
        access_type : "offline",
        prompt : "consent",
        scope : [
            "https://www.googleapis.com/auth/gmail.send"
        ]
    });
    res.redirect(url)
}

const oauthCallback = async (req,res) => {
    try {
        const {code} = req.query;
        const {tokens} = await outh2client.getToken(code)

        console.log("Token :",tokens)

        res.send(
            "Google authorization successful. You can close this page."
        )
    }
    catch(error){
        console.error(error)
        res.status(500).send("Auth failed")
    }
}

module.exports = {googleAuth , oauthCallback , gmail}

