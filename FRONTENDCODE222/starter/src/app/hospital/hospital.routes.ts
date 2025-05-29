import { Route } from "@angular/router";
import { AddHospitalComponent } from "./add-hospital/add-hospital.component";
import { Page404Component } from "app/authentication/page404/page404.component";
import { HospitalsListComponent } from "./hospitals-list/hospitals-list.component";

export const HOSPITAL_ROUTE: Route[] = [
    {
      path: "add-hospital",
      component: AddHospitalComponent,
    },
    {
        path: "hospitals-list",
        component: HospitalsListComponent,
    },
    { path: "**", component: Page404Component }
  ];
  