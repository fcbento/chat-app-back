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
const community = require('./routes/communities');
const userCommunity = require('./routes/user-community');
const channelCommunity = require('./routes/channels');

const app = express();

const server = http.createServer(app);
const io = socketIo(server);
const path = require('path');
app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));
app.use(cors())
app.use(bodyParser.json());
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use('/api/v1', user);
app.use('/api/v1', community);
app.use('/api/v1', userCommunity);
app.use('/api/v1', channelCommunity);

app.use("/public", express.static(path.join(__dirname, 'public')));

socket.socketServer(io, server);

module.exports = { app }