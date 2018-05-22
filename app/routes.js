module.exports = function(app, passport) {
var sha1 = require('js-sha1');

// normal routes ===============================================================
const Pval = 73;
const Gval = 5;
const private_key = 6;
global.symetricKey = 0;
global.serverPrivateKey = private_key;
global.PrimeVal = Pval;

const computePublicValues = function(p_v, g_v, key)
{
  return Math.pow(g_v, key) % p_v;
}

const gServerPublicKey = computePublicValues(Pval, Gval, private_key);

    // show the home page (will also have our login links)
    app.get('/', function(req, res) {
        req.session['publickey'] = 'Dancing';
        console.log(req.session.publickey);
        res.render('index.ejs', {
            PrimeVal:Pval,
            Gval:Gval,
            serverPublicKey:gServerPublicKey,
            serverPrivateKey:private_key
        });
    });

    // PROFILE SECTION =========================
    app.get('/profile', isLoggedIn, function(req, res) {
        res.render('profile.ejs', {
            user : req.user
        });
    });

    // LOGOUT ==============================
    app.get('/logout', function(req, res) {
        req.logout();
        res.redirect('/');
    });

// =============================================================================
// AUTHENTICATE (FIRST LOGIN) ==================================================
// =============================================================================
//ba7f4d6ba913418ad89683542a169a6c29ec3536
// chrome "66efe5dc644e29bce703828d3c16a002cd0a38eb"
// safari "befa1619249ff1fd5994e949347eeff2ee06c412"
// firefox "a6d73be650345f87b9ccb83fef4665d51b200989"
var log_chrome  = "df5bdd56c2823a59f9bbf11ebb4ff7fb37b2c911";
                   
var log_safari  = "1ef21db5041c88908f9b4275ee69d8c5056adb57";
var log_firefox = "51f072d112758f34d830f63b085b6a035ebf8df0";
                   
var logh_chrome  = sha1(log_chrome+"49");
var logh_safari  = sha1(log_safari+"49");
var logh_firefox = sha1(log_firefox+"49");

    // locally --------------------------------
        // LOGIN ===============================
        // show the login form
        app.get('/login', function(req, res) {
            res.render('login.ejs', { 
                message: req.flash('loginMessage'),
                integrityVal: logh_chrome+"|"+logh_safari+"|"+logh_firefox});
                //integrityVal: log_chrome+"|"+log_safari+"|"+log_firefox});
            
        });

        // process the login form
        app.post('/login', passport.authenticate('local-login', {
            successRedirect : '/profile', // redirect to the secure profile section
            failureRedirect : '/login', // redirect back to the signup page if there is an error
            failureFlash : true // allow flash messages
        }));

        // SIGNUP =================================
        // show the signup form
        app.get('/signup', function(req, res) {
            res.render('signup.ejs', { message: req.flash('signupMessage') });
        });

        // process the signup form
        app.post('/signup', passport.authenticate('local-signup', {
            successRedirect : '/profile', // redirect to the secure profile section
            failureRedirect : '/signup', // redirect back to the signup page if there is an error
            failureFlash : true // allow flash messages
        }));


// =============================================================================
// AUTHORIZE (ALREADY LOGGED IN / CONNECTING OTHER SOCIAL ACCOUNT) =============
// =============================================================================

    // locally --------------------------------
        app.get('/connect/local', function(req, res) {
            res.render('connect-local.ejs', { message: req.flash('loginMessage') });
        });
        app.post('/connect/local', passport.authenticate('local-signup', {
            successRedirect : '/profile', // redirect to the secure profile section
            failureRedirect : '/connect/local', // redirect back to the signup page if there is an error
            failureFlash : true // allow flash messages
        }));








// =============================================================================
// UNLINK ACCOUNTS =============================================================
// =============================================================================
// used to unlink accounts. for social accounts, just remove the token
// for local account, remove email and password
// user account will stay active in case they want to reconnect in the future

    // local -----------------------------------
    app.get('/unlink/local', isLoggedIn, function(req, res) {
        var user            = req.user;
        user.local.email    = undefined;
        user.local.password = undefined;
        user.save(function(err) {
            res.redirect('/profile');
        });
    });


};

// route middleware to ensure user is logged in
function isLoggedIn(req, res, next) {
    if (req.isAuthenticated())
        return next();

    res.redirect('/');
}
