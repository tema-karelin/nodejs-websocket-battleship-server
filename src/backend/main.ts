import { httpServer } from "./http-server";
import { WebSocketServer } from "ws";

const PORT = 8321;
const WEB_SOCKET_PORT = 3000;

const port: number = WEB_SOCKET_PORT;

httpServer.listen(PORT);

const  wss = new WebSocketServer( { port } ); 

wss.on('connection', (ws) => {
    console.log('WS connected!');
    ws.on('message', (msg) => console.log(msg.toString('utf-8')));

});
