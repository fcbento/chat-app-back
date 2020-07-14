require('./config/config');
const express = require('express');
const bodyParser = require('body-parser');
const socket = require('./socket');
const http = require('http');
const socketIo = require('socket.io');
const swaggerUi = require('swagger-ui-express')
const fs = require('fs')
const jsyaml = require('js-yaml');
const spec = fs.readFileSync('swagger.yml', 'utf8');
const swaggerDocument = jsyaml.safeLoad(spec);
const cors = require('cors')
const user = require('./routes/user');
const app = express();

app.use(bodyParser.json());
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

const server = http.createServer(app);
const io = socketIo(server);
app.use(cors())
app.use('/api/v1', user);

socket.socketServer(io, server);

module.exports = { app }