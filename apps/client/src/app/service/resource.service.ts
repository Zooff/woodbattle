import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ResourceService {

  public imgRessources: { [key: string]: {image: HTMLImageElement, loaded: boolean} }

  constructor() {
    this.imgRessources = {}
  }

  loadImage(name: string) {
    if (this.imgRessources[name]) return

    const img: HTMLImageElement = new Image()
    img.src = '/assets/img/' + name

    this.imgRessources[name] = {image: img, loaded: false}
    img.onload = () => { this.imgRessources[name].loaded = true}
  }

  
}
