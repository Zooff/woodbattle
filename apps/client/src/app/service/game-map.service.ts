import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ConfigService } from './config.service';
import { Observable, first, tap } from 'rxjs';
import { GameMap } from '@woodbattle/shared/model';
import { ResourceService } from './resource.service';

@Injectable({
  providedIn: 'root'
})
export class GameMapService {

  constructor(
    private httpClient: HttpClient,
    private configService: ConfigService,
    private ressourceService: ResourceService
  ) { }


  getShopMap(): Observable<GameMap> {
    let url = this.configService.server + 'game-map/shop'
    return this.httpClient.get<GameMap>(url).pipe(
      first(),
      tap((gamemap) => {
        for (const tileset of gamemap.tileset) {
          this.ressourceService.loadImage(tileset.source)
        }
      })
    )
  }
}
