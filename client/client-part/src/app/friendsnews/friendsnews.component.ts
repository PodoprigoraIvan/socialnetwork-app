import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { io } from 'socket.io-client';

@Component({
  selector: 'app-friendsnews',
  templateUrl: './friendsnews.component.html',
  styleUrls: ['./friendsnews.component.less']
})
export class FriendsnewsComponent {
  newsList: any = [];
  friendsList: any = [];
  socket: any = null;
  constructor(private http: HttpClient, private _router: Router){}
  serverAdress: string = "https://localhost:3000";
  //serverAdress: string = "https://10.25.40.9:3000";
  ngOnInit(): void {
    //this.http.get<any>("https://localhost:3000/socialNetwork/friendsnews", {withCredentials: true} )
    this.http.get<any>(this.serverAdress+"/socialNetwork/friendsnews", {withCredentials: true} )
      .subscribe(response=>{
        this.newsList = response.newsList;
        this.friendsList = response.friendsList;
      });
    //this.socket = io("https://localhost:3000");
    this.socket = io(this.serverAdress);
    this.socket.on("recieve post", (post: any)=>{
      if (this.friendsList.includes(post.id)){
        this.newsList.push({author: post.name, text: post.text});
      }
    });
  }
  navigateToMainPage(): void {
    this._router.navigate(["/mainpage"]);
  }
}
