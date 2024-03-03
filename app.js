const express = require('express');
const app = express();
const path = require('path');
const session = require('express-session');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
require('dotenv').config();

app.use(express.json());

const users = [
    { user_name: "John Doe", email: "john@example.com", password: "$2b$10$e5EHfDmhUfzSOKR3pf/UE.HHVWAWXWKUMKfc9J5yCEblos/Y/Erk." }, //password123
    { user_name: "Jane Smith", email: "jane@example.com", password: "$2b$10$5OoZ16nNBsysP6M5najN.OWkolVDzOCXXc.rM6ZGRVK2NoF3Q14/y" }, //abc123
    { user_name: "Alice Wonderland", email: "alice@example.com", password: "$2b$10$BOWBjQiCVfxRb3x8v70t5OAcN1dQ2a4799Hk15D36of/qmFLYkgkq" } //qwerty
];

app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'));

//setting session details
app.use(session({
    name: "aslam",
    secret: "aslam-secret-session-key",
    saveUninitialized: true,
    resave: true,
    cookie: {
        secure: false,
        maxAge: null,
    }
}));

app.use(bodyParser.urlencoded({
    extended: true
}));

//check if there is an active session
const sessionChecker = (req, res, next) => {
    console.log(`Session Checker: ${req.session.id}`);
    console.log(req.session);
    if (req.session.profile) {
        next();
    } else {
        res.redirect('/');
    }
};

// Login page route
app.get('/', (req, res) => {
    if (req.session && req.session.profile) {
        res.redirect('/home');
    } else {
        res.render(path.join(__dirname, 'views', 'login.ejs'), { errorMessage: '' });
    }
});

// form submit
app.post('/login', async (req, res) => {
    const { email, password } = req.body;
    const user = users.find(u => u.email === email);

    if (user && await bcrypt.compare(password, user.password)) {
        req.session.profile = user;
        res.redirect('/home');
    } else {
        req.session.errorMessage= "Incorrect username or Password";
        res.render(path.join(__dirname, 'views', 'login.ejs'), { errorMessage: req.session.errorMessage});
    }
});

// Home page route
app.get('/home', sessionChecker, (req, res) => {
    res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");
    res.setHeader("Pragma", "no-cache"); // HTTP 1.0
    res.setHeader("Expires", "0"); // Proxies
    res.render(path.join(__dirname, 'views', 'home.ejs'), { user_name: req.session.profile.user_name, user_email: req.session.profile.email });
});

// Logout route
app.get('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.log(err);
        }
        res.redirect('/');
    });
});

// Start server
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});
