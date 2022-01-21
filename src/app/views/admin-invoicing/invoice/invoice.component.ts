import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { MatDialog } from "@angular/material";
import { DefaultModelComponent } from "../../../shared/components/default-model/default-model.component";
import { ApiProvider } from "../../../service/api";

@Component({
  selector: "app-invoice",
  templateUrl: "./invoice.component.html",
  styleUrls: ["./invoice.component.scss"],
})
export class InvoiceComponent implements OnInit {
  constructor(
    private router: Router,
    private dialog: MatDialog,
    private apiProvider: ApiProvider
  ) {}

  history = [
    { name: "Sales Tax", click: "1", i: "money", color: "#49b8ff" },
    {
      name: "Items",
      click: "admin/invoice/rates",
      i: "money",
      color: "#0082c3",
    },
    {
      name: "Invoice Number",
      click: "2",
      i: "insert_drive_file",
      color: "#0082c3",
    },
  ];
  currentStartingNumber: StartingNumber = new StartingNumber();
  saleTax;
  saleTaxExsist: boolean = false;

  ngOnInit() {
    this.getSaleTax();
    this.apiProvider
      .getCurrentInvoiceNumber()
      .subscribe((invoiceNumber: any) => {
        console.log(invoiceNumber);
        this.currentStartingNumber.currentNumber =
          invoiceNumber.currentInvoiceNumber;
        this.currentStartingNumber.prefix = invoiceNumber.invoicePrefix;
      });
  }

  navigate(url) {
    if (url == 1) {
      this.openSaleTax();
    } else if (url == 2) {
      console.log("open invoice number");
      this.invoiceStartingNumber();
    } else {
      this.router.navigate([url]);
    }
  }

  openSaleTax() {
    if (this.saleTaxExsist) {
      this.editSaleTax();
    } else {
      this.createSaleTax();
    }
  }

  createSaleTax() {
    const dialogRef = this.dialog.open(DefaultModelComponent, {
      width: "474px",
      data: this.generateModelValues(),
      panelClass: "defaultModel",
    });

    dialogRef.afterClosed().subscribe((data: any) => {
      console.log(data);
      let tax = data.data.dataValues;
      if (data.data.createNew) {
        let body = {
          state: tax.state,
          tax: tax.tax,
        };
        this.apiProvider.createSaleTax(body).subscribe((charges: any) => {
          this.getSaleTax();
        });
      }
    });
  }

  editSaleTax() {
    let modelData = this.generateModelValues();
    modelData.dataValues.state = this.saleTax.state;
    modelData.dataValues.tax = this.saleTax.tax;
    modelData.dataValues.title = "Sales Tax";
    modelData.dataValues.updateJob = true;
    const dialogRef = this.dialog.open(DefaultModelComponent, {
      width: "474px",
      data: modelData,
      panelClass: "defaultModel",
    });

    dialogRef.afterClosed().subscribe((data: any) => {
      console.log(data);
      let tax = data.data.dataValues;
      if (data.data.job == "update") {
        let body = {
          salesTaxId: this.saleTax._id,
          state: tax.state,
          tax: tax.tax,
        };
        this.apiProvider.updateSaleTax(body).subscribe((charges: any) => {
          this.getSaleTax();
        });
      }
    });
  }

  generateModelValues() {
    let dataValues = {
      title: "New Sales Tax",
      status: "saleTax",
      state: "",
      tax: 0,
      cusHeight: true,
      updateJob: false,
      editSaleTax: false,
    };
    let data = {
      dataValues: dataValues,
    };
    return data;
  }

  getSaleTax() {
    this.apiProvider.getSaleTax().subscribe((saleTax: any) => {
      if (saleTax.status == 1 && saleTax.taxes.length > 0) {
        this.saleTax = saleTax.taxes[0];
        this.saleTaxExsist = true;
        console.log(this.saleTax);
      }
    });
  }

  invoiceStartingNumber() {
    const dialogRef = this.dialog.open(DefaultModelComponent, {
      data: this.generateInvoiceModelValues(),
      width: "474px",
      panelClass: "defaultModel",
    });

    dialogRef.afterClosed().subscribe((data) => {
      if (data.data.createNew) {
        const body = {
          invoiceNumber: data.data.dataValues.initialNumber,
          invoicePrefix: data.data.dataValues.hyphenNumber,
        };
        this.apiProvider
          .setCustomInvoiceNumber(body)
          .subscribe((response: any) => {
            console.log(response);
            this.currentStartingNumber.currentNumber =
              data.data.dataValues.initialNumber;
            this.currentStartingNumber.prefix =
              data.data.dataValues.hyphenNumber;
          });
      }
    });
  }

  generateInvoiceModelValues() {
    // let companyInfo = this.currentStartingNumber.currentNumber;
    // let comPrefix = this.currentStartingNumber.prefix;
    // if(companyInfo.prefix){
    //     comPrefix = companyInfo.prefix;
    // }
    let dataInput = {
      initialNumber: "Starting Number",
      hyphen: "Prefix",
    };
    let dataValues = {
      title: "Invoice Starting Number",
      status: "invoiceNumber",
      initialNumber: this.currentStartingNumber.currentNumber,
      hyphenNumber: this.currentStartingNumber.prefix,
      editNumber: false,
      cusHeight: true,
    };

    let data = {
      dataInputs: dataInput,
      dataValues: dataValues,
    };
    return data;
  }
}

export class StartingNumber {
  currentNumber: any;
  prefix: any;
}
