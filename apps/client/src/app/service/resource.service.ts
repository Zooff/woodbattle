import { Injectable } from '@angular/core';
import { Observable, filter, from, fromEvent, map, mergeMap, scan } from 'rxjs';

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
          map((e) => {
            this.imgRessources[name].loaded = true
          })
        )
      }),
      scan((acc: any[], curr) => [...acc, curr], []),
      filter((images) => images.length === names.length)
    )
  }

  getImage(name: string): HTMLImageElement | null {
    console.log(this.imgRessources[name])
    if (this.imgRessources[name] && this.imgRessources[name].loaded) {
      console.log(this.imgRessources[name].image)
      return this.imgRessources[name].image
    }

    return null
  }


}
