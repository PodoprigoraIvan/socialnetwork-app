import { Component } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.less']
})
export class LoginComponent {
  constructor(private http: HttpClient, private _router: Router){}
  serverAdress: string = "https://localhost:3000";
  //serverAdress: string = "https://10.25.40.9:3000";
  username: string = "";
  password: string = "";
  incorrectInput: string = "";
  logIn(): void {
    const params = new HttpParams()
      .set('username', this.username)
      .set('password', this.password);
    //this.http.get<any>("https://localhost:3000/socialNetwork/login", {params, withCredentials: true} )
    this.http.get<any>(this.serverAdress+"/socialNetwork/login", {params, withCredentials: true} )
      .subscribe(response=>{
        if(response.result){
          this._router.navigate(["/mainpage"]);
        } else {
          this.incorrectInput = "Неверное имя мользователя или пароль"
        }
      })
  }
  navigateToSignUp(): void{
    this._router.navigate(["/signup"]);
  }
}
