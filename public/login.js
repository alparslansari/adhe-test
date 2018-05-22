

$(document).ready(function() {
console.log($('.integrity').val());
var integrityValOrig = $('.integrity').val();
var integrityVal = $('.integrity').val().split("|");

$('.integrity').val("");
var generatedSHA1 = sha1(document.documentElement.innerHTML);
var finalHashVal = sha1(generatedSHA1+$.cookie("symetricKey"));
console.log("generatedSHA1:"+generatedSHA1);
console.log("finalHashVal:"+finalHashVal);

var integrityCheckFlag=false;
integrityVal.forEach((hashval, index) => {
   console.log(hashval);
   if(finalHashVal == hashval)
   {
       console.log("Integrity check is successful!");
       integrityCheckFlag = true;
       alert("Integrity check is successful!");
    } 
  
});

if(!integrityCheckFlag) {
        alert("WARNING: Integrity check is failed!");
    }
    
$('.integrity').val(integrityValOrig);

$( ".btn" ).click(function() {
    var femail = $('input[name=email]').val();
    var fpassv = $('input[name=password]').val();
    var symetricKey = $.cookie("symetricKey");
    var integrityVar = "";
    if (symetricKey != null) { 
            console.log("Cookie->Symentric Key: "+symetricKey);
            integrityVar = femail + fpassv + symetricKey;
            integrityVar = sha1(integrityVar);
            $('input[name=dataintegrity]').val(integrityVar+"|"+$.cookie("clientPublicKey"));
    }
});

});

