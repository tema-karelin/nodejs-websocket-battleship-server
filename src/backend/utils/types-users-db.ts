export type userT = {
    username: string,
    password: string,
    id: number
}

export interface dbI {
    users: Array<userT>,
}