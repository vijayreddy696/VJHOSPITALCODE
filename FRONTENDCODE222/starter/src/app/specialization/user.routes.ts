import { Route } from "@angular/router";
import { SpecializationsListComponent } from "./specializations-list/specializations-list.component";

export const SPECIALIZATION_ROUTE: Route[] = [
    {
      path: "specializationslist",
      component: SpecializationsListComponent,
    },
    
    { path: "**", component: Page404Component }
  ];
  