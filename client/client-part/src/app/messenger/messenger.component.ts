import { HttpClient, HttpParams } from '@angular/common/http';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { io } from 'socket.io-client';

@Component({
  selector: 'app-messenger',
  templateUrl: './messenger.component.html',
  styleUrls: ['./messenger.component.less']
})
export class MessengerComponent {
  constructor(private http: HttpClient, private _router: Router){}
  serverAdress: string = "https://localhost:3000";
  //serverAdress: string = "https://10.25.40.9:3000";
  message: string = "";
  friendsList: any = [];
  dialogMessages: any = [];
  dialogOpened: boolean = false;
  curFriendId: number = -1;
  curFriendName: string = "";
  myid: number = -1;
  socket: any = null;
  ngOnInit(): void {
    //this.http.get<any>("https://localhost:3000/socialNetwork/friends", {withCredentials: true} )
    this.http.get<any>(this.serverAdress+"/socialNetwork/friends", {withCredentials: true} )
      .subscribe(response=>{
        this.friendsList = response.friendsList;
        this.myid = response.id;
      });
    //this.socket = io("https://localhost:3000");
    this.socket = io(this.serverAdress);
    this.socket.on("recieve message", (message: any)=>{
      if (message.fromId == this.curFriendId && message.toId == this.myid){
        this.dialogMessages.push({text: message.text, id: this.curFriendId});
      }
    });
  }
  navigateToMainPage(): void {
    this._router.navigate(["/mainpage"]);
  }
  openDialog(id: number): void {
    this.curFriendId = id;
    this.curFriendName = this.friendsList.find((item: any)=>item.id == id).name;
    this.dialogOpened = true;
    //this.http.get<any>("https://localhost:3000/socialNetwork/dialogmessages/"+id, {withCredentials: true} ).subscribe(response=>{
    this.http.get<any>(this.serverAdress+"/socialNetwork/dialogmessages/"+id, {withCredentials: true} ).subscribe(response=>{
      this.dialogMessages = response;
    });
  }
  sendMessage(): void{
    if (this.dialogOpened == false) return;
    this.dialogMessages.push({text: this.message, id: this.myid});

    this.socket.emit("send message", {fromId: this.myid, toId: this.curFriendId, text: this.message});

    const params = new HttpParams()
      .set('message', this.message)
      .set('friendId', this.curFriendId);
    //this.http.post<any>("https://localhost:3000/socialNetwork/sendmessage", {}, {params, withCredentials: true} ).subscribe(response=>{});
    this.http.post<any>(this.serverAdress+"/socialNetwork/sendmessage", {}, {params, withCredentials: true} ).subscribe(response=>{});
    this.message="";
  }
  onKeydown(event: any) {
    if (event.key === "Enter") {
      this.sendMessage();
    }
  }
}
