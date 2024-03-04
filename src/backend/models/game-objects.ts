import WebSocket from "ws";
import { playerI } from "./types-msg";

// webSocket clients
interface wsClients {
  [key: string]: {
    username?: string;
    id?: number;
    socket: WebSocket;
  };
}
export const wsClients: wsClients = {};


export interface playerGameI extends playerI {
    wsId: string;
}

export interface roomI {
    id: number;
    roomUsers: Array<playerGameI>
}
export interface battleshipI {
    rooms: Array<roomI>;
    games: {
        [key: number]: {
            player1: playerI;
            player2: playerI;
        }
    }
}

export const battleship: battleshipI = {
    rooms: [],
    games: {},
}
