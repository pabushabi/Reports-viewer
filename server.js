'use strict';
const express = require('express');
const helmet = require('helmet');
// const history = require('connect-history-api-fallback');
const app = express();
const serveStatic = require('serve-static');
const jsonParser = express.json();
// const bodyParser = require('body-parser');
// const urlencodedParcer = bodyParser.urlencoded({extended: false});
const session = require('cookie-session');
const config = require('./config');
const crypto = require('crypto');
const xlsx = require('node-xlsx').default;
app.use(serveStatic(__dirname + "/dist"));
app.use(helmet());
// app.use(history({
//     verbose: true
// }));

app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

function parsit(file) {
    return xlsx.parse(`${file}.xlsx`)
}

function getRows(sheet) {
    let rows = [];
    for (let i = 0; i < sheet.length; i++) rows.push(sheet[i][0]);
    return rows;
}

const sheet = parsit('1');
// console.log(sheet[0].data);
// console.log(sheet[1].data);

app.post('/', (req, res) => {
    res.send(sheet)
});

app.post('/login', jsonParser, (req, res) => {
    let password = req.body.password;
    let hashedPass = crypto.createHmac('sha1', config.passKey)
        .update(password)
        .digest('hex');

    if (req.body.login === "admin" && req.body.password === "admin123") {
        res.json({"auth": "true" ,"admin": "true"})
    }
    else {
        res.json({"auth": "true","admin": "false"})
    }

    /*db.one("SELECT pass FROM accounts WHERE login = $1", req.body.login)
        .then((data) => {
            let {pass} = data;
            if (hashedPass === pass) {
                req.session.message = req.body.login;
                // res.redirect('profile');
            }
            else {
                // res.render('login', {errorCode: "Неправильный логин и/или пароль!"})
            }
        })
        .catch((err) => {
            // console.log(`${getTime()} ${err}`);
            console.warn(err);
            // res.render('login', {errorCode: "Неправильный логин и/или пароль!"})
        });*/
});

app.post('/admin', (req, res) => {
    res.json(getRows(sheet[0].data));
});

app.post('/admin/save', jsonParser, (req, res) => {
    console.log(req.body);
    //saving to db or smth else
});

const port = 8001;
app.listen(port, () => {
    console.log(`Server running at http://127.0.0.1:${port} (http://localhost:${port})`);
});
