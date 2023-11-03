import { AfterViewInit, Component, ElementRef, NgZone, OnInit, ViewChild } from '@angular/core';
import { GameMapService } from '../../service/game-map.service';
import { GameMap } from '@woodbattle/shared/model';
import { ResourceService } from '../../service/resource.service';
import { switchMap } from 'rxjs';

@Component({
  selector: 'woodbattle-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit, AfterViewInit {

  @ViewChild('canvas', { static: false })
  public mainCanvas: ElementRef<HTMLCanvasElement> | null = null
  public context: CanvasRenderingContext2D | null = null

  private canvasWidth: number = 0
  private canvasHeight: number = 0

  public loadingMap: boolean = true
  public loadingMapError: boolean = false

  private actualMap: GameMap | null = null

  constructor(
    private gameMapService: GameMapService,
    private ressourceService: ResourceService,
    private ngZone: NgZone
  ) { }

  ngOnInit(): void {
    this.gameMapService.getShopMap().subscribe({
      next: (shopmap: GameMap) => {
        this.loadingMap = false
        this.actualMap = shopmap
        this.canvasWidth = shopmap.width * shopmap.tileWidth
        this.canvasHeight = shopmap.height * shopmap.tileHeight

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
      this.context?.fillRect(0,0, this.mainCanvas.nativeElement.width, this.mainCanvas.nativeElement.height)
    }

  }


  gameLoop( delta?: number ) {

    if (!this.context || !this.actualMap) return

    this.context.clearRect(0,0, this.canvasWidth, this.canvasHeight)
    
    this.gameMapService.drawMapLayer(this.context, this.actualMap, 'background')

    this.gameMapService.drawMapLayer(this.context, this.actualMap, 'tree')

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

    
    this.ngZone.runOutsideAngular( () => {
      this.gameLoop()
    })
  }

}
