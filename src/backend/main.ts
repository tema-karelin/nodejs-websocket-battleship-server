import { httpServer } from "./http-server";
import { WebSocketServer, WebSocket } from "ws";
import { handler, updateWinners } from "./handler";
import { readDb } from "./utils/db-functions";
import { dbI } from "./models/types-users-db";
import { wsClients } from "./models/game-objects";

const PORT = 8321;
const WEB_SOCKET_PORT = 3000;

const port: number = WEB_SOCKET_PORT;

// Read db file
export let DB: dbI;
readDb()
  .then((database) => {
    DB = database;
    console.log("Database content: ", DB);
  })
  .catch((err: Error) => console.error(err.message));

// Start HTTP server
httpServer.listen(PORT);
console.log(` --- HTTP Server started on ${PORT}`);

  
// Start WebSocketServer

let wsClientId: number = 0;
export const wss = new WebSocketServer({ port });
wss.on("connection", (ws) => {

  const wsId: string = (wsClientId + 1).toString();
  wsClientId++;

  wsClients[wsId] = {socket: ws};
  console.log(`WebSocket client ${wsId} connected!`)

  console.log("WS connected!");
  ws.on("message", (msg) => handler(msg, ws, wsId));

  ws.on('close', () => {
    delete wsClients[wsId];
    console.log(`WebSocket client ${wsId} disconnected!`);
  })
});

