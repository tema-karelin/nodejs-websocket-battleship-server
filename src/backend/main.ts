import { httpServer } from "./http-server";
import { WebSocketServer, WebSocket } from "ws";
import { handler, updateWinners } from "./handler";
import { readDb } from "./utils/db-functions";
import { dbI } from "./utils/types-users-db";

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
export const wss = new WebSocketServer({ port });
wss.on("connection", (ws) => {
  console.log("WS connected!");
  ws.on("message", (msg) => handler(msg, ws));
});
