import { Injectable } from '@nestjs/common';
import { GameMap, Layer, Vector2 } from '@woodbattle/shared/model'
import path from 'path';

const tmxParser = require('tmx-parser')

const SHOP_MAP_PATH = './apps/server/src/assets/shop.tmx'

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
            tileset: [],
            spawnPoint: []
        }

        if (namedMap) {
            console.log(path.join(process.cwd(), namedMap))
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
                if (layer.type === 'tile') {
                    const formatedLayer: Layer = {
                        tiles: layer.tiles.map((tile: any) => { return {id: tile.id, gid: tile.gid} }),
                        name: layer.name
                    }
                    formatedMap.layers.push(formatedLayer)
                }
                else if (layer.type === 'object') {
                    if (layer.name === 'Spawn') {
                        for (const object of layer.objects) {
                            formatedMap.spawnPoint.push(new Vector2(object.x, object.y))
                        }
                    }
                }
               
            }

            for (const tileset of map.tileSets) {
                formatedMap.tileset.push({
                    firstGid: tileset.firstGid,
                    lastGid: tileset.firstGid + tileset.tiles.length,
                    source: tileset.name,
                    tileHeight: tileset.tileHeight,
                    tileWidth: tileset.tileWidth,
                    width: tileset.image.width,
                    height: tileset.image.height
                })
            }
    
        }
       
        return formatedMap
    }
}
