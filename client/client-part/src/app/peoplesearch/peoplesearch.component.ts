import { HttpClient, HttpParams } from '@angular/common/http';
import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-peoplesearch',
  templateUrl: './peoplesearch.component.html',
  styleUrls: ['./peoplesearch.component.less']
})
export class PeoplesearchComponent {
  constructor(private http: HttpClient, private _router: Router){}
  serverAdress: string = "https://localhost:3000";
  //serverAdress: string = "https://10.25.40.9:3000";
  substr: string = "";
  foundedUsersList: any = [];
  anyoneFounded: boolean = false;
  profileOpened: boolean = false;
  openedProfileId: number = -1;
  openedProfileName: string = "";
  isFriend: boolean = false;
  //imgSrc: string = "https://localhost:3000/public/images/noavatar.png";
  imgSrc: string = this.serverAdress+"/public/images/noavatar.png";
  find(): void {
    const params = new HttpParams()
      .set('substr', this.substr);
    //this.http.get<any>("https://localhost:3000/socialNetwork/find", {params, withCredentials: true} )
    this.http.get<any>(this.serverAdress+"/socialNetwork/find", {params, withCredentials: true} )
      .subscribe(response=>{
        this.foundedUsersList = response;
        this.anyoneFounded = (this.foundedUsersList.length == 0) ? false : true;
      });
  }
  navigateToMainPage(): void {
    this._router.navigate(["/mainpage"]);
  }
  openProfile(id: number): void{
    this.openedProfileId = id;
    //this.http.get<any>("https://localhost:3000/socialNetwork/openprofile/" + id, { withCredentials: true} )
    this.http.get<any>(this.serverAdress+"/socialNetwork/openprofile/" + id, { withCredentials: true} )
      .subscribe(response=>{
        this.openedProfileName = response.username;
        //this.imgSrc = "https://localhost:3000/" + response.imgSrc;
        this.imgSrc = this.serverAdress + "/" + response.imgSrc;
        this.isFriend = response.isFriend;
      });
    this.profileOpened = true;
  }
  closeProfile(): void {
    this.profileOpened = false;
  }
  addFriend(): void{
    //this.http.get<any>("https://localhost:3000/socialNetwork/addfriend/" + this.openedProfileId, { withCredentials: true} ).subscribe(response=>{});
    this.http.get<any>(this.serverAdress+"/socialNetwork/addfriend/" + this.openedProfileId, { withCredentials: true} ).subscribe(response=>{});
    this.isFriend = true;
  }
  deleteFriend(): void {
    //this.http.get<any>("https://localhost:3000/socialNetwork/deletefriend/" + this.openedProfileId, { withCredentials: true} ).subscribe(response=>{});
    this.http.get<any>(this.serverAdress+"/socialNetwork/deletefriend/" + this.openedProfileId, { withCredentials: true} ).subscribe(response=>{});
    this.isFriend = false;
  }
}
