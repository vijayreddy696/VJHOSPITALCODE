import { Route } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { Page404Component } from '../authentication/page404/page404.component';
import { DoctorsListComponent } from './doctors-list/doctors-list.component';
export const DOCTOR_ROUTE: Route[] = [
  {
    path: 'dashboard',
    component: DashboardComponent,
  },
  {
    path: 'doctors-list',
    component: DoctorsListComponent,
  },
  { path: '**', component: Page404Component },

];

