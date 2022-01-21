import { Component, OnInit, ViewChild } from "@angular/core";
import { Router } from "@angular/router";
import { Location } from "@angular/common";

@Component({
  selector: "app-roles",
  templateUrl: "./roles.component.html",
  styleUrls: ["./roles.component.scss"],
})
export class RolesComponent {
  roles = [
    {
      name: "Manager",
      body:
        "Click the card if you would like to view or edit the manager role functionality.",
      href: "/admin/roles-permissions/rolemanagerlist",
      i: "group",
      color: "#713bdb",
    },
    {
      name: "Technician",
      body:
        "Click the card if you would like to view or edit the Technician role functionality.",
      href: "/admin/roles-permissions/roletechinicianlist",
      i: "build",
      color: "#49b8ff",
    },
    {
      name: "Roles",
      body: "Click Here To Edit The Permissions For An Individual User",
      href: "/admin/roles-permissions/viewuser",
      i: "how_to_reg",
      color: "#0082c3",
    },
  ];
  showOutlet: boolean;

  constructor(public router: Router, private location: Location) {}

  onActivate(event: any) {
    this.showOutlet = true;
  }

  onDeactivate(event: any) {
    this.showOutlet = false;
  }

  navigate(url) {
    this.router.navigate([url]);
  }

  goBack() {
    this.location.back();
  }
}
