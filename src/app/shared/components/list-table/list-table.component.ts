import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  ViewChild,
  ElementRef,
} from "@angular/core";
import { Router } from "@angular/router";
import { ApiProvider } from "../../../service/api";
import { UserService } from "../../users/user.service";

@Component({
  selector: "app-list-table",
  templateUrl: "./list-table.component.html",
  styleUrls: ["./list-table.component.scss"],
})
export class ListTableComponent implements OnInit {
  public loggedUser;
  public sortOrder = "asc";
  public currentHeadValue: string = "";

  @ViewChild("tableHead", { static: true }) tableHead: ElementRef;

  @Input() tableHeads: string[] = [];
  @Input() tableList: any[] = [];
  @Input() displayIcons: boolean = false;
  @Input() type: string = "customer";
  @Input() userType: string = "employee";
  @Input() viewUser: string;
  @Output() visitList = new EventEmitter();
  @Output() equipList = new EventEmitter();
  @Output() editCustomer = new EventEmitter();
  @Output() updateMember = new EventEmitter();
  @Output() updateInventory = new EventEmitter();
  @Output() createNewJob = new EventEmitter();
  @Output() showServiceTicketInfo = new EventEmitter();
  @Output() jobDetails = new EventEmitter();
  @Output() ticketEdit = new EventEmitter();
  @Output() editJob = new EventEmitter();
  @Output() rowClicked = new EventEmitter();
  @Output() detailedImage = new EventEmitter();
  @Output() createNewInvoice = new EventEmitter();
  @Output() createPurchaseOrder = new EventEmitter();
  @Output() createEstimates = new EventEmitter();

  constructor(
    private router: Router,
    private apiProvider: ApiProvider,
    private user: UserService
  ) {}

  ngOnInit() {
    console.log(this.tableList);
    this.loggedUser = JSON.parse(this.user.getUserData("userInfo"));
  }

  goToDetail(item) {
    console.log(item);
    let profile = new individualProfile("Vendor", item, "/vendors", "Vendor");
    this.apiProvider.updateIndividualProfile(profile);
    this.router.navigate([`/individual-profile`]);
  }

  goToVisitList(item) {
    this.visitList.emit(item);
  }

  Equiplist(item) {
    this.equipList.emit(item);
  }

  onEditCustomer(item) {
    this.editCustomer.emit(item);
  }

  Inventory(item) {
    this.updateInventory.emit(item);
  }

  onMembers(item, idx) {
    this.updateMember.emit({ item: item, idx: idx });
  }

  createJob(item) {
    this.createNewJob.emit(item);
  }

  infoServiceTicket(item) {
    this.showServiceTicketInfo.emit(item);
  }

  jobDetail(item) {
    this.jobDetails.emit(item);
  }

  editTicket(item, ticketStatus) {
    const ticket = { ...item, ticketStatus };
    this.ticketEdit.emit(ticket);
  }

  gotoReport(item) {
    if (item.status == 2) {
      this.router.navigate([`/report/${item._id}`]);
    }
  }

  toolTipText(item) {
    let text = "";
    if (item.status == 2) {
      text = "View Report";
    }
    return text;
  }

  editTheJob(item) {
    this.editJob.emit(item);
  }

  onViewCustomer(customer) {
    this.router.navigateByUrl("/customers/" + customer._id);
  }

  onRowClick() {
    this.rowClicked.emit({});
  }

  onDetailImg(imgUrl) {
    this.detailedImage.emit(imgUrl);
  }

  viewInvoice(item) {
    console.log(item);
    this.apiProvider.updateInvoiceDetail(item);
    this.router.navigate(["invoicing/invoice-detail"]);
  }

  createNewPurchase(item) {
    console.log(item);
    this.createNewInvoice.emit(item);
  }

  createNewConvert(item) {
    console.log(item);
    if (this.type === "purchaseOrders") {
      this.createEstimates.emit(item);
    } else {
      this.createPurchaseOrder.emit(item);
    }
  }

  public sortByItem = (currentHeadValue: string) => (sortEvent: any) => {
    const headValue = currentHeadValue.toLowerCase();

    // CUSTOMERS LIST
    if (this.type === "customer") {
      switch (headValue) {
        case "ticket id":
          return sortEvent.ticketId;
        case "created at":
          return sortEvent.createdAt;
        case "customer":
          try {
            return sortEvent.customer.profile.displayName;
          } catch (error) {
            return "";
          }
      }
    }
    // SERVICE TICKETS
    else if (this.type === "serviceTicket") {
      switch (headValue) {
        case "ticket id":
          return sortEvent.ticketId;
        case "created at":
          return sortEvent.createdAt;
        case "customer":
          return sortEvent.customer.profile.displayName;
      }
    }
    // JOB LIST
    else if (this.type === "scheduleJobs") {
      switch (headValue) {
        case "job id":
          return sortEvent.jobId;
        case "status":
          return sortEvent.status;
        case "technician":
          try {
            return sortEvent.technician.profile.displayName;
          } catch (error) {
            return "";
          }
        case "customer":
          try {
            return sortEvent.customer.profile.displayName;
          } catch (error) {
            return "";
          }
        case "type":
          return sortEvent.type.title;
        case "schedule" || "time":
          return sortEvent.dateTime;
      }
    }
    // else if (this.type === "vendor") {
    //   // switch(currentHeadValue) {
    //   // }
    // } else if (this.type === "technicians") {
    //   // switch(currentHeadValue) {
    //   // }
    // } else if (this.type === "managers" || this.type === "officeAdmins") {
    //   // switch(currentHeadValue) {
    //   // }
    // } else if (this.type === "groups") {
    //   // switch(currentHeadValue) {
    //   // }
    // } else if (
    //   this.type === "brands" ||
    //   this.type === "equipments" ||
    //   this.type == "jobs"
    // ) {
    //   // switch(currentHeadValue) {
    //   // }
    // } else if (this.type === "employees") {
    //   // switch(currentHeadValue) {
    //   // }
    // }
    // else if (this.type === "vendorJobs") {
    //   // switch(currentHeadValue) {
    //   // }
    // } else if (this.type === "permissions") {
    //   // switch(currentHeadValue) {
    //   // }
    // } else if (this.type === "customerview") {
    //   // switch(currentHeadValue) {
    //   // }
    // } else if (this.type === "jobRates") {
    //   // switch(currentHeadValue) {
    //   // }
    // } else if (this.type === "completeJobs") {
    //   // switch(currentHeadValue) {
    //   // }
    // } else if (this.type === "invoices") {
    //   // switch(currentHeadValue) {
    //   // }
    // } else if (this.type === "purchasedTags") {
    //   // switch(currentHeadValue) {
    //   // }
    // } else if (this.type === "buyTags") {
    //   // switch(currentHeadValue) {
    //   // }
    // } else if (this.type === "purchaseOrders" || this.type === "estimates") {
    //   // switch(currentHeadValue) {
    //   // }
    // }
    return "";
  };
}

export class individualProfile {
  constructor(type, detail, route, title) {
    this.type = type;
    this.details = detail;
    this.backRoute = route;
    this.title = title;
  }
  type: string;
  details: any;
  backRoute: string;
  title: string;
}
