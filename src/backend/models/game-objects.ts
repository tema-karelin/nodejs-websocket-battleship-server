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

export interface ship {
    position: {
        x: number,
        y: number
    },
    direction: boolean,
    type: "huge" | "large" | "medium" | "small",
    length: 1 | 2 | 3 | 4,
}


export interface playerGameI extends playerI {
    wsId: string;
    ships?: Array<ship>
}

export interface roomI {
    id: number;
    roomUsers: Array<playerGameI>
}
export interface battleshipI {
    rooms: Array<roomI>;
    games: {
        [key: number | string]: {
            [key: number | string]: playerGameI;
        }
    }
}

export const battleship: battleshipI = {
    rooms: [],
    games: {},
}
