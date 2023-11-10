import { Component, OnInit } from '@angular/core';
import { loadingService } from '../../service/loading.service';

@Component({
  selector: 'woodbattle-loading',
  templateUrl: './loading.component.html',
  styleUrls: ['./loading.component.scss'],
})
export class LoadingComponent implements OnInit {

  public show: boolean = false

  constructor (private loadingService: loadingService) {}

  ngOnInit(): void {
    this.loadingService.$load.subscribe((value) => {
      this.show = value
    })
  }

}
