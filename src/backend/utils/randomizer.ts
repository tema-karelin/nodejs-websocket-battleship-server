import { DB } from "../main";
import { userT } from "../models/types-users-db";

export const randomizer = (min: number, max: number, checkInArr: Array<any> | undefined = undefined): number => {
  const rand: number = Math.floor(min + Math.random() * (max + 1 - min));

  if (checkInArr) {
    const idExists: userT | undefined = checkInArr.find((el: userT) => el.id === rand);
    if (idExists) {
      return randomizer(min, max, checkInArr);
    }
  }
  return rand;
};
