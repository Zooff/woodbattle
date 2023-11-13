import { AfterViewInit, Component, ElementRef, HostListener, NgZone, OnInit, ViewChild } from '@angular/core';
import { GameMapService } from '../../service/game-map.service';
import { GameMap, IGame, IPlayerCharacters, PlayerInput, User, Vector2 } from '@woodbattle/shared/model';
import { ResourceService } from '../../service/resource.service';
import { switchMap } from 'rxjs';
import { GameStateService } from '../../service/game-state.service';
import { ActivatedRoute } from '@angular/router';
import { loadingService } from '../../service/loading.service';
import { SocketService } from '../../service/socket.service';
import { SettingsService } from '../../service/settings.service';
import { ConfigService } from '../../service/config.service';
import { KeyboardManager } from '../../service/keyboardManager.service';
import { PlayerCharacter } from '@woodbattle/client';
import { LobbyService } from '../../service/lobby.service';
import { UserService } from '../../service/user.service';

@Component({
  selector: 'woodbattle-home',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss'],
})
export class GameComponent implements OnInit, AfterViewInit {

  @HostListener('window:resize')
  onResize() {
    this.calculateScale(this.actualMap!.width * this.actualMap!.tileWidth, this.actualMap!.height * this.actualMap!.tileHeight)
  }

  @HostListener('window:keyup', ['$event'])
  keyUpEvent(event: KeyboardEvent) {
    this.keyboardManager.keyUp(event)
  }
  @HostListener('window:keydown', ['$event'])
  keyDownEvent(event: KeyboardEvent) {
    this.keyboardManager.keyDown(event)
  }

  @ViewChild('canvas', { static: false })
  public mainCanvas: ElementRef<HTMLCanvasElement> | null = null
  public context: CanvasRenderingContext2D | null = null

  private canvasWidth: number = 0
  private canvasHeight: number = 0

  public loadingMap: boolean = true
  public loadingMapError: boolean = false

  private actualMap: GameMap | null = null

  public scale: number = 1

  private lastRun: number = 0
  public fps: number = 0

  private lastUpdate: number = 0
  private updateTime: number = 0

  public roomName: string = ''
  public user: string


  constructor(
    private gameMapService: GameMapService,
    private gameStateService: GameStateService,
    private ressourceService: ResourceService,
    private ngZone: NgZone,
    private route: ActivatedRoute,
    private loadingService: loadingService,
    private socketService: SocketService,
    private settingsService: SettingsService,
    private configService: ConfigService,
    private keyboardManager: KeyboardManager,
    private lobbyService: LobbyService,
    private userService: UserService
  ) {
    this.user = userService.getActualUser().name
   }

  ngOnInit(): void {
    this.socketService.onReceiveGameStart().subscribe((payload) => {
      this.loadingService.hide()
      switch (payload.action) {
        case 'init-game':
          this.initGame(payload)
      }

    })

    this.socketService.onReceiveGameUpdate().subscribe((payload) => {
      if (payload.action === 'update-game') {
        this.gameStateService.updateGame(payload.playerCharacters)
      }
    })
    this.actualMap = this.route.snapshot.data['shopMap']

    this.calculateScale(this.actualMap!.width * this.actualMap!.tileWidth, this.actualMap!.height * this.actualMap!.tileHeight)

    this.canvasWidth = this.actualMap!.width * this.actualMap!.tileWidth * this.scale
    this.canvasHeight = this.actualMap!.height * this.actualMap!.tileHeight * this.scale
    // this.gameMapService.getShopMap().subscribe({
    //   next: (shopmap: GameMap) => {
    //     this.loadingMap = false
    //     this.actualMap = shopmap
    //     this.canvasWidth = shopmap.width * shopmap.tileWidth * this.scale
    //     this.canvasHeight = shopmap.height * shopmap.tileHeight * this.scale

    //     // this.initGame()
    //   },
    //   error: (err) => {
    //     console.error(err)
    //     this.loadingMap = false
    //     this.loadingMapError = true;
    //   }
    // }
    // )

    this.socketService.isReady()

    this.roomName = this.lobbyService.room.name


  }

  ngAfterViewInit(): void {
    if (this.mainCanvas) {
      this.context = this.mainCanvas.nativeElement.getContext('2d')
      this.context?.fillRect(0, 0, this.mainCanvas.nativeElement.width, this.mainCanvas.nativeElement.height)
    }

  }


  gameLoop(delta: number) {

    if (!this.context || !this.actualMap) return

    this.lastRun = delta
    this.fps = Math.round(1000 / (performance.now() - this.lastRun))

    this.mainCanvas!.nativeElement.width = this.actualMap.width * this.actualMap.tileWidth * this.scale
    this.mainCanvas!.nativeElement.height = this.actualMap.height * this.actualMap.tileHeight * this.scale

    this.context.clearRect(0, 0, this.canvasWidth, this.canvasHeight)

    this.gameMapService.drawMapLayer(this.context, this.actualMap, 'background', this.scale)
    this.gameMapService.drawMapLayer(this.context, this.actualMap, 'collision', this.scale)

    const players = this.gameStateService.getAllPlayers()
    // console.log(players)
    for (const player in players) {
      players[player].setScale(this.scale)
      players[player].draw(this.context)
    }

    this.gameMapService.drawMapLayer(this.context, this.actualMap, 'foreground', this.scale)

    // this.mainCanvas!.nativeElement.width = this.canvasWidth * 2
    // this.mainCanvas!.nativeElement.height = this.canvasHeight * 2
    // this.context?.scale(2, 2)

    window.requestAnimationFrame(this.gameLoop.bind(this))
  }

  updateLoop() {

    this.updateTime = this.lastUpdate - performance.now()
    this.lastUpdate = performance.now()

    const inputToSend: Partial<PlayerInput> = this.keyboardManager.sendPlayerInput()
    if (Object.keys(inputToSend).length > 0) {
      this.socketService.updateInput(inputToSend)
    }
   

    setTimeout( this.updateLoop.bind(this), this.configService.framerate) 
  }

  initGame(game: any) {
    if (!this.mainCanvas) return

    console.log('INIT GAME')

    this.mainCanvas.nativeElement.width = this.canvasWidth
    this.mainCanvas.nativeElement.height = this.canvasHeight

    this.gameStateService.init(game)

    // const x = Math.floor(Math.random() * (60 - 10 + 1))
    // const y = Math.floor(Math.random() * (60 - 10 + 1))

    // this.gameStateService.createPlayer(new Vector2(x, y), this.scale)

    this.lastRun = performance.now()
    this.lastUpdate = performance.now()

    this.ngZone.runOutsideAngular(() => {
      this.updateLoop()
      this.gameLoop(this.lastRun)
    })
  }


  setScale(op: string) {

    if (op === '-' && this.scale > 1) this.scale--
    if (op === '+') this.scale++
  }

  private calculateScale(width: number, height: number) {
    this.scale = Math.round(Math.min(window.innerWidth / width, window.innerHeight / height))
    if (this.scale > 1) this.scale = this.scale - 1
    this.settingsService.scale = this.scale
  }

}
