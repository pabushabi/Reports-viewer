'use strict';
const express = require('express');
const helmet = require('helmet');
const app = express();
const compression = require('compression');
const serveStatic = require('serve-static');
const jsonParser = express.json();
const config = require('./config');
const crypto = require('crypto');
const xlsx = require('node-xlsx').default;
const pgp = require('pg-promise')();
const db = pgp(config.path);
const jwt = require('jsonwebtoken');
app.use(compression());
app.use(serveStatic(__dirname + "/dist"));
app.use(helmet());

app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
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

const sheet = parsit(config.file);
let userRoles = config.roles;
getConsolidatedReport(config.keys);

app.post('/', (req, res) => {
    console.log(req.headers);
    res.json(sheet)
});

app.post('/login', jsonParser, (req, res) => {
    let password = req.body.password;
    let hashedPass = crypto.createHmac('sha1', config.passKey)
        .update(password)
        .digest('hex');

    console.log(req.body);
    db.one("SELECT pass, userrole FROM accounts WHERE login = $1", req.body.login)
        .then(async data => {
            let {pass, userrole} = data;
            let isAuth = hashedPass === pass;
            let isAdmin = userrole === 'Админ';
            let token = jwt.sign({login: req.body.login, role: userrole}, config.passKey, {expiresIn: '12h'});
            res.json({"auth": isAuth, "admin": isAdmin, "token": token})
        })
        .catch(err => {
            res.json({"auth": false})
        })
});

app.get('/admin/roles', (req, res) => {
    res.json(userRoles);
});

app.get('/admin/krits', (req, res) => {
    res.json(getRows(sheet[0].data));
});

app.get('/admin/users', (req, res) => {
    db.any("SELECT login, userrole FROM accounts")
        .then(r => {
            res.json(r)
        })
        .catch(err => {
            console.log(err)
        })
});

app.post('/admin/save', jsonParser, (req, res) => {
    if (sheet[0].name === "Сводный отчёт") sheet.splice(0, 1);
    getConsolidatedReport(req.body.data);
    res.json({"saved": true})
});

app.post('/admin/newuser', jsonParser, (req, res) => {
    let password = req.body.pass;
    let hashedPass = crypto.createHmac('sha1', config.passKey)
        .update(password)
        .digest('hex');

    db.none("INSERT INTO accounts VALUES ($1, $2, $3)", [req.body.login, hashedPass, req.body.role])
        .then(() => {
            res.json({"userAdded": true})
        })
        .catch(err => {
            console.log(err)
        });
});

app.listen(config.port, () => {
    console.log(`Server running at http://127.0.0.1:${config.port} (http://localhost:${config.port})`);
});
