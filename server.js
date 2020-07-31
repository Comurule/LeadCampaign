const express = require('express');
const path = require('path');
const favicon = require('serve-favicon');
const logger = require('morgan');
const bodyParser = require('body-parser');
const passport = require('passport');
const auth = require('./modules/auth.js');
const cookieParser = require('cookie-parser');
const ejsLayouts = require('express-ejs-layouts');

const env = process.env.NODE_ENV || 'development',
    config = require('./config/config.' + env);

const index = require('./routes/index');
const user = require('./routes/user');
const main = require('./routes/main');
const login = require('./routes/login');
const siteAdmin = require('./routes/siteAdmin');
const apiRoutes = require('./routes/apiRoutes');

const tools = require('./modules/tools');
const sessionManagement = require('./modules/sessionManagement');


const compression = require('compression');
const helmet = require('helmet');


const app = express();

//
// Handlebars / HBS setup and configuration
//
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.set('layout', 'layouts/main');
app.use(ejsLayouts);


//
// App level constiables initialization
//
// value to play with on request start and end
app.set('executionsThisTime', 0);
app.set('config', config);

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(cookieParser());

app.use(helmet());
app.use(compression()); // Compress all routes

app.use(express.static(path.join(__dirname, 'public')));

// session will not work for static content
app.set('trust proxy', 1) // trust first proxy
app.use(sessionManagement);
// passport initialization
auth.initializeStrategy(passport);
app.use(passport.initialize());
app.use(passport.session())
app.set('passport', passport);

//
// General toolset
//
// on request start and on request end moved after static content
app.use(tools.onRequestStart);
app.use(tools.onRequestEnd);
// generate menu of the application
app.use('/user', tools.generateUserMenu);

const isWhiteListed = ( path, whiteList = [ 'login', 'autoLogin', 'main' ] ) => {
    let whiteListed = false;
    for(let i=0; i < whiteList.length; i++) {
        // this won't check authentication for login and autoLogin
        // add logic here if you want to check POST or GET method in login
        if( path.indexOf( whiteList[ i ] ) !== -1 ) {
            whiteListed = true;
        }
    }
    return whiteListed;
};

const authenticationMiddleware = (req, res, next) => {
    
    if( isWhiteListed(req.originalUrl) || req.isAuthenticated() ) {
        console.log('You are logged in');
        return next();
    }
    console.log('You are not logged in');
    res.redirect('https://manifestusermodule.herokuapp.com/login');
};
app.use( authenticationMiddleware );

const authentication = require('./modules/authentication');

// authentication
app.post('/login',
    passport.authenticate('local', {
        failureRedirect: '/login'
    }),
    (req, res) => {
        res.redirect('/user');
    });
    

// Auto login
app.post('/autoLogin',
   authentication(),
    (req, res) => {
        res.redirect('/user');
    });


app.get('/logout',
    (req, res) => {
        req.logout();
        res.redirect('/');
    });

//
// routing
//
app.use('/', index);
app.use('/main', main);
app.use('/user', function(req, res, next) {
    if (req.isAuthenticated()) {
        next();
    } else {
        res.redirect('/login?m=not-logged-in');
    }
});

app.use('/user', user);
app.use('/siteAdmin', siteAdmin);
app.use('/login', login);
app.use('/api/v1', apiRoutes);

//
// error handling
//
// catch 404 and forward to error handler
app.use((req, res, next) => {
    const err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handler
app.use((err, req, res) => {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('pages/error');
});

module.exports = app;
