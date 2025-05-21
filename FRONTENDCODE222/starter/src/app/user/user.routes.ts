import { Route } from "@angular/router";
import { UserslistComponent } from "./userslist/userslist.component";
import { Page404Component } from "app/authentication/page404/page404.component";
import { AddUserComponent } from "./add-user/add-user.component";

export const USER_ROUTE: Route[] = [
    {
      path: "userslist",
      component: UserslistComponent,
    },
    {
      path: "add-user",
      component: AddUserComponent,
    },
    { path: "**", component: Page404Component }
  ];
  