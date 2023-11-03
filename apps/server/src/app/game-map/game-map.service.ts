import { Injectable } from '@nestjs/common';
import { GameMap } from './interfaces/gameMap-interface';
import path from 'path';

const tmxParser = require('tmx-parser')

const SHOP_MAP_PATH = './apps/server/src/assets/minimalist.tmx'

let shopMap: GameMap = null

@Injectable()
export class GameMapService {

    async getShopMap(): Promise<GameMap> {

        console.log('SHOP MAP', shopMap)

        if (shopMap) return shopMap

        shopMap = await this.initGameMap(SHOP_MAP_PATH)

        return shopMap

    }

    private async initGameMap(namedMap: string): Promise<GameMap> {
        const formatedMap: GameMap = {
            height: null,
            width: null,
            tileWidth: null,
            tileHeight: null,
            layers: [],
            tileset: []
        }

        if (namedMap) {
            const filePath = path.join(process.cwd(), namedMap)
            const map: any = await new Promise((resolve, reject) => {
                tmxParser.parseFile(filePath, function(err, loadedMap) {
                    if (err) return reject(err)
                    resolve(loadedMap)
                })
            })
    
            console.log('MAP', map)

            formatedMap.height = map.height
            formatedMap.width = map.width
            formatedMap.tileHeight = map.tileHeight
            formatedMap.tileWidth = map.tileWidth
    
            for (const layer of map.layers)  {
                formatedMap.layers.push(layer.tiles.map((tile: any) => { return {id: tile.id, gid: tile.gid} }))
            }

            for (const tileset of map.tileSets) {
                formatedMap.tileset.push({
                    firstGid: tileset.firstGid,
                    source: tileset.name,
                    tileHeight: tileset.tileHeight,
                    tileWidth: tileset.tileWidth
                })
            }
    
        }
       
        return formatedMap
    }
}
