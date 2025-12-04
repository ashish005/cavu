import {NgModule} from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import {AppMenuComponent} from "./app-menu.component";
import {IdentityModule} from "./third-party";
import {GlobalModule} from "./global";
import {AppLibModule} from "../app-lib/app-lib.module";
import {provideAnimations} from "@angular/platform-browser/animations";

@NgModule({
  declarations: [
    AppComponent, AppMenuComponent
  ],
  imports: [
    BrowserModule,
    IdentityModule.forRoot(), AppRoutingModule, GlobalModule,
    AppLibModule
  ],
  providers: [
      // Enable animations for @stepEnter
    provideAnimations()
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
