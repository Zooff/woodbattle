import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { AppComponent } from './app.component';
import { appRoutes } from './app.routes';
import { GameComponent } from './page/game/game.component';
import { HttpClientModule } from '@angular/common/http';

import { SocketIoConfig, SocketIoModule } from 'ngx-socket-io';
import { HomeComponent } from './page/home/home.component';
import { LatencyComponent } from './component/latency/latency.component';
import { LoadingComponent } from './component/loading/loading.component';

const socketConfig: SocketIoConfig = {
  url: 'http://localhost:3000',
};

@NgModule({
  declarations: [
    AppComponent,
    GameComponent,
    HomeComponent,
    LatencyComponent,
    LoadingComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    RouterModule.forRoot(appRoutes, {
      initialNavigation: 'enabledBlocking'
    }),
    SocketIoModule.forRoot(socketConfig),
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
