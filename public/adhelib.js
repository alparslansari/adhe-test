

$(document).ready(function() {
    console.log('0- Simple ADHE is initializing...');
    
    console.log('1- Getting "PrimeVal" from page ... ')
    if (typeof PrimeVal !== 'undefined') {
       // the variable is defined
       console.log("2.OK: PrimeVal = "+PrimeVal);
    } else {
       // the variable is not defined
       console.log("2.Warn: PrimeVal is not defined ...");
    }
    
    console.log('3- Getting "Gval" from page ... ')
    if (typeof Gval !== 'undefined') {
       // the variable is defined
       console.log("3.OK: Gval = "+Gval);
    } else {
       // the variable is not defined
       console.log("3.Warn: Gval is not defined ...");
    }
    
    if(typeof PrimeVal !== 'undefined' && typeof Gval !== 'undefined' && typeof serverPublicKey !== 'undefined')
    {
        console.log("serverPrivateKey: "+serverPrivateKey);
        console.log("serverPublicKey: "+serverPublicKey);
        var privateKey = 11; /* getRandomNumber(PrimeVal); */
        console.log('Client privateKey: '+privateKey);
        
        var clientPublicKey = computePublicValues(PrimeVal, Gval, privateKey);
        var symetricKey = computeSymetricKeys(serverPublicKey,privateKey,PrimeVal);
        
        console.log('Computation result clientPublicKey  : '+clientPublicKey);
        console.log("Symetric key: "+symetricKey);
        console.log("Symetric key server: "+computeSymetricKeys(clientPublicKey,serverPrivateKey,PrimeVal));
        $.cookie("symetricKey", symetricKey);
        $.cookie("clientPublicKey",clientPublicKey);
    } else {
        var symetricKey = $.cookie("symetricKey");
        if (symetricKey != null) { 
            console.log("Cookie->Symentric Key: "+symetricKey);
        } else {
            console.log("WARN: No value to compute key from server!");
            console.log("WARN: Symetric Key is not found in cookie!");
            alert("ERROR: Integrity is failed!");
        }
    }
    
    
    var markup = document.documentElement.innerHTML;
//alert(markup);
    
});

function getRandomNumber(prime)
{
    return Math.floor(Math.random() * 100);
}


var computePublicValues = function(p_v, g_v, key)
{
  return Math.pow(g_v, key) % p_v;
}

/*
* spk = serverPublicKey
* pk = private_key
* p_v = Pval
*/
var computeSymetricKeys = function(spk, pk, p_v)
{
  return Math.pow(spk, pk) % p_v;
}