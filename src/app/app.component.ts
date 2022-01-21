import { Component, OnInit } from "@angular/core";
import {
  Router,
  ActivatedRoute,
  NavigationEnd,
  NavigationStart,
} from "@angular/router";
import { UserService } from "./shared/users/user.service";
import { StorageService } from "./shared/storage/storage.service";
import { ColorsService } from "../app/shared/colors/colors.service";
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from "@angular/material";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { ApiProvider } from "./service/api";
import { DefaultModelComponent } from "./shared/components/default-model/default-model.component";

@Component({
  // tslint:disable-next-line
  providers: [UserService, StorageService, ColorsService],
  selector: "body",
  templateUrl: "app.component.html",
})
export class AppComponent implements OnInit {
  pendingContracts: any[] = [];
  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private user: UserService,
    public apiProvider: ApiProvider,
    public dialog: MatDialog
  ) {}

  ngOnInit() {
    const isStored = JSON.parse(this.user.getUserData("userInfo"));

    if (isStored) {
      if (
        window.location.href.includes("login") ||
        window.location.href.includes("signup")
      ) {
        this.router.navigate(["/admin"]);
      }

      this.user.updateLoggedUser(isStored);
    }
    this.user.loggedUser.subscribe((u: any) => {
      if (u) {
        this.apiProvider.apitoken = JSON.parse(this.user.getUserData("token"));
        this.apiProvider.getContracts().subscribe((contracts: any) => {
          this.pendingContracts = [];
          if (contracts.status == 1) {
            contracts.contracts.map((contract) => {
              if (
                contract.status == 0 &&
                contract.contractor._id == u.company
              ) {
                this.pendingContracts.push(contract);
              }
            });

            const dataValues = {
              title: "Pending Contracts",
              status: "contracts",
              newContract: "",
              acceptContract: false,
              rejectContract: false,
              cusHeight: false,
            };

            const dataInputs = {
              pendingContracts: this.pendingContracts,
            };

            const data = {
              dataInputs: dataInputs,
              dataValues: dataValues,
            };

            if (this.pendingContracts.length > 0) {
              const dialogRef = this.dialog.open(DefaultModelComponent, {
                width: "474px",
                data: data,
                panelClass: "defaultModel",
              });

              dialogRef.afterClosed().subscribe((data: any) => {
                if (data.data.createNew) {
                  if (data.data.dataValues.acceptContract) {
                    this.acceptContract(data.data.dataValues.newContract);
                  } else {
                    this.rejectContract(data.data.dataValues.newContract);
                  }
                }
              });
            }
          }
        });
      }
    });

    this.router.events.subscribe((evt) => {
      if (evt instanceof NavigationStart) {
        const currentUrl = evt.url;
        if (currentUrl && currentUrl !== "") this.matchRoute(currentUrl);
      }

      if (!(evt instanceof NavigationEnd)) {
        return;
      }
      window.scrollTo(0, 0);
    });

    // this.loadHubspotLiveChatScript();
  }

  matchRoute(currentUrl: string): void {
    const route = currentUrl.toLowerCase();
    if (route.includes("dashboard")) {
      this.apiProvider.updateNewNavItem("Dashboard");
    } else if (route.includes("people")) {
      this.apiProvider.updateNewNavItem("People");
    } else if (route.includes("customers")) {
      this.apiProvider.updateNewNavItem("Customers");
    } else if (route.includes("tags")) {
      this.apiProvider.updateNewNavItem("Tags");
    } else if (route.includes("inventory")) {
      this.apiProvider.updateNewNavItem("Inventory");
    } else if (route.includes("admin")) {
      this.apiProvider.updateNewNavItem("Admin");
    } else if (route.includes("integrations")) {
      this.apiProvider.updateNewNavItem("Integrations");
    } else if (route.includes("invoicing")) {
      this.apiProvider.updateNewNavItem("Invoicing");
    }
  }

  acceptContract(contract) {
    let params = {
      contractId: contract._id,
      status: "accept",
    };
    this.apiProvider.acceptRejectContract(params).subscribe((contract: any) => {
      console.log(contract);
    });
  }

  rejectContract(contract) {
    let params = {
      contractId: contract._id,
      status: "reject",
    };
    this.apiProvider.acceptRejectContract(params).subscribe((contract: any) => {
      console.log(contract);
    });
  }

  // public loadHubspotLiveChatScript() {
  //   let body = <HTMLDivElement>document.body;
  //   let script = document.createElement("script");
  //   script.innerHTML = "";
  //   script.src = "//js.hs-scripts.com/6868877.js";
  //   script.async = true;
  //   script.defer = true;
  //   body.appendChild(script);
  // }
}
