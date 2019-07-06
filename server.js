'use strict';
const express = require('express');
const helmet = require('helmet');
const app = express();
const compression = require('compression');
const serveStatic = require('serve-static');
const jsonParser = express.json();
const session = require('cookie-session');
const config = require('./config');
const crypto = require('crypto');
const xlsx = require('node-xlsx').default;
const pgp = require('pg-promise')();
const db = pgp(config.path);
app.use(compression());
app.use(serveStatic(__dirname + "/dist"));
app.use(helmet());

app.use(session({
    name: 'session',
    keys: [config.cookieKey1, config.cookieKey2],
    cookie: {
        secure: true,
        path: '/'
    },
    maxAge: 24 * 60 * 60 * 1000
}));

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

function getConsolidatedReport(keys) {
    let tmp = [['']];
    if (sheet[sheet.length - 1].user !== undefined)
        sheet.splice(sheet.length - 1, 1);
    for (let i = 0; i < sheet.length; i++)
        for (let j = 0; j < sheet[i].data.length; j++)
            if (keys.includes(sheet[i].data[j][0])) tmp.push(sheet[i].data[j]);
    sheet.splice(0, 0, {
        name: 'Сводный отчёт',
        data: tmp
    });
}

const sheet = parsit('1');
let keys = ['к2', 'к14', 'к29', 'к30', 'один', 'два', 'и снова', 'хех'];

getConsolidatedReport(keys);

app.post('/', (req, res) => {
    if (sheet[sheet.length - 1].user === undefined)
        sheet.push({user: req.session.message});
    else sheet[sheet.length - 1] = {user: req.session.message};
    res.send(sheet)
});

app.post('/login', jsonParser, (req, res) => {
    let password = req.body.password;
    let hashedPass = crypto.createHmac('sha1', config.passKey)
        .update(password)
        .digest('hex');

    console.log(req.body);
    db.one("SELECT pass FROM accounts WHERE login = $1", req.body.login)
        .then(data => {
            let {pass} = data;
            if (hashedPass === pass) {
                req.session.message = req.body.login;
                res.json({"auth": true, "user": req.body.login})
            }
        })
        .catch(err => {
            res.json({"auth": "false"})
        })
});

app.post('/admin', (req, res) => {
    if (req.session.message !== undefined)
        db.one("SELECT userrole FROM accounts WHERE login = $1", [req.session.message])
            .then(result => {
                if (result.userrole === "Админ") {
                    res.json({"admin": "true"});
                } else res.json({"admin": false})
            })
            .catch(err => {
                console.log(err)
            });
    else res.json({"admin": false})
});

app.post('/admin/getkrits', (req, res) => {
    res.json(getRows(sheet[0].data));
});

app.post('/admin/save', jsonParser, (req, res) => {
    // console.log(req.body);
    if (sheet[0].name === "Сводный отчёт") sheet.splice(0, 1);
    getConsolidatedReport(req.body.data);
    res.json({"saved": true})
});

app.post('/admin/newuser', jsonParser, (req, res) => {
    let password = req.body.pass;
    let hashedPass = crypto.createHmac('sha1', config.passKey)
        .update(password)
        .digest('hex');
    // console.log(req.body);

    db.none("INSERT INTO accounts VALUES ($1, $2, $3)", [req.body.login, hashedPass, req.body.role])
        .then(() => {
            res.json({"userAdded": true})
        })
        .catch(err => {
            console.log(err)
        });
});

const port = 8001;
app.listen(port, () => {
    console.log(`Server running at http://127.0.0.1:${port} (http://localhost:${port})`);
});
