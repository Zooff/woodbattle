import { Injectable } from "@angular/core";
import { Observable, Subject } from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class loadingService {

    private loadSource: Subject<boolean> = new Subject<boolean>()
    public $load: Observable<boolean> = new Observable<boolean>()

    constructor() {
        this.$load = this.loadSource.asObservable()
    }

    show() {
        this.loadSource.next(true)
    }

    hide() {
        this.loadSource.next(false)
    }
}