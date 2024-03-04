type playerT = number | string | undefined;

export interface playerI {
  name: string | undefined;
  index: number | string | undefined;
}

export interface roomMsgI {
  roomId: number | string;
  roomUsers: Array<playerI>
}

//
//  <---  IN
// msg.data
export interface reg_ReqI {
  name: string;
  password: string;
}
export interface add_user_to_room_ReqI {
  indexRoom: number | string;
}
export interface add_ships_ReqI {
  gameId: number | string;
  ships: [
    {
      position: {
        x: number;
        y: number;
      };
      direction: boolean;
      length: number;
      type: "small" | "medium" | "large" | "huge";
    }
  ];
  indexPlayer: playerT;
}
export interface attack_ReqI {
  gameId: number | string;
  x: number;
  y: number;
  indexPlayer: playerT;
}
export interface randomAttack_ReqI {
  gameId: number | string;
  indexPlayer: playerT;
}
export type create_room_ReqT = "";

export interface msgI {
  type: "reg" | "create_room" | "add_user_to_room" | "add_ships" | "attack" | "randomAttack";
  // data: reg_ReqI | create_room_ReqT | add_user_to_room_ReqI | add_ships_ReqI | attack_ReqI | randomAttack_ReqI;
  data: string;
  id: 0;
}


//
//  ---> OUT
// msg.data
export interface reg_ResI {
  name: string;
  index: number | string;
  error: boolean;
  errorText: string;
}
interface winnersI  {
  name: string;
  wins: number;
}
export type update_winners_ResT = Array<winnersI>
export interface create_game_ResI {
  idGame: number | string;
  idPlayer: playerT;
}
export type update_room_ResT = Array<roomMsgI>;
export interface start_game_ResI {
  ships: /* player's ships, not enemy's */
  [
    {
      position: {
        x: number;
        y: number;
      };
      direction: boolean;
      length: number;
      type: "small" | "medium" | "large" | "huge";
    }
  ];
  currentPlayerIndex: number | string;
}
export interface attack_ResI {
  position: {
    x: number;
    y: number;
  };
  currentPlayer: playerT;
  status: "miss" | "killed" | "shot";
}
export interface turn_ResI {
  currentPlayer: playerT;
}
export interface finish_ResI {
  winPlayer: playerT;
}



export interface resI {
  type: "reg" | "update_winners" | "create_game" | "update_room" | "start_game" | "attack" | "turn" | "finish";
  // data: reg_ResI | update_winners_ResI | create_game_ResI | start_game_ResI | attack_ResI | turn_ResI | finish_ResI | update_room_ResT;
  data: string;
  id: 0;
}
