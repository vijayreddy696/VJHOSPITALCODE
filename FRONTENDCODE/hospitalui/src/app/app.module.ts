import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { authInterceptor } from './auth/auth.interceptor';
import { MainLayoutComponent } from './layout/main-layout/main-layout.component';
import { LayoutModule } from './layout/layout.module';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    TranslateModule.forRoot({
      // your TranslateLoader config
    }),
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    LayoutModule
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: authInterceptor, // Register your auth interceptor
      multi: true, // Allows multiple interceptors
    },

  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
