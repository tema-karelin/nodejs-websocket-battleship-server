export type userT = {
    username: string,
    password: string,
    id: number,
    wins: number
}

export interface dbI {
    users: Array<userT>,
}