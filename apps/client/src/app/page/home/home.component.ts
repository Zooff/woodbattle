import { Component, OnInit } from '@angular/core';
import { SocketService } from '../../service/socket.service';
import { UserService } from '../../service/user.service';
import { Room, ServerLobbyMessage, User } from '@woodbattle/shared/model';
import { Router } from '@angular/router';
import { loadingService } from '../../service/loading.service';
import { LobbyService } from '../../service/lobby.service';

@Component({
  selector: 'woodbattle-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {

  public roomName: string = ''

  public room: Room | null = null

  public roomLoaded: boolean = false
  public loadingRoom: boolean = false

  public errorGettingRoom = false
  public errorName: string = ''


  public user!: User

  constructor(
    private socketService: SocketService,
    private userService: UserService,
    private router: Router,
    private loadingService: loadingService,
    private lobbyService: LobbyService
  ) { }

  ngOnInit(): void {
    this.user = this.userService.createUser()
    this.socketService.onReceiveLobbyMessage().subscribe({
      next: (payload: ServerLobbyMessage) => {
        switch (payload.action) {
          case 'connect':
          case 'join':
          case 'leave':
            this.loadingRoom = false
            this.room = payload.room!
            this.roomLoaded = true
            this.lobbyService.room = payload.room!
            break
          case 'disconnect':
          case 'error':
            this.loadingRoom = false
            this.room = null
            this.roomLoaded = false
            if (payload.error) {
              this.errorGettingRoom = true
              this.errorName = payload.error
            }
            break
          case 'start':
            console.log('Start')
            console.log(payload.room)
            this.lobbyService.room = payload.room!
            this.loadingService.show()
            this.navigateToGame()
        }
      },
      error: (err) => {
        console.log('error')
        this.loadingRoom = false
        this.errorGettingRoom = true
        this.errorName = err
      }
    })
  }

  setUserName(name: string) {
    this.userService.setUserName(name)
  }

  joinOrCreateRoom(action: string) {
    if (this.roomName === '') return

    this.errorGettingRoom = false
    this.errorName = ''
    this.loadingRoom = true

    if (action === 'join') {
      this.socketService.joinRoom(this.roomName)
    }
    if (action === 'create') {
      this.socketService.createRoom(this.roomName)
    }
  }

  leaveRoom() {
    this.socketService.leaveRoom(this.roomName)
  }

  startGame() {
    this.socketService.startGame(this.roomName)
  }

  private navigateToGame() {
    return this.router.navigate(['/game'])
  }



}
