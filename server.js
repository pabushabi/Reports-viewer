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
const fs = require('fs');
app.use(compression());
app.use(helmet());
app.use(serveStatic(__dirname + "/dist"));

app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    next();
});

function parsit(file) {
    return xlsx.parse(`${file}.xlsx`)
}

function getRows() {
    let depts = config.depts;
    if (depts[0] !== "Свод") depts.splice(0, 0, "Свод");
    let rows = [depts];
    rows.push(config.keys);
    return rows;
}

function getConsolidatedReport(keys) {
    let tmp = [['']];
    for (let i = 0; i < sheet.length; i++)
        if (sheet[i].name.includes("Свод") || sheet[i].name.includes("свод"))
            for (let j = 0; j < sheet[i].data.length; j++)
                if (keys.includes(sheet[i].data[j][0])) tmp.push(sheet[i].data[j]);
    sheet.splice(0, 0, {
        name: 'Сводный отчёт',
        data: tmp
    });
}

function getPartialReport(name, keys) {
    let tmp = [[""]];
    let tmp2 = [[""]];

    sheet.forEach(item => {     //Выбираем нужный лист
        if (name.includes(item.name))
            for (let i = 0; i < item.data.length; i++)
                if (keys.includes(item.data[i][0])) tmp.push(item.data[i]);
    });

    tmp.sort();

    for (let i = 2; i < tmp.length; i++)    //Суммируем всё
        if (tmp[i][0] === tmp[i - 1][0])
            for (let j = 1; j < tmp[i].length; j++)
                if (tmp[i][j] === undefined) tmp[i][j] = tmp[i - 1][j];
                else tmp[i][j] += tmp[i - 1][j];
    for (let i = 2; i <= tmp.length - 1; i++)   //Выбираем нужные строки
        if (i !== tmp.length - 1) {
            if ((tmp[i][0] === tmp[i - 1][0] && tmp[i][0] !== tmp[i + 1][0]) ||
                (tmp[i][0] !== tmp[i - 1][0] && tmp[i][0] !== tmp[i + 1][0]))
                tmp2.push(tmp[i]);
            if ((i - 1 === 1) && tmp[i - 1][0] !== tmp[i][0])
                tmp2.push(tmp[i - 1]);
        } else
            tmp2.push(tmp[i]);
    sheet.splice(0, 0, {
        name: `Свод ${name}`,
        data: tmp2
    });
}

const sheet = parsit(config.file);
let userRoles = config.roles;
const getReports = () => {
    for (let i = config.keys.length - 2; i >= 0; i--)
        getPartialReport(config.depts[i], config.keys[i + 1]);
    getConsolidatedReport(config.keys[0]);
    console.log(`get`);
};
getReports();

app.post('/', async (req, res) => {
    console.log(`'/' - ${req.headers.authorization}`);
    await getReports();
    jwt.verify(req.headers.authorization, config.passKey, (err, decoded) => {
        if (err) {
            console.log(err);
            // res.json({auth: false})
        } else {
            console.log(decoded);
            // if (decoded.role === "Админ" || decoded.role === "Ген. директор")
            // res.json({auth: false})
            //     res.json(sheet)
        }
    });
    await res.json(sheet)
});

app.post('/login', jsonParser, (req, res) => {
    let password = req.body.password;
    let hashedPass = crypto.createHmac('sha1', config.passKey)
        .update(password)
        .digest('hex');

    db.one("SELECT pass, userrole FROM accounts WHERE login = $1", req.body.login)
        .then(data => {
            let {pass, userrole} = data;
            let isAuth = hashedPass === pass;
            let isAdmin = userrole === 'Админ';
            let token = jwt.sign({login: req.body.login, role: userrole}, config.passKey, {expiresIn: '12h'});
            console.log(`'/login' generated - ${token} - ${isAuth}`);
            res.json({"auth": isAuth, "admin": isAdmin, "token": token})
        })
        .catch(err => {
            res.json({"auth": false})
        })
});

app.get('/admin/roles', (req, res) => {
    res.json(userRoles);
});

app.get('/admin/criteria', (req, res) => {
    console.log(`-----${sheet[1].name}`);
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

app.get('/admin/config', (req, res) => {
    res.json({"depts": config.depts, "keys": config.keys, "roles": config.roles})
});

app.post('/admin/config', jsonParser, (req, res) => {
    // console.log(req.body);
    config.roles = req.body.roles;
    res.json({tr: true})
});

app.post('/admin/save', jsonParser, (req, res) => {
    // console.log(req.body);
    // console.log(req.body.data.length);
    if (sheet[0].name === "Сводный отчёт") sheet.splice(0, 1);
    for (let i = 0; i < sheet.length; i++)
        if (sheet[0].name.includes("Свод") || sheet[i].name.includes("свод"))
            sheet.splice(0, 1);
    console.log(req.body.data[0]);
    for (let i = 1; i < req.body.data.length; i++)
        getPartialReport(config.depts[i], req.body.data[i]);
    getConsolidatedReport(req.body.data[0]);
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


process.stdin.resume();     //cleanup before closing

function exitHandler(options, exitCode) {
    if (options.cleanup) {
        fs.writeFileSync('config.json', JSON.stringify(config, null, 2));
        console.log('Config saved');
    }
    if (exitCode || exitCode === 0) console.log(`Exit code: ${exitCode}`);
    if (options.exit) process.exit();
}

process.on('exit', exitHandler.bind(null, {cleanup: true}));

//catches ctrl+c event
process.on('SIGINT', exitHandler.bind(null, {exit: true}));

// catches "kill pid" (for example: nodemon restart)
process.on('SIGUSR1', exitHandler.bind(null, {exit: true}));
process.on('SIGUSR2', exitHandler.bind(null, {exit: true}));

//catches uncaught exceptions
process.on('uncaughtException', exitHandler.bind(null, {exit: true}));
