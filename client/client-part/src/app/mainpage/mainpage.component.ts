import { HttpClient, HttpParams } from '@angular/common/http';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { io } from "socket.io-client";

@Component({
  selector: 'app-mainpage',
  templateUrl: './mainpage.component.html',
  styleUrls: ['./mainpage.component.less']
})
export class MainpageComponent {
  serverAdress: string = "https://localhost:3000";
  //serverAdress: string = "https://10.25.40.9:3000";
  //imgSrc: string = "https://localhost:3000/public/images/noavatar.png";
  imgSrc: string = this.serverAdress+"/public/images/noavatar.png";
  username: string = "";
  userid: any = null;
  email: string = "";
  birthdate: string = "";
  socket: any = null;
  myNewsList: any = [];
  postText: string = "";
  editOpened: boolean = false;
  emailInput: string = "";
  birthdateInput: string = "";
  file: any = null;
  formData: any = null;
  isAdmin: boolean = false;
  constructor(private http: HttpClient, private _router: Router){}
  ngOnInit(): void {
    //this.http.get<any>("https://localhost:3000/socialNetwork/mainpage", {withCredentials: true} )
    this.http.get<any>(this.serverAdress+"/socialNetwork/mainpage", {withCredentials: true} )
      .subscribe(result=>{
        //this.imgSrc = "https://localhost:3000/" + result.imgSrc;
        this.imgSrc = this.serverAdress + "/" + result.imgSrc;
        this.username = result.username;
        this.email = result.email;
        this.emailInput = result.email;
        this.birthdate = result.birthdate;
        this.birthdateInput = result.birthdate;
        this.userid = result.userid; 
        this.myNewsList = result.curNewsList;
        this.isAdmin = result.isAdmin;
      })
    // this.socket = io("https://localhost:3000", {autoConnect: false});
    // this.socket.auth = {id:2};
    // this.socket.connect();

    //this.socket = io("https://localhost:3000");
    this.socket = io(this.serverAdress);
    
  }
  logOut(): void{
    //this.http.get<any>("https://localhost:3000/socialNetwork/logout", {withCredentials: true} ).subscribe(response=>{});
    this.http.get<any>(this.serverAdress+"/socialNetwork/logout", {withCredentials: true} ).subscribe(response=>{});
    this._router.navigate(["/login"]);
  }
  addPost(): void {
    if (this.postText == "") return;

    this.socket.emit("send post", {name:this.username, id:this.userid, text: this.postText});

    this.myNewsList.push(this.postText);
    const params = new HttpParams()
      .set('text', this.postText);
    //this.http.post<any>("https://localhost:3000/socialNetwork/newpost", {}, {params, withCredentials: true} ).subscribe(response=>{});
    this.http.post<any>(this.serverAdress+"/socialNetwork/newpost", {}, {params, withCredentials: true} ).subscribe(response=>{});
    this.postText = "";
  }
  navigateToPeoplesearch(){
    this._router.navigate(["/peoplesearch"]);
  }
  navigateToAdministration(): void {
    if (this.isAdmin == true){
      //window.open("https://localhost:3000/", '_blank')!.focus();
      window.open(this.serverAdress+"/", '_blank')!.focus();
    }
  }
  navigateToFriendNews(): void{
    this._router.navigate(["/friendsnews"]);
  }
  navigateToMessenger(): void {
    this._router.navigate(["/messenger"]);
  }
  openEdit(): void {
    this.editOpened = true;
  }
  closeEdit(): void {
    this.editOpened = false;
  }
  edit(): void {
    const params = new HttpParams()
      .set('email', this.emailInput)
      .set('birthDate', this.birthdateInput);
    //this.http.post<any>("https://localhost:3000/socialNetwork/editinfo", {}, {params, withCredentials: true} ).subscribe(response=>{});
    this.http.post<any>(this.serverAdress+"/socialNetwork/editinfo", {}, {params, withCredentials: true} ).subscribe(response=>{});
    this.email = this.emailInput;
    this.birthdate = this.birthdateInput;
    this.editOpened = false;
  }
  onFileChange(evt: any): void {
    this.file = evt.target.files[0];
    this.formData = new FormData();
    this.formData.append("image", this.file);
  }
  changeAvatar(): void{
    if (this.file == null) return;
    //this.http.post<any>("https://localhost:3000/upload/image/"+this.userid, this.formData, { withCredentials: true} ).subscribe(response=>{});
    this.http.post<any>(this.serverAdress+"/upload/image/"+this.userid, this.formData, { withCredentials: true} ).subscribe(response=>{});
    this.imgSrc=this.imgSrc + "?ts=" + new Date().getTime();
  }
}
