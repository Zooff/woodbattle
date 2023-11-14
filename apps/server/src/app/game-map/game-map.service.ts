import { Injectable } from '@nestjs/common';
import { BoxCollider, GameMap, Layer, Vector2 } from '@woodbattle/shared/model'
import { Boundary, QuadTree } from 'libs/shared/src/lib/utils/quadtree';
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
            spawnPoint: [],
            collision: null,
            gameObjects: []
        }

        if (namedMap) {
            console.log(path.join(process.cwd(), namedMap))
            const filePath = path.join(process.cwd(), namedMap)
            const map: any = await new Promise((resolve, reject) => {
                tmxParser.parseFile(filePath, function (err, loadedMap) {
                    if (err) return reject(err)
                    resolve(loadedMap)
                })
            })

            console.log('MAP', map)

            formatedMap.height = map.height
            formatedMap.width = map.width
            formatedMap.tileHeight = map.tileHeight
            formatedMap.tileWidth = map.tileWidth

            for (const layer of map.layers) {
                if (layer.type === 'tile') {
                    /*if (layer.name === 'collision') {

                        formatedMap.collision = new QuadTree<BoxCollider>(
                            new Boundary(0,0, formatedMap.width * formatedMap.tileWidth, formatedMap.height * formatedMap.tileHeight),
                            4,
                            10
                        )
                        let x = 0
                        let y = 0
                        let nbOfcolli = 0
                        for (let i= 0; i< layer.tiles.length; i++) {
                            if (layer.tiles[i]) {
                                nbOfcolli++
                                console.log(x, y)
                                const layer = 'all'
                                formatedMap.collision.insert({position: new Vector2(x * formatedMap.tileWidth, y * formatedMap.tileHeight), width: formatedMap.tileWidth, height: formatedMap.tileHeight, layer})
                            }

                            x += 1
                            if (x === map.width) {
                              x = 0
                              y += 1
                            }
                        }

                        console.log('NB : ', nbOfcolli)
                        const formatedLayer: Layer = {
                            tiles: layer.tiles.map((tile: any) => { return {id: tile.id, gid: tile.gid} }),
                            name: layer.name
                        }
                        formatedMap.layers.push(formatedLayer)
                    }
                    else { */
                    const formatedLayer: Layer = {
                        tiles: layer.tiles.map((tile: any) => { return { id: tile.id, gid: tile.gid } }),
                        name: layer.name
                    }
                    formatedMap.layers.push(formatedLayer)
                    // }

                }
                else if (layer.type === 'object') {
                    if (layer.name === 'Spawn') {
                        for (const object of layer.objects) {
                            formatedMap.spawnPoint.push(new Vector2(object.x, object.y))
                        }
                    }

                    if (layer.name === 'collision') {

                        formatedMap.collision = new QuadTree<BoxCollider>(
                            new Boundary(0, 0, formatedMap.width * formatedMap.tileWidth, formatedMap.height * formatedMap.tileHeight),
                            4,
                            10
                        )

                        for (const object of layer.objects) {
                            formatedMap.collision.insert({ position: new Vector2(object.x, object.y), width: object.width, height: object.height, layer: 'all' })
                        }
                    }

                    if (layer.name === 'GameObjects') {
                        for (const object of layer.objects) {
                            console.log(object)
                            let gameObject
                            if (object.type === 'npc') {
                                gameObject = {
                                    position: new Vector2(object.x, object.y),
                                    type: object.type,
                                    image: object.properties.image
                                }
                            }
                            formatedMap.gameObjects.push(gameObject)
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
