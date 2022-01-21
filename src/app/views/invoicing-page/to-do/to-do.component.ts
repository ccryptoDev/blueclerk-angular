import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiProvider } from '../../../service/api';

@Component({
  selector: 'app-to-do',
  templateUrl: './to-do.component.html',
  styleUrls: ['./to-do.component.scss']
})
export class ToDoComponent implements OnInit {

  constructor(
    private apiProvider: ApiProvider,
    private router: Router
  ) { }
  completedJobs: any[] = [];
  listTableHeads = ['Job ID', 'Technician', 'Customer', 'Type', 'Schedule', 'Options'];
  listTitle = 'Completed Jobs';

  ngOnInit() {
    this.getJobs();
  }

  getJobs() {
    this.apiProvider.getJob().subscribe((jobs: any) => {
      console.log(jobs);
      this.completedJobs = [];
      const cJobs = [];
      jobs.jobs.map((job: any) => {
        if (job.status === 2) {
          job['invoiceGenerated'] = false;
          cJobs.push(job);
        }
      });

      console.log(this.completedJobs);
      if (cJobs.length > 0) {
        this.listTitle = `${this.listTitle} (${cJobs.length})`;
      }
      this.apiProvider.getInvoices().subscribe((allInvoices: any) => {
        console.log(allInvoices);
        const invoices = allInvoices.invoices;

        invoices.map((invoice: any) => {
          if (invoice.invoiceType === 0) {
            cJobs.map((job: any) => {
              if (invoice.job._id === job._id) {
                job.invoiceGenerated = true;
              }
            });
          }
        });
        this.completedJobs = this.removeCancelFromJobList(cJobs);
        console.log(this.completedJobs);
      });
    });
  }
  editTheJob(event) {
    console.log(event);
    event['items'] = [];
    this.apiProvider.updateInvoiceGenerateJob({detail: event, editInvoice: false});
    this.router.navigate(['invoicing/invoice-draft']);
  }

  removeCancelFromJobList(allJobs) {

    let list = [];
    list = allJobs.filter((item) => {
        // return (item.status != 2);
        if (item.jobId) {
            item.jobId = item.jobId.replace('Job', '');
        }
        return item;
    });
    // console.log("dataa", this.jobData)
    // console.log("list", list)
    return list;

  }

  updateSearch(event) {

  }
}
