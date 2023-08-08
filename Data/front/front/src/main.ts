import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { AppModule } from './app/app.module';

console.warn = function () { }
platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => err);

