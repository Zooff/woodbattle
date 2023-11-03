import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ConfigService } from './config.service';
import { Observable, first, map, of, switchMap, tap } from 'rxjs';
import { GameMap, TileSet } from '@woodbattle/shared/model';
import { ResourceService } from './resource.service';

@Injectable({
  providedIn: 'root'
})
export class GameMapService {

  private tilesImage: { [gid: string]: { tileset: TileSet, image: HTMLImageElement | null } } = {}


  constructor(
    private httpClient: HttpClient,
    private configService: ConfigService,
    private ressourceService: ResourceService
  ) { }


  getShopMap(): Observable<GameMap> {
    let url = this.configService.server + 'game-map/shop'
    let gamemap: GameMap
    return this.httpClient.get<GameMap>(url).pipe(
      first(),
      switchMap((gm: GameMap) => {
        // for (const tileset of gamemap.tileset) {
        //   this.ressourceService.loadImage(tileset.source)
        // }
        gamemap = gm
        return this.ressourceService.loadImg(gamemap.tileset.map(el => el.source))
      }),
      switchMap(() => of(gamemap))
    )
  }


  drawMapLayer(context: CanvasRenderingContext2D, map: GameMap, layerName: string) {
    for (const layer of map.layers) {
      if (!layer.name.includes(layerName)) continue
      let x = 0
      let y = 0
      for (let i = 0; i < layer.tiles.length; i++) {
        if (!layer.tiles[i]) {
          x += 1
          if (x === map.width) {
            x = 0
            y += 1
          }
          continue
        }

        const tileset = this.getTileSetFromGid(layer.tiles[i].gid, map)

        if (tileset) {

          const tileInRow = tileset?.tileset.width / tileset.tileset.tileWidth
          const offsetY = Math.floor(layer.tiles[i].id / tileInRow ) * tileset.tileset.tileWidth
          const offsetX = (layer.tiles[i].id % tileInRow) * tileset.tileset.tileHeight
          if (tileset.image) {
            context.drawImage(tileset.image, offsetX , offsetY, tileset.tileset.tileWidth, tileset.tileset.tileHeight, x * tileset.tileset.tileWidth, y * tileset.tileset.tileHeight, tileset.tileset.tileWidth, tileset.tileset.tileHeight)
          }

        }
        x += 1
        if (x === map.width) {
          x = 0
          y += 1
        }

      }
    }
  }

  private getTileSetFromGid(gid: number, map: GameMap): { tileset: TileSet, image: HTMLImageElement | null } | null {

    if (this.tilesImage[gid]) return this.tilesImage[gid]

    for (const tileset of map.tileset) {
      if (gid >= tileset.firstGid && gid < tileset.lastGid) {
        this.tilesImage[gid] = { tileset: tileset, image: this.ressourceService.getImage(tileset.source) }
        return this.tilesImage[gid]
      }
    }

    return null
  }
}
