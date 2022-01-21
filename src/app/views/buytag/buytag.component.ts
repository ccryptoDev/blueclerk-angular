import { Component } from '@angular/core';
import { Http } from '@angular/http';
import { ColorsService } from '../../shared/colors/colors.service';
import { UserService } from '../../shared/users/user.service';
import { Router } from '@angular/router';
import { ApiProvider } from '../../service/api';
@Component({
  selector: 'app-buytag',
  templateUrl: './buytag.component.html',
  styleUrls: ['./buytag.component.scss']
})
export class BuyTagComponent {
  public tagList: Array<any> = [];
  public listTitle: string;
  public curTagCnt = 0;
  public tagData: any;

  constructor(
    public colors: ColorsService,
    public http: Http,
    private router: Router,
    public apiProvider: ApiProvider,
    public userinfo: UserService
  ) {
    this.getTags();
  }

  ngOnInit() {
    // this implementation needs to be change when the data is correctly used
    const taglistLength = this.tagList.length || 0;
    this.listTitle = `${taglistLength} Purchases`;
  }

  getTags() {
    this.apiProvider.apitoken = JSON.parse(this.userinfo.getUserData('token'))
    this.apiProvider.getTags().subscribe(response => {
      console.log("cardtagss", response)
      if (response['status'] == "1") {
        this.tagData = response['orders'];
      }
    })
  }

  goToInvoice(event) {
    this.router.navigate(['/main/taginvoice']);
  }
}