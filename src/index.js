const path = require('path');
const express = require('express');
const morgan = require('morgan');
const { engine } = require('express-handlebars');
const methodOverride = require('method-override');
const session = require('express-session')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const app = express();
const port = 8888;

const route = require('./routers');
const db = require('./config/db');

db.connect();

app.use(express.static(path.join(__dirname, 'public')));

app.use(
    express.urlencoded({
        extended: true,
    }),
);
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(cookieParser("secret"));
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true,
    cookie: {maxAge: null}}))

app.use(morgan('combined'));
app.use(methodOverride('_method'))

app.use((req, res, next)=>{
    res.locals.message= req.session.message;
    delete req.session.message;
    next()
})
//Template engine
app.engine(
    'hbs',
    engine({
        extname: '.hbs',
    }),
);
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'resources','views'));

//Route init
route(app);

app.listen(port, () => {
    console.log(`Library listening on port ${port}`);
});
