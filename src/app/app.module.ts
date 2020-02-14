import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { RetrocardComponent } from './retrocard/retrocard.component';
import { SectionComponent } from './section/section.component';
import {FormsModule} from '@angular/forms';
import { SectionDirective } from './section/section.directive';
import {HttpClientModule} from '@angular/common/http';
import { RetroComponent } from './retro/retro.component';
import { RetrocardDirective } from './retrocard/retrocard.directive';
import { Angular2FontawesomeModule } from 'angular2-fontawesome/angular2-fontawesome'


import {RetroService} from './retro.service';
import { CreateComponent } from './create/create.component';

@NgModule({
  declarations: [
    AppComponent,
    RetrocardComponent,
    SectionComponent,
    SectionDirective,
    RetroComponent,
    RetrocardDirective,
    CreateComponent,

  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    Angular2FontawesomeModule
  ],
  providers: [
    RetroService
  ],
  bootstrap: [AppComponent],
  entryComponents: [ SectionComponent, RetrocardComponent],
})
export class AppModule { }
