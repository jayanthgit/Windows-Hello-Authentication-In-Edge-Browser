
var email = '<%=user.email%>';
var name = '<%=user.name%>';

var userAccountInformation = {
        rpDisplayName: "fido-demo",
        displayName: email
    };

var cryptoParams = [
    {
        type: "ScopedCred",
        algorithm: "RSASSA-PKCS1-v1_5",
    }
];

function checkUser() {
        webauthn.makeCredential(userAccountInformation, cryptoParams)
        .then(function (creds) {
            alert('Yup - Same as logged in user');
            
            document.getElementById('formid').value = creds.credential.id;
            document.getElementById('formpk').value = JSON.stringify(creds.publicKey);
            document.getElementById('formemail').value = email;
            document.getElementById('formname').value = name;

            //document.getElementById('theform').submit();*/
        }).catch(function (err) {
            // No acceptable authenticator or user refused consent. Handle appropriately.
            alert('Seems to be a different guy');
            alert(err);
    });
}


var challengePromise = getChallengeFromServer();

challengePromise.then(function() {
    webauthn.getAssertion(challenge)
        .then(function(assertion) {
            document.getElementById("formid").value = assertion.credential.id;
            document.getElementById("formtype").value = assertion.credential.type;
            document.getElementById("formdata").value = assertion.clientData;
            document.getElementById("formsig").value = assertion.signature;
            document.getElementById("formauthnr").value = assertion.authenticatorData;
            document.getElementById("formchallenge").value = challenge;
            document.getElementById("theform").submit();
        })
        .catch(function(err) {
            if(err && err.name) {
                document.getElementById("formerr").value = err.name;
            } else {
                document.getElementById("formerr").value = "unknown";
            }
            document.getElementById("theform").submit();
        });  
});




