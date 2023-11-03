import { Component, OnInit } from '@angular/core';
import { GameMapService } from '../../service/game-map.service';
import { GameMap } from '@woodbattle/shared/model';

@Component({
  selector: 'woodbattle-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {

  public loadingMap: boolean = true
  public loadingMapError: boolean = false

  constructor(
    private gameMapService: GameMapService
  ) { }

  ngOnInit(): void {
    this.gameMapService.getShopMap().subscribe({
      next: (shopmap: GameMap) => {
        this.loadingMap = false
      },
      error: (err) => {
        console.error(err)
        this.loadingMap = false
        this.loadingMapError = true;
      }
    }
    )
  }

}
