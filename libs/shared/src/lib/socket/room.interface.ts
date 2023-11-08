import { User } from "../user/user.interface"

export interface Room {
    id: string
    name: string,
    host: User
    users: User[]
    hasStarted: boolean,
    createdAt: number
}