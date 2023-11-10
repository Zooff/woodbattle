import { Component, OnInit } from '@angular/core';
import { SocketService } from '../../service/socket.service';

@Component({
  selector: 'woodbattle-latency',
  templateUrl: './latency.component.html',
  styleUrls: ['./latency.component.scss'],
})
export class LatencyComponent implements OnInit {

  public latency: number = 0

  constructor(private socketService: SocketService) {}

  ngOnInit(): void {
    this.socketService.getLatency().subscribe( (latency) => {
      this.latency = latency
    })
  }
}
