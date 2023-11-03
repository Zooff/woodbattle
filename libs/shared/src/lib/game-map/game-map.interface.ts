export interface TileSet {
    firstGid: number,
    source: string,
    tileWidth: number,
    tileHeight: number
}

export interface GameMap {
    width: number,
    height: number,
    tileWidth: number,
    tileHeight: number,
    layers: any[],
    tileset: TileSet[]
}

