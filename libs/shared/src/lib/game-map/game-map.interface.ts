import { Vector2 } from "../utils/vector2"

export interface TileSet {
    firstGid: number,
    lastGid: number,
    source: string,
    tileWidth: number,
    tileHeight: number
    width: number,
    height: number
}

export interface Tile {
    id: number,
    gid: number
}

export interface Layer {
    tiles: Tile[],
    name: string
}

export interface GameMap {
    width: number,
    height: number,
    tileWidth: number,
    tileHeight: number,
    layers: Layer[],
    tileset: TileSet[]
    spawnPoint: Vector2[]
    collision: any
}

