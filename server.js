require('dotenv').config();
const express = require('express');
const app = express();
var exphbs  = require('express-handlebars');
const db = require('./models');
const log = console.log;
const PORT = process.env.PORT || 8080;
const passport = require('./passportAuthentication');
const authenticationRoute = require('./routes/authentication');
const apiRoutes = require('./routes/apiRoutes');
const htmlRoutes = require('./routes/htmlRoutes');
const cookieSession = require('cookie-session');


app.use(express.static('public'));

app.use(express.urlencoded({
    extended: false
}));
app.use(express.json());
app.use(cookieSession({
    maxAge: 24 * 60 * 60 * 1000, // one day in miliseconds
    name: 'session',
    keys: ['key1', 'key2']
}));
app.use(passport.initialize());
app.use(passport.session());

app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

app.use('/', authenticationRoute);
app.use('/', apiRoutes);
app.use('/', htmlRoutes);


db.sequelize.sync({  })
    .then(() => {
        log('Sequelize is starting');
        app.listen(PORT, () => log('Server is starting ', PORT));
    })
    .catch((error) => log('Sequelize error connecting ', error))