var express = require('express')
var app = express()
const mail = require('./src/mail');
var https = require('https');

app.get('/api/sendmail', function (req, res) {
  let htmlContent = `
                <h1><strong>ITS Alerting</strong></h1>
                <p>Dear User,</p>
                <p>This is Test Mail</p>
                <p> Please find your attachment for your document </p>
                <br/>
                `
  let mailOptions = {
    from: "akpatilvipl@gmail.com",
    to: "akpatilvipl@gmail.com",
    subject: "Mail Test",
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

app.post('/api/sendsms', function (req, response) {
  //https://www.fast2sms.com/dev/bulk?authorization=gI8vVMt340xo1RkeADHzPNZYCKBabSOlwcfELm7ph9dsQFn6TGg0j9VxG6c7bCl5nTKqukvzUe2rDAs1&sender_id=FSTSMS&message=This is test message&language=english&route=p&numbers=9096101957

  var options = {
    host: 'fast2sms.com',
    port: 443,
    path: '/dev/bulk/',
    method: 'GET',
    query: {
      authorization: 'gI8vVMt340xo1RkeADHzPNZYCKBabSOlwcfELm7ph9dsQFn6TGg0j9VxG6c7bCl5nTKqukvzUe2rDAs1',
      sender_id: 'FSTSMS',
      message: 'This is test SMS',
      language: 'english',
      route: 'p',
      numbers: '9096101957'
    }
  };

  var req = https.request(options, function (res) {
    res.setEncoding('utf8');
    res.on('data', function (chunk) {
      response.status(200).json({ success: true, msg: 'SMS sent Successfully' });
    });
  });

  req.on('error', function (e) {
    response.status(400).json({ success: false, msg: e });
  });

  req.write('data\n');
  req.write('data\n');
  req.end();
})

app.listen(3000, () => console.log(`Hello world app listening on port 3000!`))