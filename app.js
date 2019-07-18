const express = require('express');
const bodyParser = require('body-parser');
const exphbs = require('express-handlebars');
const path = require('path');
const nodemailer = require('nodemailer');
const { google } = require('googleapis');
const OAuth2 = google.auth.OAuth2;
// const auth = require('oauth2');

const app = express();

// View Engiene setup
app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');

// Static Folder
app.use('/public', express.static(path.join(__dirname, 'public')));

// Body-parser Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get('/', (req, res) => {
    res.render('home');
});
app.post('/send', (req, res) => {
    const output = `
    <p>You have a new contactg request</p>
    <h3>Contact Details</h3>
    <ul>
        <li>Name: ${req.body.name}</li>
        <li>Email: ${req.body.email}</li>
        <li>Telephone: ${req.body.number}</li>
        <li>Website: ${req.body.url}</li>
    </ul>

    <h4>Message</h4>
    <p>${req.body.message}</p>
    `;

    const smtpTransport = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            type: 'OAuth2',
            user: 'divinehycenth8@gmail.com',
            clientId: '485178548243-t8qvuj59khm3bvdjc0l64qlah3q4h24h.apps.googleusercontent.com',
            clientSecret: 'mAZNplGdTMW_3fvSWhWXgxA0',
            refreshToken: '1/CNfTMHfMcvi4aUPPU7jttNQUUQRTkzTgXprIqe7YhNs',
            accessToken: 'ya29.GlxJBxFiwLzOegjBf5IcYm_ykSRBpMIUYBSmP8wqMKi_5Y3WAPP4l-8of0CAj2q-HKQvMo3spCs2e7v7p5gNjH9LKqGKgsDy9iqr7659O-0dgCP4gFsMGpPLdKMtjg'
        },
        tls: {
            rejectUnauthorized: false
        }
    });
    const mailOptions = {
        from: 'divinehycenth8@gmail.com',
        to: 'divinenature11234565@gmail.com',
        subject: 'Node.js Email with Secure OAuth',
        generateTextFromHTML: true,
        text: 'Hello world',
        html: output
    };

    smtpTransport.sendMail(mailOptions, (error, res) => {
        error
            ?
            console.log(error) :
            res.render('home', {
                msg: `<p class="msg">Message has been sent</p>`
            });
        smtpTransport.close();
    }); // That last brace is to close off our async function
});
const PORT = process.env.PORT || 9000;
app.listen(PORT, () => {
    console.log(`server started on port ${PORT}`);
});