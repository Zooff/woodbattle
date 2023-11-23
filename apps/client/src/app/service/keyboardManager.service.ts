import { Injectable } from "@angular/core";
import { PlayerInput, PlayerMapping } from "@woodbattle/shared/model";

@Injectable({
    providedIn: 'root'
})
export class KeyboardManager {

    playerInput: PlayerInput = {
        up: false,
        down: false,
        right: false,
        left: false,

        attack: false,
        parry: false,
        dash: false,
        action1: false
    }

    lastInputSend: Partial<PlayerInput> = this.playerInput

    playerMapping: PlayerMapping = {
        up: ['z', 'Z'],
        down: ['s', 'S'],
        right: ['d', 'D'],
        left: ['q', 'Q'],

        attack: [' '],
        parry: ['a', 'A'],
        dash: ['Shift'],
        action1: ['e', 'E']
    }

    constructor() {

    }

    sendPlayerInput() {

        const toSend = Object.keys(this.playerInput).reduce((diff, key) => {
            if (this.lastInputSend[key as keyof PlayerInput] === this.playerInput[key as keyof PlayerInput]) return diff
            return {
                ...diff,
                [key]: this.playerInput[key as keyof PlayerInput]
            }
        }, {})

        this.lastInputSend = Object.assign({}, this.playerInput)

        return toSend
    }


    keyDown(event: KeyboardEvent) {
        if (this.playerMapping.up.includes(event.key)) {
            this.playerInput.up = true
            return
        }
        if (this.playerMapping.down.includes(event.key)) {
            this.playerInput.down = true
            return
        }
        if (this.playerMapping.right.includes(event.key)) {
            this.playerInput.right = true
            return
        }
        if (this.playerMapping.left.includes(event.key)) {
            this.playerInput.left = true
            return
        }
        if (this.playerMapping.attack.includes(event.key)) {
            this.playerInput.attack = true
            return
        }
        if (this.playerMapping.parry.includes(event.key)) {
            this.playerInput.parry = true
            return
        }
        if (this.playerMapping.dash.includes(event.key)) {
            this.playerInput.dash = true
            return
        }
        if (this.playerMapping.action1.includes(event.key)) {
            this.playerInput.action1 = true
            return
        }
    }

    keyUp(event: KeyboardEvent) {
        if (this.playerMapping.up.includes(event.key)) {
            this.playerInput.up = false
            return
        }
        if (this.playerMapping.down.includes(event.key)) {
            this.playerInput.down = false
            return
        }
        if (this.playerMapping.right.includes(event.key)) {
            this.playerInput.right = false
            return
        }
        if (this.playerMapping.left.includes(event.key)) {
            this.playerInput.left = false
            return
        }
        if (this.playerMapping.attack.includes(event.key)) {
            this.playerInput.attack = false
            return
        }
        if (this.playerMapping.parry.includes(event.key)) {
            this.playerInput.parry = false
            return
        }
        if (this.playerMapping.dash.includes(event.key)) {
            this.playerInput.dash = false
            return
        }
        if (this.playerMapping.action1.includes(event.key)) {
            this.playerInput.action1 = false
            return
        }
    }
}