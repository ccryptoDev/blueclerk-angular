import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";

import { RolesComponent } from "./roles.component";

const routes: Routes = [
  {
    path: "",
    component: RolesComponent,
    data: {
      title: "Roles",
    },
    children: [
      {
        path: "rolemanagerlist",
        loadChildren: () =>
          import("./../rolemanagerlist/rolemanagerlist.module").then(
            (m) => m.RolemanagerlistModule
          ),
      },
      {
        path: "roletechinicianlist",
        loadChildren: () =>
          import(
            "./../role-techinician-list/role-techinician-list.module"
          ).then((m) => m.RoleTechinicianListModule),
      },
      {
        path: "viewuser",
        loadChildren: () =>
          import("./../viewuser/viewuser.module").then((m) => m.ViewuserModule),
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RolesRoutingModule {}
