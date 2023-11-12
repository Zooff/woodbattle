export interface PlayerInput {
    up: boolean | undefined
    down: boolean | undefined
    left: boolean | undefined
    right: boolean | undefined

    attack: boolean | undefined
    parry: boolean | undefined
    dash: boolean | undefined
    action1: boolean | undefined
}

export interface PlayerMapping {
    up: string[]
    down: string[]
    left: string[]
    right: string[]

    attack: string[]
    parry: string[]
    dash: string[]
    action1: string[]
}