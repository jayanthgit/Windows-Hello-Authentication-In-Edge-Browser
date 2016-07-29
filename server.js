var express = require('express');    
var app = express();
var http = require('http').Server(app);    
var path = require('path');       
var bodyParser = require('body-parser');
var crypto = require('crypto');
var jwkToPem = require('jwk-to-pem')

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var port = process.env.PORT || 8080;        // set our port

app.use(express.static(path.join(__dirname, 'app/client')));

app.use('/', function(req, res) {
    console.log('request coming in');

    if (req.method.toLowerCase() == 'get') {
        console.log('get request');
    } else if (req.method.toLowerCase() == 'post') {
        console.log('post request');
        console.log(req.body.formid);
        console.log(req.body.formpk);
        //processFormFieldsIndividual(req, res);
    }
});

http.listen(port, function () {
    console.log('listening on port ' + port);
});

function generateChallenge() {
    return generateVerifiableString(crypto.randomBytes(32));
};

function generateVerifiableString(data) {
    // Create cipher using secret
    var d = new Buffer(data);
    var c = crypto.createCipher('aes192',new Buffer(this._secret));

    // Encrypt data
    c.update(d);

    // Hash results of encrypting data
    var hash = crypto.createHash('sha256');
    hash.update(c.final());

    // Combine original data with hash
    return d.toString('hex') + string_separator + hash.digest('hex');
};

var fidoAuthenticator = {
     validateSignature: function (publicKey, clientData, 
     authnrData, signature, challenge) {
         // Make sure the challenge in the client data
         // matches the expected challenge
         var c = new Buffer(clientData, 'base64');
         var cc = JSON.parse(c.toString().replace(/\0/g,''));
         if(cc.challenge != challenge) return false;

         // Hash data with sha256
         const hash = crypto.createHash('sha256');
         hash.update(c);
         var h = hash.digest();

         // Verify signature is correct for authnrData + hash
         var verify = crypto.createVerify('RSA-SHA256');
         verify.update(new Buffer(authnrData,'base64'));
         verify.update(h);
         return verify.verify(jwkToPem(JSON.parse(publicKey)), signature, 'base64');
     }
};
