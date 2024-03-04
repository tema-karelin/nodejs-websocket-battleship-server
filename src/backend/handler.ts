import { create, readDb } from "./utils/db-functions";
import { msgI, reg_ReqI, reg_ResI, resI, update_winners_ResT } from "./utils/types-msg";
import { WebSocket } from "ws";
import { dbI, userT } from "./utils/types-users-db";
import { DB, wss } from "./main";

export const handler = (data: Buffer | ArrayBuffer | Buffer[], client: WebSocket) => {
  const msg: msgI = JSON.parse(data.toString("utf-8"));
  let msgData;
  if (msg.data) msgData = JSON.parse(msg.data);

  console.log("Message from WebSocket client: ", msg);

  switch (msg.type) {
    case "reg":
      registration(msgData, client);
      break;
    case "create_room":
      break;
    case "add_user_to_room":
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

const registration = (data: reg_ReqI, client: WebSocket) => {

  const randomUUID = (min: number, max: number): number => {
    const rand: number = Math.floor(min + Math.random() * (max + 1 - min));

    const idExists: userT | undefined = DB.users.find((el: userT) => el.id === rand);
    if (idExists) {
      return randomUUID(min, max);
    }

    return rand;
  };

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
      id: randomUUID(0, 100),
      wins: 0
    };
    DB.users.push(newUser);
    index = newUser.id;
    // write to db
    create(DB);
    updateWinners();
  } else {
    if (userCheck.password !== data.password) {
      error = true;
      errorText = "Incorrect password! Try again or create a new user ";
    }
    index = userCheck.id;
  }

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
  console.log("Update winners: ", response);
  sendMsgToAll(response);
}

const sendMsgToAll = (msg: resI):void => {

  wss.clients.forEach((ws: WebSocket) => {

    console.log("Send message to all websocket clients");
    console.log("Message content: ", msg);

    ws.send(JSON.stringify(msg));
  })
}