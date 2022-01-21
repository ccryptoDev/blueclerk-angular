import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { RolemanagerlistComponent } from "./rolemanagerlist.component";

const routes: Routes = [{ path: "", component: RolemanagerlistComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RoleManagerListRoutingModule {}
