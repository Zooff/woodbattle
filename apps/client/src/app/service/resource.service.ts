import { Injectable } from '@angular/core';
import { Observable, filter, first, from, fromEvent, map, mergeMap, scan, take, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ResourceService {

  private imgRessources: { [key: string]: { image: HTMLImageElement, loaded: boolean } }
  private imagesRessources: { [key: string]: HTMLImageElement }

  constructor() {
    this.imgRessources = {}
    this.imagesRessources = {}
  }

  loadImage(name: string) {
    if (this.imgRessources[name]) return

    const img: HTMLImageElement = new Image()
    img.src = '/assets/image/' + name + '.png'

    this.imgRessources[name] = { image: img, loaded: false }
    img.onload = () => { this.imgRessources[name].loaded = true }
  }

  loadImg(names: string[]) {
    return from(names).pipe(
      mergeMap((name: string) => {
        const img: HTMLImageElement = new Image()
        img.src = '/assets/image/' + name + '.png'
        this.imgRessources[name] = {image: img, loaded: false}
        return fromEvent(img, 'load').pipe(
          tap(() => {
            this.imgRessources[name].loaded = true
          }),
          first()
        )
      }),
      scan((acc: any[], curr) => [...acc, curr], []),
      filter((images) => images.length === names.length),
      take(1)
    )
  }

  getImage(name: string): HTMLImageElement | null {
    if (this.imgRessources[name] && this.imgRessources[name].loaded) {
      return this.imgRessources[name].image
    }

    return null
  }


}
