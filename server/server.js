import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';
import fileUpload from 'express-fileupload';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import * as https from 'https';
import { Server } from "socket.io";
const privateKey  = fs.readFileSync('sslcert/lab3.key', 'utf8');
const certificate = fs.readFileSync('sslcert/lab3.crt', 'utf8');
const credentials = {key: privateKey, cert: certificate};

import express from 'express';
const app = express();
app.use(
    cors({
        origin: 'https://localhost:4200',
        //origin: 'https://10.25.40.9:4200',
        credentials: true,
        optionSuccessStatus: 200,
    })
);
app.use(cookieParser());
app.use('/public', express.static(path.join(path.dirname(fileURLToPath(import.meta.url)), '../public')));
app.set('views', './views');
app.set('view engine', 'pug');
app.use(express.urlencoded({ extended: true }));
app.use(fileUpload({
    createParentPath: true
}));
import adminRoutes from './routes.js';
import socialNetworkRoutes from './socialNetworkRoutes.js';
app.use("/", adminRoutes);
app.use("/socialNetwork", socialNetworkRoutes);

const httpsServer = https.createServer(credentials, app);

const io = new Server(httpsServer, {
    cors: {
      origin: 'https://localhost:4200',
      //origin: 'https://10.25.40.9:4200',
      methods: ["GET", "POST"],
      credentials: true,
    }});

io.on('connection', (socket) => {
    socket.on("send post", (post) => {
        io.emit("recieve post", post);
    });
    socket.on("send message", (message) => {
        io.emit("recieve message", message);
    });
});

httpsServer.listen(3000);