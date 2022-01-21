import {
  Component,
  ViewChild,
  ChangeDetectionStrategy,
  ViewEncapsulation,
  ElementRef,
  Renderer2,
  OnInit,
  ChangeDetectorRef,
  OnDestroy,
} from "@angular/core";
import { Http } from "@angular/http";
import { ActivatedRoute } from "@angular/router";
import { ToasterService, Toast, ToasterConfig } from "angular2-toaster";
import { ColorsService } from "../../shared/colors/colors.service";
import { UserService } from "../../shared/users/user.service";
import { Router } from "@angular/router";
import { ModalComponent } from "ng2-bs3-modal/ng2-bs3-modal";
import { Location } from "@angular/common";
import { ApiProvider } from "../../service/api";
import { of } from "rxjs";
import { map, concat } from "rxjs/operators";
import Swal from "sweetalert2/dist/sweetalert2.js";

import {
  startOfDay,
  endOfDay,
  subDays,
  addDays,
  isSameDay,
  isSameMonth,
  addWeeks,
  subWeeks,
  addMonths,
  subMonths,
} from "date-fns";
import { Subject, Subscription } from "rxjs";
import {
  CalendarEvent,
  CalendarEventTimesChangedEvent,
} from "angular-calendar"; // import should be from `angular-calendar` in your app
import { MatDialog } from "@angular/material";
import { DefaultModelComponent } from "../../shared/components/default-model/default-model.component";

