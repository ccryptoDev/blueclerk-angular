import { Component, OnInit } from "@angular/core";
import { ToasterService } from "angular2-toaster";
import { FormGroup } from "@angular/forms";
import { Location } from "@angular/common";
import { Router, ActivatedRoute } from "@angular/router";

@Component({
  selector: "app-billing",
  templateUrl: "./billing.component.html",
  styleUrls: ["./billing.component.scss"],
})
export class BillingComponent implements OnInit {
  valForm2: FormGroup;
  toasterService: ToasterService;
  history = [
    {
      name: "Billing Methods",
      click: "/admin/billing/billingmethod",
      i: "money",
      color: "#49b8ff",
    },
    {
      name: "History",
      click: "/admin/billing/billinghistory",
      i: "history",
      color: "#0082c3",
    },
    {
      name: "Subscriptions",
      click: "/admin/billing/subscribeuser",
      i: "subscriptions",
      color: "#713bdb",
    },
  ];
  showOutlet: boolean;

  constructor(
    private location: Location,
    public router: Router,
    private activatedRoute: ActivatedRoute
  ) {}

  ngOnInit() {
    this.history.sort((a, b) => {
      if (a.name < b.name) {
        return -1;
      }
      if (a.name > b.name) {
        return 1;
      }
      return 0;
    });
  }

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
