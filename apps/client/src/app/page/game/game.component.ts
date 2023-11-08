import { AfterViewInit, Component, ElementRef, NgZone, OnInit, ViewChild } from '@angular/core';
import { GameMapService } from '../../service/game-map.service';
import { GameMap, Vector2 } from '@woodbattle/shared/model';
import { ResourceService } from '../../service/resource.service';
import { switchMap } from 'rxjs';
import { GameStateService } from '../../service/game-state.service';

@Component({
  selector: 'woodbattle-home',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss'],
})
export class GameComponent implements OnInit, AfterViewInit {

  @ViewChild('canvas', { static: false })
  public mainCanvas: ElementRef<HTMLCanvasElement> | null = null
  public context: CanvasRenderingContext2D | null = null

  private canvasWidth: number = 0
  private canvasHeight: number = 0

  public loadingMap: boolean = true
  public loadingMapError: boolean = false

  private actualMap: GameMap | null = null

  public scale: number = 4

  private lastRun: number = 0
  public fps: number = 0

  constructor(
    private gameMapService: GameMapService,
    private gameStateService: GameStateService,
    private ressourceService: ResourceService,
    private ngZone: NgZone
  ) { }

  ngOnInit(): void {
    this.gameMapService.getShopMap().subscribe({
      next: (shopmap: GameMap) => {
        this.loadingMap = false
        this.actualMap = shopmap
        this.canvasWidth = shopmap.width * shopmap.tileWidth * this.scale
        this.canvasHeight = shopmap.height * shopmap.tileHeight * this.scale

        this.initGame()
      },
      error: (err) => {
        console.error(err)
        this.loadingMap = false
        this.loadingMapError = true;
      }
    }
    )
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

    for (const player of this.gameStateService.getAllPlayers()) {
      player.setScale(this.scale)
      player.draw(this.context)
    }

    this.gameMapService.drawMapLayer(this.context, this.actualMap, 'tree', this.scale)

    // this.mainCanvas!.nativeElement.width = this.canvasWidth * 2
    // this.mainCanvas!.nativeElement.height = this.canvasHeight * 2
    // this.context?.scale(2, 2)

    window.requestAnimationFrame(this.gameLoop.bind(this))
  }

  initGame() {
    if (!this.mainCanvas) return

    console.log('INIT GAME')

    this.mainCanvas.nativeElement.width = this.canvasWidth
    this.mainCanvas.nativeElement.height = this.canvasHeight

    this.gameStateService.createPlayer(new Vector2(40, 40), this.scale)

    this.lastRun = performance.now()
    this.ngZone.runOutsideAngular(() => {
      this.gameLoop(this.lastRun)
    })
  }


  setScale(op: string) {

    if (op === '-' && this.scale > 1) this.scale--
    if (op === '+') this.scale++
  }

}
