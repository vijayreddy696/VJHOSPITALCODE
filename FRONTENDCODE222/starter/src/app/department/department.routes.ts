import { Page404Component } from "app/authentication/page404/page404.component";
import { AddDepartmentComponent } from "./add-department/add-department.component";
import { Route } from "@angular/router";
import { DepartmentsListComponent } from "./departments-list/departments-list.component";
import { SpecializationsListComponent } from "app/specialization/specializations-list/specializations-list.component";




export const DEPARTMENT_ROUTE: Route[] = [
    {
      path: "add-department",
      component: AddDepartmentComponent,
    },
    {
        path: "departments-list",
        component: DepartmentsListComponent,
    },
    {
        path: "specializations-list",
        component: SpecializationsListComponent,
    },
    { path: "**", component: Page404Component }
  ];