const express = require('express')
require('dotenv').config({ path: `${__dirname}/config/.env.local` });
const path = require('path');
const mail = require('./src/mail');
const https = require('https');
const bodyParser = require('body-parser')
const request = require('request');
const { Console } = require('console');
const { cookie } = require('request');
const app = express();

app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

app.get('/api/sendmail', function (req, res) {
  let htmlContent = `
                <p>Dear User,</p>
                <p>Work Item No: XXXXXX Created Successfully</p>
                <p>Please process the work item</p>
                <br/>
                `
  let mailOptions = {
    from: "akpatilvipl@gmail.com",
    to: "akpatilvipl@gmail.com",
    subject: "ITS Alert",
    text: "",
    html: htmlContent,
    //  attachment: ["/path"]
  }

  mail.sendMail(mailOptions)
    .then(function (email) {
      res.status(200).json({ success: true, msg: 'Mail sent' });
    }).catch(function (exception) {
      res.status(200).json({ success: false, msg: exception });
    });
})

app.post('/api/sendsms', function (req, res) {
  const fetchDatafromlocalDbUrl = `${process.env.dbapi}${req.body.customerId}`;
  const smsDomain = process.env.smsdomain;
  const auth = process.env.auth;
  const message = process.env.message;

  request(fetchDatafromlocalDbUrl, function (error, response, body) {
    const contactNo = JSON.parse(body).phone;
    if (!contactNo) {
      return res.status(400).json({ success: false, msg: 'No record or customer found' });
    }
    if (error) {
      return res.status(400).json({ success: false, msg: 'Error occoured in sending Message' });
    }
    const smsurl = `${smsDomain}/dev/bulk?authorization=${auth}&sender_id=FSTSMS&message=${message}&language=english&route=p&numbers=${contactNo}`;

    request(smsurl, function (error, response, body) {
      if (error) {
        return res.status(400).json({ success: false, msg: 'Error occoured in sending Message' });
      }
      res.status(200).json({ success: true, msg: 'SMS sent Successfully', info: JSON.parse(body).message });
    });
  });



})

app.listen(3000, () => console.log(`Hello world app listening on port 3000!`))