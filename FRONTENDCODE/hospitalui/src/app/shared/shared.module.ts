import { NgModule } from '@angular/core';
import { CommonModule, NgClass } from '@angular/common';
import { SidebarComponent } from './sidebar/sidebar.component';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { NgScrollbar } from 'ngx-scrollbar';



@NgModule({
  declarations: [
    SidebarComponent
  ],
  imports: [
    CommonModule,
    RouterLinkActive,
    RouterLink,
    NgClass,
    TranslateModule,
    NgScrollbar,

  ],
  exports:[SidebarComponent]
})
export class SharedModule { }
