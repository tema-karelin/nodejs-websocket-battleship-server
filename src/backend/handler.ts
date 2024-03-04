import { create, readDb } from "./utils/db-functions";
import { add_ships_ReqI, add_user_to_room_ReqI, create_game_ResI, msgI, playerI, reg_ReqI, reg_ResI, resI, roomMsgI, update_room_ResT, update_winners_ResT } from "./models/types-msg";
import { WebSocket } from "ws";
import { dbI, userT } from "./models/types-users-db";
import { DB, wss } from "./main";
import { battleship, playerGameI, roomI, wsClients } from "./models/game-objects";
import { randomizer } from "./utils/randomizer";


export const handler = (data: Buffer | ArrayBuffer | Buffer[], client: WebSocket, wsId: string) => {
  const msg: msgI = JSON.parse(data.toString("utf-8"));
  let msgData;
  if (msg.data) msgData = JSON.parse(msg.data);
  
  console.log("Message from WebSocket client: ", msg);
  console.log("msgData: ", msgData);

  switch (msg.type) {
    case "reg":
      registration(msgData, client, wsId);
      break;
    case "create_room":
      createRoom(client, wsId);
      break;
    case "add_user_to_room":
      addUserToRoom(msgData, wsId);
      break;
    case "add_ships":
      break;
    case "attack":
      break;
    case "randomAttack":
      break;

    default:
      break;
  }
};

const registration = (data: reg_ReqI, client: WebSocket, wsId: string) => {
  // if there are no this user
  const userCheck: userT | undefined = DB.users.find((el: userT) => el.username === data.name);

  let error: boolean = false;
  let errorText: string = "";
  let index: number;
  const name = data.name;

  if (userCheck === undefined) {
    const newUser: userT = {
      username: data.name,
      password: data.password,
      id: randomizer(0, 100, DB.users),
      wins: 0
    };
    DB.users.push(newUser);
    index = newUser.id;
    // write to db
    create(DB);
  } else {
    if (userCheck.password !== data.password) {
      error = true;
      errorText = "Incorrect password! Try again or create a new user ";
    }
    index = userCheck.id;
  }
  updateWinners();

  wsClients[wsId].username = name;
  wsClients[wsId].id = index;

  const resData: reg_ResI = { name, index, error, errorText };
  const response: resI = {
    type: "reg",
    data: JSON.stringify(resData),
    id: 0,
  };

  client.send(JSON.stringify(response));
};

export const updateWinners = (): void => {
  const data: update_winners_ResT = DB.users.map((user: userT) => {
    return { name: user.username, wins: user.wins }
  })
  
  const response: resI = {
    type: "update_winners",
    data: JSON.stringify(data),
    id: 0
  }
  sendMsgAll(response);
}


const sendMsgAll = (msg: resI, exceptWsId: string | undefined = undefined):void => { // sends message to all websocket clients if 2nd argument is not defined
  if (exceptWsId) {
    console.log(`Send message to all websocket clients, exept ${exceptWsId}`);
  } else console.log("Send message to all websocket clients");
  console.log("Message content: ", msg);
  for (let key in wsClients) {
    if (key !== exceptWsId) {
      wsClients[key].socket.send(JSON.stringify(msg));
    }
  } 
}

const sendMsg = (msg: resI, wsId: string) => {
  console.log(`Send message to client ${wsId}`);
  console.log("Message content: ", msg);
  wsClients[wsId].socket.send(JSON.stringify(msg));
}

const createRoom = (client: WebSocket, wsId: string) => {
  
  const roomId = randomizer(0, 100, battleship.rooms);
  const user: playerGameI = {
    name: wsClients[wsId].username,
    index: wsClients[wsId].id,
    wsId: wsId,
  }
  
  const room: roomI = {
    id: roomId,
    roomUsers: [user],
  }


  battleship.rooms.push(room);

  updateRoom(wsId);
}

const updateRoom = (wsId: string | undefined = undefined) => {
  const data: Array<roomMsgI> = battleship.rooms.map((el) => {
    return {
      roomId: el.id,
      roomUsers: el.roomUsers,
    }
  })

  const updateRoomMsg: resI = {
    type: "update_room",
    data: JSON.stringify(data),
    id: 0,
  }

  if (wsId) {
    sendMsgAll(updateRoomMsg, wsId);
  } else{
    sendMsgAll(updateRoomMsg);
  }
}


const addUserToRoom = (msg: add_user_to_room_ReqI, wsId: string) => {

  const roomId = msg.indexRoom;
  
  // add to room
  // room index
  const index = battleship.rooms.findIndex((room: roomI) => room.id === roomId);
  console.log(index);

  const idPlayer1: number | undefined | string = battleship.rooms[index].roomUsers[0].index;
  const idPlayer2: number | undefined = wsClients[wsId].id;
  const player1WsId: string = battleship.rooms[index].roomUsers[0].wsId;
  const player2WsId: string = wsId;
  const name1: string | undefined = wsClients[player1WsId].username;
  const name2: string | undefined = wsClients[wsId].username;

  const player1: playerGameI = {
    index: idPlayer1,
    wsId: player1WsId,
    name: name1
  }
  const player2: playerGameI = {
    index: idPlayer2,
    wsId: player2WsId,
    name: name2
  }


  // remove room from available rooms
  battleship.rooms.splice(index, 1);


  // create game
  createGame(player1, player2);



  //update rooms
  updateRoom();



}

const addToRoom = (roomId: number) => {
  
}

const createGame = (player1: playerGameI, player2: playerGameI) => {

  const gameIdRandomizer = (min: number, max:number): number => {
    const rand = randomizer(min, max);
    if (battleship.games[rand]) return gameIdRandomizer(min, max);
    return rand;
  }

  const idGame = gameIdRandomizer(0, 100);


  // create game in battleship object:
  battleship.games[idGame] = {
    player1,
    player2,
  }


  // send messages to clients

  const data1: create_game_ResI = {
    idGame,
    idPlayer: player1.index,
  }
  const data2: create_game_ResI = {
    idGame,
    idPlayer: player2.index,
  }

  const msg1: resI = {
    type: "create_game",
    data: JSON.stringify(data1),
    id: 0
  }
  const msg2: resI = {
    type: "create_game",
    data: JSON.stringify(data2),
    id: 0
  }
  
  sendMsg(msg1, player1.wsId);
  sendMsg(msg2, player2.wsId);

}