import { Component, OnInit } from '@angular/core';
import { SocketService } from '../../service/socket.service';
import { UserService } from '../../service/user.service';
import { Room, User } from '@woodbattle/shared/model';

@Component({
  selector: 'woodbattle-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {

  public roomName: string = ''

  public room!: Room

  public roomLoaded: boolean = false
  public loadingRoom: boolean = false

  public errorGettingRoom = false

  public user!: User

  constructor(
    private socketService: SocketService,
    private userService: UserService
    ) {}

  ngOnInit(): void {
    this.user = this.userService.createUser()
    this.socketService.onReceiveLobbyMessage().subscribe({
      next: (payload) => {
        console.log(payload)
        this.loadingRoom = false
        this.room = payload.room!
        this.roomLoaded = true
      },
      error: () => {
        this.loadingRoom = false
        this.errorGettingRoom = true
      }
    })
  }

  setUserName(name: string) {
    this.userService.setUserName(name)
  }

  joinOrCreateRoom(action: string) {
    if (this.roomName === '') return 

    this.loadingRoom = true
    if (action === 'join') {
      this.socketService.joinRoom(this.roomName)
    }
    if (action === 'create') {
      this.socketService.createRoom(this.roomName)
    }
  }



}
