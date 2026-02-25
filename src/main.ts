import { bootstrapApplication } from '@angular/platform-browser';
import {  WedMainPageComponent } from './components/main-page/main-page.component';
import { appConfig } from './components/main-page/config';

bootstrapApplication(WedMainPageComponent, appConfig).catch((err) => console.error(err));
