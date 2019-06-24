'use strict';
const express = require('express');
const helmet = require('helmet');
// const history = require('connect-history-api-fallback');
const app = express();
const serveStatic = require('serve-static');
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

const port = 8001;
app.listen(port, () => {
    console.log(`Server running at http://127.0.0.1:${port} (http://localhost:${port})`);
});
