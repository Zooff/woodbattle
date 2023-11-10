import { Injectable } from "@angular/core";
import { Room } from "@woodbattle/shared/model";

@Injectable({
    providedIn: 'root'
})
export class LobbyService {

    public room!: Room

    constructor() {}

    hasStarted() {
        return this.room && this.room.hasStarted
    }

}