@Component({
  selector: "app-visit-list",
  templateUrl: "./visit-list.component.html",
  styleUrls: ["./visit-list.component.scss"],

  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class VisitListComponent implements OnInit, OnDestroy {
  @ViewChild("cancelDlg", { static: false }) cancelDlg: ModalComponent;
  @ViewChild("custDlg", { static: false }) custDlg: ModalComponent;
  @ViewChild("elem", { static: false }) elem: ElementRef;
  public customerList: Array<any> = [];
  public config: ToasterConfig = new ToasterConfig({
    positionClass: "toast-bottom-right",
    // tapToDismiss: true,
    //timeout: 500000
  });
  msg = "";
  jobTypeData: any;
  dateTime: any;
  technicianId: any;
  customerId: any;
  jobTypeId: any;
  jobData: any;
  technicianData: any;
  customerdata: any;
  equipmentData: any;
  tech_Id: any;
  cust_Id: any;
  jobtype_id: any;
  job_Id: any;
  status: any;
  comment: any;
  jobId: any;
  statusName = [
    { name: "Pending", status: "0" },
    { name: "Started", status: "1" },
    { name: "Finished", status: "2" },
  ];
  statusTitle: any;
  status_id: any;
  editable: any;
  customer_name = "";
  jobList: Array<any> = [];
  Employeedata: any;
  employee_id: any;
  flag: any;
  AllGroupData: any;
  customer_id: any;
  equipment_id: any;
  EquipmentId: any;
  note: any;
  events: CalendarEvent[];
  viewDate: Date = new Date();
  view: string = "month";
  refresh: Subject<any> = new Subject();
  activeDayIsOpen: boolean = true;
  public show: boolean = true;
  public buttonName: any = "View Calender";
  cancel_comment = "";
  equipmentTypesData: any;
  serviceTicketsList: any[] = [];
  serviceTicketsData: any[] = [];
  listTitle = "Service Tickets List";
  listTableHeads = [
    "Ticket ID",
    "Created At",
    "Customer",
    "Create Job",
    "Edit Ticket",
    "Ticket Details",
  ];
  secondListTitle = "Jobs List";
  secondListTableHeads = [
    "Job ID",
    "Status",
    "Technician",
    "Customer",
    "Type",
    "Schedule",
    "Time",
    "Options",
  ];
  searchTicket = {
    name: "",
  };

  searchJob = {
    name: "",
  };
  activeCreateService: boolean = false;
  customerEquipments;
  showBackButton: boolean = false;
  subscription: Subscription;
  vendorData: any[] = [];
  vendorList: any[] = [];
  pastTicketsList: any[] = [];
  pastTicketsData: any[] = [];
  currentTicketsList: any[] = [];
  currentTicketsData: any[] = [];
  serviceStatus: string = "current";
  jobStatus: string = "pending";
  pendingJobsData: any[] = [];
  pendingJobsList: any[] = [];
  startedJobsData: any[] = [];
  startedJobsList: any[] = [];
  cancelJobsData: any[] = [];
  cancelJobsList: any[] = [];
  completeJobsData: any[] = [];
  completeJobsList: any[] = [];
  // new class properties
  param: string;
  paramsExist: boolean;
  ticketsList: any[];
  ticketsListData: any[];
  ticketListTitle: string = "Customer Tickets";
  routeValue: StaticRouteValue;
  paramCustomer: string = "";
  jobCharges: any[];

  constructor(
    public colors: ColorsService,
    public http: Http,
    private router: Router,
    private userInfo: UserService,
    private mdToast: ToasterService,
    private location: Location,
    public apiProvider: ApiProvider,
    public route: ActivatedRoute,
    private renderer2: Renderer2,
    public dialog: MatDialog,
    private cdRef: ChangeDetectorRef
  ) {
    const routeValue = this.route.snapshot.data.value;
    switch (routeValue) {
      case StaticRouteValue.JOBS:
        this.routeValue = routeValue;
      case StaticRouteValue.TICKETS:
        this.routeValue = routeValue;
    }

    console.log(this.customer_name);
    this.getJob(this.route.snapshot.queryParams["customer"]);
    this.getTechnician();
    this.getCustomer("true", "false");
    this.getEquipmentTypes();
    this.getAllEmployeeForJob();
    this.getVendors();
  }

  ngOnInit() {
    this.param = this.route.snapshot.paramMap.get("id");
    this.paramsExist = this.param ? true : false;

    this.showBackButton = false;
    this.apiProvider.getJobCharges().subscribe((charges: any) => {
      this.jobCharges = charges;
    });
  }

  generateModelValues() {
    // debugger;
    let customerList = this.autoCompleteArray(this.customerdata);
    let selectTechnicians = this.autoCompleteTech(this.Employeedata);
    let equipmentList = [];
    let jobTypes = this.autoCompleteJob(this.jobTypeData);
    let vendorList = [];
    let jobCharges = this.jobCharges;

    let dataInputs = {
      selectCustomer: customerList,
      customEquipment: equipmentList,
      jobTypes: jobTypes,
      selectTechnicians: selectTechnicians,
      selectVendor: vendorList,
      jobCharges: jobCharges,
    };
    let dataValues = {
      title: "New Service Ticket",
      status: "scheduleJob",
      selectedCustomer: "",
      customEquipment: "",
      jobType: "",
      note: "",
      comment: "",
      date: null,
      createJob: false,
      selectedTechnician: "",
      employeeType: 0,
      cusHeight: true,
    };
    if (this.vendorList.length > 0) {
      let vendors = this.autoCompleteVendor(this.vendorList);
      dataInputs.selectVendor = vendors;
    }
    let data = {
      dataInputs: dataInputs,
      dataValues: dataValues,
    };
    return data;
  }

  generateJobModalValues(job?) {
    let selectTechnicians = this.autoCompleteTech(this.Employeedata);
    let equipmentList = this.customerEquipments;
    let customerList = this.autoCompleteArray(this.customerdata);
    if (job) {
      equipmentList = this.getCustomerEquipments(job.customer._id);
    }
    let jobTypes = this.autoCompleteJob(this.jobTypeData);
    let vendorList = [];
    let jobCharges = this.jobCharges;

    let dataInputs = {
      selectCustomer: customerList,
      customEquipment: equipmentList,
      jobTypes: jobTypes,
      selectTechnicians: selectTechnicians,
      selectVendor: vendorList,
      jobCharges: jobCharges,
    };
    let dataValues = {
      title: "Create Job",
      status: "scheduleServiceJob",
      selectedCustomer: "",
      customEquipment: "",
      jobType: "",
      description: "",
      date: null,
      selectedTechnician: "",
      cusHeight: false,
      employeeType: 0,
      updateJob: false,
      isFixed: null,
      charges: 0,
    };
    if (this.vendorList.length > 0) {
      let vendors = this.autoCompleteVendor(this.vendorList);
      dataInputs.selectVendor = vendors;
    }
    if (job) {
      (dataValues.title = "Edit Job"), (dataValues.updateJob = true);
      dataValues.selectedCustomer = job.customer._id;
      dataValues.jobType = job.type._id;
      dataValues.description = job.description;
      dataValues.date = job.dateTime;
      dataValues.selectedTechnician = job.technician._id;
      // dataValues.customEquipment = job.equipment._id;
      // dataValues.startTime = job.startTime;
      // dataValues.duration = job.duration;
      dataValues.isFixed = job.isFixed;
      dataValues.charges = job.charges;
      if (job.technician.__t) {
        dataValues.employeeType == 1;
      }
    }
    let data = {
      dataInputs: dataInputs,
      dataValues: dataValues,
    };
    return data;
  }

  generateInfoModalValues(event, title, status) {
    console.log(event, title, status);
    debugger;
    let dataValues = {
      title: title,
      status: status,
      data: event,
      cusHeight: false,
    };
    let data = {
      dataValues: dataValues,
    };
    debugger;
    return data;
  }

  autoCompleteArray(list) {
    console.log(list);
    let newList = [];
    list.map((l) => {
      newList.push(this.autoComplet(l._id, l.profile.displayName));
    });
    return newList;
  }

  autoComplet(id, name) {
    let a = {
      id: id,
      name: name,
    };
    return a;
  }

  autoCompleteTech(list) {
    let newList = [];
    list.map((l) => {
      newList.push(this.autoComplet(l._id, l.profile.displayName));
    });
    return newList;
  }

  autoCompleteJob(list) {
    let newList = [];
    list.map((l) => {
      newList.push(this.autoComplet(l._id, l.title));
    });
    return newList;
  }

  autoCompleteVendor(list) {
    let newList = [];
    list.map((l) => {
      newList.push(
        this.autoComplet(l.contractor._id, l.contractor.info.companyName)
      );
    });
    return newList;
  }

  getJob(name?) {
    this.pendingJobsData = [];
    this.pendingJobsList = [];
    this.startedJobsData = [];
    this.startedJobsList = [];
    this.completeJobsData = [];
    this.completeJobsList = [];
    this.cancelJobsData = [];
    this.cancelJobsList = [];
    this.apiProvider.updateAppLoading(true);
    this.customer_name = name;
    this.apiProvider.apitoken = JSON.parse(this.userInfo.getUserData("token"));
    this.apiProvider.getJob().subscribe((response: any) => {
      console.log(response);
      if (this.routeValue === StaticRouteValue.JOBS) {
        response.jobs = response.jobs.filter(
          (job) => job.customer._id === this.param
        );
      }

      if (this.customer_name != undefined) {
        this.jobData = response["jobs"];
        this.jobList = this.filterSearch();
        console.log("job Data", this.jobData);
        this.showBackButton = true;
      } else {
        this.jobList = this.removeCancelFromJobList(response["jobs"]); //response['jobs'];
        this.jobData = this.removeCancelFromJobList(response["jobs"]);
        this.getJobEvents();
        this.showBackButton = false;
      }
      console.log(this.jobList);
      this.formatTheJobs(response["jobs"]);
      this.getServiceTickets();
      this.cdRef.detectChanges();
      this.cdRef.markForCheck();
    });
  }

  formatTheJobs(jobs: any[]) {
    jobs.map((job) => {
      if (job.status == 0) {
        this.pendingJobsData.push(job);
        this.pendingJobsList.push(job);
      }
      if (job.status == 1) {
        this.startedJobsData.push(job);
        this.startedJobsList.push(job);
      }
      if (job.status == 2) {
        this.completeJobsData.push(job);
        this.completeJobsList.push(job);
      }
      if (job.status == 3) {
        this.cancelJobsData.push(job);
        this.cancelJobsList.push(job);
      }
    });
    this.jobList = this.pendingJobsList;
    this.jobData = this.pendingJobsData;
    this.secondListTitle = `Jobs List (${this.jobList.length})`;
  }

  updateJobStatus(event) {
    if (event == "pending") {
      this.jobList = this.pendingJobsList;
      this.jobData = this.pendingJobsData;
    } else if (event == "started") {
      this.jobList = this.startedJobsList;
      this.jobData = this.startedJobsData;
    } else if (event == "complete") {
      this.jobList = this.completeJobsList;
      this.jobData = this.completeJobsData;
    } else {
      this.jobList = this.cancelJobsList;
      this.jobData = this.cancelJobsData;
    }
  }

  editTicket(ticket) {
    const { ticketStatus: status } = ticket;
    const heading = status === 1 ? "Cancel Ticket" : "Re-activate Ticket";
    const question =
      status === 1
        ? "Are you sure you want to cancel this ticket?"
        : "Are you sure you want to re-activate this ticket?";

    Swal.fire({
      title: `<strong>${heading}</strong>`,
      type: "info",
      html: `<h5>${question}</h5>`,
      showCloseButton: false,
      showCancelButton: true,
      focusConfirm: false,
      confirmButtonAriaLabel: "Yes",
      cancelButtonAriaLabel: "No",
    }).then((res) => res.value && this.updateTicket(ticket));
  }

  updateTicket(ticket) {
    const { _id: ticketId, ticketStatus: status } = ticket;
    this.apiProvider
      .editServiceTicket({ ticketId, status })
      .subscribe((response: { status: number; message: string }) => {
        if (response.status === 1) {
          this.getServiceTickets();
          this.mdToast.pop("success", "", response.message);
        } else {
          this.mdToast.pop("failed", "", response.message);
        }
      });
  }

  removeCancelFromJobList(allJobs) {
    let list = [];
    list = allJobs.filter((item) => {
      if (item.jobId) {
        item.jobId = item.jobId.replace("Job", "");
      }
      return item;
    });
    return list;
  }

  getCustomerEquipment() {
    this.apiProvider.apitoken = JSON.parse(this.userInfo.getUserData("token"));
    let params = {
      customerId: this.customer_id,
    };
    this.apiProvider.getCustomerEquipment(params).subscribe((response) => {
      this.equipmentData = response["equipments"];
    });
  }

  getCustomerEquipments(id) {
    let params = {
      customerId: id,
    };

    this.apiProvider
      .getCustomerEquipment(params)
      .subscribe((equipments: any) => {
        if (equipments.status == 1) {
          this.customerEquipments = this.autoCompleteJob(equipments.equipments);
        }
      });
  }

  getAllEmployeeForJob() {
    this.apiProvider.apitoken = JSON.parse(this.userInfo.getUserData("token"));
    this.apiProvider.getAllEmployeeForJob().subscribe((response) => {
      if (response["status"] == "1") {
        this.AllGroupData = response["employees"];
      }
    });
  }

  getAllEmployee() {
    this.apiProvider.apitoken = JSON.parse(this.userInfo.getUserData("token"));
    this.apiProvider.getAllEmployee().subscribe((response) => {
      this.Employeedata = response["employees"];
      try {
        let adminData = {
          profile: response["company"].admin.profile,
          _id: response["company"].admin._id,
        };
        this.Employeedata.push(adminData);
      } catch (error) {
        console.log(error);
      }
      this.getType();
    });
  }

  getType() {
    this.apiProvider.apitoken = JSON.parse(this.userInfo.getUserData("token"));
    this.apiProvider.getJobType().subscribe((response) => {
      this.subscription = this.apiProvider.showServiceTicket.subscribe(
        (data: any) => {
          this.jobTypeData = response["types"];

          if (this.customerdata && this.Employeedata && this.jobTypeData) {
            if (data) {
              this.goToVisitList();
            }
            this.activeCreateService = true;
            this.cdRef.detectChanges();
            this.cdRef.markForCheck();
          } else {
            this.activeCreateService = false;
            let dataValues = {
              title: "Customer are required for creating a service ticket.",
              status: "noServiceTicket",
              cusHeight: false,
            };

            let mdata = {
              dataValues: dataValues,
            };
            const dialogRef = this.dialog.open(DefaultModelComponent, {
              width: "474px",
              data: mdata,
              panelClass: "defaultModel",
            });
          }
          this.apiProvider.updateAppLoading(false);
        }
      );
    });
  }
  getTechnician() {
    this.apiProvider.apitoken = JSON.parse(this.userInfo.getUserData("token"));
    this.apiProvider.getTechnician().subscribe((response) => {
      if (response["status"] == "1") {
        this.technicianData = response["users"];
      }
    });
  }
  getCustomer(includeActive, includeNonActive) {
    this.apiProvider.apitoken = JSON.parse(this.userInfo.getUserData("token"));
    let params = {
      includeActive: includeActive,
      includeNonActive: includeNonActive,
    };

    this.apiProvider.getCustomer(params).subscribe((response) => {
      if (response["status"] == "1") {
        this.customerdata = response["customers"];
        this.customerdata.map((customer) => {
          if (customer._id == this.param) {
            this.paramCustomer = customer.profile.displayName;
          }
        });
      }

      this.getAllEmployee();
    });
  }
  getEquipmentTypes() {
    this.apiProvider.apitoken = JSON.parse(this.userInfo.getUserData("token"));
    this.apiProvider.getEquipmentTypes(null).subscribe((response) => {
      if (response["status"] == "1") {
        this.equipmentData = response["types"];
      }
    });
  }
  getServiceTickets() {
    this.pastTicketsData = [];
    this.pastTicketsList = [];
    this.currentTicketsData = [];
    this.currentTicketsList = [];
    this.apiProvider.apitoken = JSON.parse(this.userInfo.getUserData("token"));
    this.apiProvider.getServiceTicket().subscribe((response) => {
      if (response["status"] == "1") {
        let tickets = [];
        if (!this.paramsExist) {
          response["serviceTickets"].map((serviceTicket) => {
            if (serviceTicket.ticketId) {
              serviceTicket.ticketId = serviceTicket.ticketId.replace(
                "Ticket",
                ""
              );
            }
            this.jobList.map((job) => {
              if (job.ticket._id === serviceTicket._id) {
                serviceTicket["job"] = job;
              }
            });
            if (serviceTicket.jobCreated) {
              this.pastTicketsData.push(serviceTicket);
              this.pastTicketsList.push(serviceTicket);
            } else {
              this.currentTicketsList.push(serviceTicket);
              this.currentTicketsData.push(serviceTicket);
            }
          });
          this.listTitle = `Service Tickets List (${response["serviceTickets"].length})`;
          this.serviceTicketsList = this.currentTicketsList.filter(
            (ticket) => ticket.status !== 1
          );
          this.serviceTicketsData = this.currentTicketsData;
        } else {
          let customerTickets = response["serviceTickets"].filter(
            (ticket) => ticket.customer._id === this.param
          );
          customerTickets.map((serviceTicket) => {
            if (serviceTicket.ticketId) {
              serviceTicket.ticketId = serviceTicket.ticketId.replace(
                "Ticket",
                ""
              );
            }
            this.jobList.map((job) => {
              if (job.ticket._id === serviceTicket._id) {
                serviceTicket["job"] = job;
              }
            });
            if (serviceTicket.jobCreated) {
              this.pastTicketsData.push(serviceTicket);
              this.pastTicketsList.push(serviceTicket);
            } else {
              this.currentTicketsList.push(serviceTicket);
              this.currentTicketsData.push(serviceTicket);
            }
          });
          this.listTitle = `Service Tickets List (${response["serviceTickets"].length})`;
          this.serviceTicketsList = this.currentTicketsList.filter(
            (ticket) => ticket.status !== 1
          );
          this.serviceTicketsData = this.currentTicketsData;
        }
      }
      this.apiProvider.updateAppLoading(false);
      this.cdRef.detectChanges();
      this.cdRef.markForCheck();
    });
  }

  updateServiceTicketList(status) {
    switch (status) {
      case TicketStatus.CURRENT:
        this.serviceTicketsList = this.currentTicketsList.filter(
          (ticket) => ticket.status !== 1
        );
        this.serviceTicketsData = this.currentTicketsData;
        this.serviceStatus = "current";
        break;

      case TicketStatus.JOBCREATED:
        this.serviceTicketsList = this.pastTicketsList;
        this.serviceTicketsData = this.pastTicketsData;
        this.serviceStatus = "past";
        break;

      case TicketStatus.DELETED:
        this.serviceTicketsList = this.currentTicketsList.filter(
          (ticket) => ticket.status === 1
        );
        this.serviceTicketsData = this.currentTicketsData;
        this.serviceStatus = "deleted";
        break;

      default:
        break;
    }
  }

  getVendors() {
    this.apiProvider.getVendors().subscribe((response: any) => {
      if (response.status == 1) {
        this.vendorData = [...response.contracts];
        this.vendorList = response.contracts;
      }
    });
  }

  onCancelVisitor() {
    this.custDlg.close();
    this.dateTime = "";
    this.technicianId = "";
    this.customerId = "";
    this.jobId = "";
  }

  goToVisitList() {
    const dialogRef = this.dialog.open(DefaultModelComponent, {
      // width: "474px",
      // position: { right: '50px', top: '82px'},

      data: this.generateModelValues(),
      panelClass: "defaultModel",
    });

    dialogRef.afterClosed().subscribe((data: any) => {
      if (data.data.createNew) {
        this.createServiceTicket(data.data.dataValues);
      }
      this.apiProvider.updateShowServiceTicket(null);
    });
  }

  createServiceTicket(data: any) {
    let params = {
      scheduleTime: data.date,
      customerId: data.selectedCustomer,
      comment: data.comment,
      note: data.note,
    };

    this.apiProvider.createServiceTicket(params).subscribe((response: any) => {
      if (response.status == 1) {
        this.mdToast.pop("success", "", response.message);
        if (data.createJob) {
          this.createJob(data);
        } else {
          this.getServiceTickets();
        }
      } else {
        this.mdToast.pop("failed", "", response.message);
      }
    });
  }

  createJob(data) {
    this.apiProvider.apitoken = JSON.parse(this.userInfo.getUserData("token"));
    this.apiProvider.getServiceTicket().subscribe((response) => {
      if (response["status"] == "1") {
        this.serviceTicketsList = response["serviceTickets"];
        this.serviceTicketsData = response["serviceTickets"];
        let serviceTicketId = this.serviceTicketsList[
          this.serviceTicketsList.length - 1
        ]._id;
        this.createserviceSingleJob(data, serviceTicketId);
      }
    });
  }

  createserviceSingleJob(data, id) {
    let params = {
      dateTime: data.date,
      ticketId: id,
      technicianId: data.selectedTechnician,
      customerId: data.selectedCustomer,
      jobTypeId: data.jobType,
      description: data.note,
      employeeType: data.employeeType,
      isFixed: data.isFixed,
      charges: data.charges,
    };

    if (data.customEquipment != "") {
      params["equipmentId"] = data.customEquipment;
    }

    this.apiProvider.createJob(params).subscribe((response: any) => {
      console.log(response);
      if (response.status == 1) {
        this.mdToast.pop("success", "", response.message);
        this.getJob(this.route.snapshot.queryParams["customer"]);
      } else {
        this.mdToast.pop("failed", "", response.message);
      }
    });
  }

  createServiceJob(event) {
    const dialogRef = this.dialog.open(DefaultModelComponent, {
      // width: "474px",
      data: this.generateJobModalValues(),
      panelClass: "defaultModel",
    });

    dialogRef.afterClosed().subscribe((data: any) => {
      if (data.data.createNew) {
        let jobData = data.data.dataValues;
        jobData["selectedCustomer"] = event.customer._id;
        jobData["note"] = data.data.dataValues.description;
        this.createserviceSingleJob(jobData, event._id);
      }
    });
  }

  editTheJob(event) {
    const dialogRef = this.dialog.open(DefaultModelComponent, {
      // width: "474px",
      data: this.generateJobModalValues(event),
      panelClass: "defaultModel",
    });
    dialogRef.afterClosed().subscribe((data: any) => {
      if (data.data.job == "update") {
        let jobData = {
          jobId: event._id,
          technicianId: data.data.dataValues.selectedTechnician,
          dateTime: data.data.dataValues.date,
        };
        this.apiProvider.editJob(jobData).subscribe((response: any) => {
          if (response.status == 1) {
            this.toast(response.message, "success");
            this.getJob();
          } else {
            this.toast(response.message, "failed");
          }
        });
      }
      if (data.data.job == "cancel") {
        let jobData = {
          jobId: event._id,
          status: 3,
          comment: data.data.dataValues.description,
        };
        this.apiProvider.updateJob(jobData).subscribe((response: any) => {
          if (response.status == 1) {
            this.toast(response.message, "success");
            this.getJob();
          } else {
            this.toast(response.message, "failed");
          }
        });
      }
    });
  }

  showServiceTicketInfo(event) {
    const dialogRef = this.dialog.open(DefaultModelComponent, {
      width: "474px",
      data: this.generateInfoModalValues(
        event,
        "Service Ticket Info",
        "serviceInfo"
      ),
      panelClass: "defaultModel",
    });

    dialogRef.afterClosed().subscribe((data: any) => {
      console.log(data);
    });
  }

  showJobDetail(event) {
    const dialogRef = this.dialog.open(DefaultModelComponent, {
      width: "474px",
      data: this.generateInfoModalValues(event, "Job Info", "jobInfo"),
      panelClass: "defaultModel",
    });

    dialogRef.afterClosed().subscribe((data: any) => {
      console.log(data);
    });
  }

  updateSearch(event) {
    this.searchTicket = event;
    if (this.paramsExist) {
      this.ticketsList = this.fitlerCustomerServiceTickets();
      return;
    }
    this.serviceTicketsList = this.filterServiceTickets();
  }

  updateSecondSearch(event) {
    this.searchJob = event;
    this.jobList = this.filterJobs();
  }

  filterJobs() {
    let list = [];
    this.jobData.map((item) => {
      if (
        this.searchJob.name.length > 0 &&
        item.customer.profile.displayName
          .toLowerCase()
          .indexOf(this.searchJob.name.toLowerCase()) == -1
      ) {
        return;
      }
      list.push(item);
    });
    return list;
  }

  filterServiceTickets() {
    let list = [];
    this.serviceTicketsData.map((item) => {
      if (
        this.searchTicket.name.length > 0 &&
        item.customer.profile.displayName
          .toLowerCase()
          .indexOf(this.searchTicket.name.toLowerCase()) == -1
      ) {
        return;
      }
      list.push(item);
    });
    return list;
  }

  fitlerCustomerServiceTickets() {
    let list = [];
    this.ticketsListData.map((item) => {
      if (
        this.searchTicket.name.length > 0 &&
        item.customer.profile.displayName
          .toLowerCase()
          .indexOf(this.searchTicket.name.toLowerCase()) == -1
      ) {
        return;
      }
      list.push(item);
    });
    return list;
  }

  addTech(event: any) {}

  addCustomer(event: any) {}

  addjob(event: any) {}

  addstatus(event: any) {}

  addEmployee(event: any) {}

  formatDate(date) {
    if (date != null) {
      var dateTime = date.substring(0, 10);
      var d = dateTime.split("-");
      return d[1] + "/" + d[2] + "/" + d[0];
    } else {
      return;
    }
  }

  formatTime(time) {
    if (time != null) {
      var dateTime = time.substring(11, 16);
      var hourEnd = dateTime.indexOf(":");
      var H = +dateTime.substr(0, hourEnd);
      var h = H != 12 ? H % 12 : H;
      var ampm = H < 12 ? " AM" : " PM";
      time = h + dateTime.substr(hourEnd, 3) + ampm;
      return time;
    } else {
      return;
    }
  }

  onConfirmVisitor() {
    if (this.flag) {
      this.updateJob();
    } else {
      this.addJobToServer();
    }
    this.custDlg.close();
  }

  showReport(item) {
    this.router.navigate(["/main/viewreport"], {
      queryParams: { jobId: item._id, description: item.description },
      skipLocationChange: true,
    });
  }
  goBack() {
    this.location.back();
  }
  select(name) {
    const id = this.technicianData.find((x) => x.profile.displayName == name);
    this.tech_Id = id._id;
  }
  selectCustomer(name) {
    const id = this.customerdata.find((x) => x.info.name == name);
    this.cust_Id = id._id;
    console.log(id._id);
    this.customer_id = this.cust_Id;
    this.getCustomerEquipment();
  }

  selectType(name) {
    const id = this.jobTypeData.find((x) => x.title == name);
    this.jobtype_id = id._id;
  }
  selectStatus(name) {
    console.log(name);
    var statusTitle = this.statusName.find((x) => x.name == name);
    console.log("statusTitle", statusTitle);
    this.status_id = statusTitle.status;
    console.log("status", this.status_id);
  }
  selectEmployee(name) {
    console.log("employee bnameeee", name);
    var id = this.Employeedata.find((x) => x.profile.displayName == name);
    this.employee_id = id._id;
    console.log("employeeee iIDdddddd", id._id);
  }
  selectEquipment(name) {
    console.log("equipment nameeee", name);
    var id = this.equipmentData.find((x) => x.info.location == name);
    this.equipment_id = id._id;
    console.log("equipment iIDdddddd", id._id);
  }

  onEditJob(item) {
    this.customer_id = item.customer._id;
    console.log("customer idddd", this.customer_id);
    this.getCustomerEquipment();
    this.job_Id = item._id;
    console.log("job iddd", this.job_Id);
    if (item.dateTime != null) {
      this.dateTime = item.dateTime.substring(0, 16);
    }

    console.log("date time edit", this.dateTime);
    this.technicianId =
      item.technician != undefined ? item.technician.profile.displayName : "";
    this.employee_id = item.technician._id;
    this.customerId = item.customer != undefined ? item.customer.info.name : "";
    this.jobTypeId = item.type != undefined ? item.type.title : "";
    this.note = item != undefined ? item.description : "";
    this.flag = 1;
    this.custDlg.open();
  }

  onCancelJob() {
    this.custDlg.close();
    this.cancelDlg.open();
  }
  filterSearch() {
    console.log("customer", this.customer_name.toLowerCase());
    let list = [];
    list = this.jobData.filter((item) => {
      return (
        item.customer.info.name.toLowerCase() ===
        this.customer_name.toLowerCase()
      );
    });
    console.log("dataa", this.jobData);
    console.log("list", list);
    return list;
  }
  addJobToServer() {
    this.apiProvider.apitoken = JSON.parse(this.userInfo.getUserData("token"));
    let param = {
      dateTime: this.dateTime,
      technicianId: this.employee_id,
      customerId: this.cust_Id,
      jobTypeId: this.jobtype_id,
      description: this.note,
      equipmentId: this.equipment_id,
    };
    console.log("params", param);
    this.apiProvider.createJob(param).subscribe((response) => {
      if (response["status"] == "1") {
        this.msg = response["message"];
        document.getElementById("custToast").click();
        this.getJob(this.route.snapshot.queryParams["customer"]);
      } else {
        this.msg = response["message"];
        document.getElementById("custToast").click();
      }

      this.dateTime = "";
      this.technicianId = "";
      this.customerId = "";
      this.jobId = "";
      this.jobTypeId = "";
      this.customer_id = "";
      this.note = "";
      this.EquipmentId = "";
    });
  }

  updateJob() {
    this.apiProvider.apitoken = JSON.parse(this.userInfo.getUserData("token"));
    let param = {
      dateTime: this.dateTime,
      technicianId: this.employee_id,
      jobId: this.job_Id,
    };
    this.apiProvider.editJob(param).subscribe((response) => {
      if (response["status"] == "1") {
        this.msg = response["message"];
        document.getElementById("custToast").click();
        this.getCustomer("true", "false");
        this.getJob(this.route.snapshot.queryParams["customer"]);
      } else {
        this.msg = response["message"];
        document.getElementById("custToast").click();
      }
      this.dateTime = "";
      this.technicianId = "";
      this.customerId = "";
      this.jobId = "";
      this.jobTypeId = "";
      this.customer_id = "";
      this.note = "";
      this.EquipmentId = "";
    });
  }

  cancelJob() {
    let param = { jobId: this.job_Id, status: 2, comment: this.cancel_comment };

    this.apiProvider.updateJob(param).subscribe((data) => {
      console.log(data);
      debugger;
      if (data["status"] == "1") {
        this.dismissView();
        this.msg = data["message"];
        document.getElementById("custToast").click();
        this.getCustomer("true", "false");
        this.getJob(this.route.snapshot.queryParams["customer"]);
      } else {
        this.toast(data["message"], "danger");
      }
      this.cancel_comment = "";
    });
  }

  getJobEvents = () => {
    this.events = this.jobList.map((job) => {
      const jobEventToAdd: CalendarEvent = {
        start: new Date(this.formatDate(job.dateTime)),
        end: new Date(this.formatDate(job.dateTime)),
        title: job.type.title,
      };
      return jobEventToAdd;
    });
  };

  increment(): void {
    const addFn: any = {
      day: addDays,
      week: addWeeks,
      month: addMonths,
    }[this.view];
    this.viewDate = addFn(this.viewDate, 1);
  }

  decrement(): void {
    const subFn: any = {
      day: subDays,
      week: subWeeks,
      month: subMonths,
    }[this.view];
    this.viewDate = subFn(this.viewDate, 1);
  }

  today(): void {
    this.viewDate = new Date();
  }

  dayClicked({ date, events }: { date: Date; events: CalendarEvent[] }): void {
    console.log("on start");
    console.log(events);

    if (isSameMonth(date, this.viewDate)) {
      this.viewDate = date;
      if (
        (isSameDay(this.viewDate, date) && this.activeDayIsOpen === true) ||
        events.length === 0
      ) {
        this.activeDayIsOpen = false;
      } else {
        this.activeDayIsOpen = true;
      }
    }
  }

  eventTimesChanged({
    event,
    newStart,
    newEnd,
  }: CalendarEventTimesChangedEvent): void {
    event.start = newStart;
    event.end = newEnd;
    this.refresh.next();
  }

  addEvent(): void {
    this.events.push({
      title: "New event",
      start: startOfDay(new Date()),
      end: endOfDay(new Date()),
      draggable: true,
      resizable: {
        beforeStart: true,
        afterEnd: true,
      },
    });
    console.log("Event added");
    this.refresh.next();
  }

  dismissView() {
    this.cancelDlg.close();
  }

  toggle() {
    this.show = !this.show;
    if (this.show) this.buttonName = "View Calender";
    else this.buttonName = "View List";
  }

  public toast(text, type) {
    var toast: Toast = {
      type: type,
      title: text,
      showCloseButton: true,
    };
    this.mdToast.pop(toast);
  }

  beforeToast() {
    this.toast(this.msg, "success");
  }

  ngOnDestroy() {
    try {
      this.subscription.unsubscribe();
    } catch (error) {}
  }

  onCreateBrand() {}
}

enum StaticRouteValue {
  TICKETS = "tickets",
  JOBS = "jobs",
}

enum TicketStatus {
  JOBCREATED = "jobCreated",
  CURRENT = "current",
  DELETED = "deleted",
}
