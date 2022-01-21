import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { RoleTechinicianListComponent } from "./role-techinician-list.component";

const routes: Routes = [{ path: "", component: RoleTechinicianListComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RoleTechinicianListRoutingModule {}
