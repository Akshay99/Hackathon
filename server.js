var express = require('express')
var app = express()
const mail = require('./src/mail');
var https = require('https');
var bodyParser = require('body-parser')
const request = require('request');

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
  const domain = 'https://www.fast2sms.com';
  const auth = 'gI8vVMt340xo1RkeADHzPNZYCKBabSOlwcfELm7ph9dsQFn6TGg0j9VxG6c7bCl5nTKqukvzUe2rDAs1';
  const message = 'Dear Customer, Transaction XXXXXX is processed successfully. please collect the document from the branch';
  const fetchDatafromlocalDbUrl = 'http://localhost:3001/clients/' + req.body.customerId;

  request(fetchDatafromlocalDbUrl, function (error, response, body) {
    const contactNo = JSON.parse(body).phone;
    console.log('Contact No ', contactNo);
    const smsurl = `${domain}/dev/bulk?authorization=${auth}&sender_id=FSTSMS&message=${message}&language=english&route=p&numbers=${contactNo}`;
    request(smsurl, function (error, response, body) {
      console.error('error:', error); // Print the error if one occurred
      console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
      console.log('body:', body); // Print the HTML for the Google homepage.
      res.status(200).json({ success: true, msg: 'SMS sent Successfully' });
    });
  });



})

app.listen(3000, () => console.log(`Hello world app listening on port 3000!`))