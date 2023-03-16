import { Component } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.less']
})
export class SignupComponent {
  constructor(private http: HttpClient, private _router: Router){}
  serverAdress: string = "https://localhost:3000";
  //serverAdress: string = "https://10.25.40.9:3000";
  username: string = "";
  birthDate: string = "";
  email: string = "";
  password: string = "";
  passwordCheck: string = "";
  incorrectInput: string = "";
  file: any = null;
  formData: any = null;
  signUp(): void {
    if (this.username == "") {this.incorrectInput = "Не введено имя"; return}
    if (this.password == "" || this.password !== this.passwordCheck) {this.incorrectInput = "Не введен пароль или пароли не совпадают"; return}
    this.incorrectInput = "";
    let params = new HttpParams()
      .set('username', this.username)
      .set('password', this.password)
      .set('email', this.email)
      .set('birthdate', this.birthDate);
    //this.http.post<any>("https://localhost:3000/socialNetwork/signup", this.formData, {params, withCredentials: true} )
    this.http.post<any>(this.serverAdress+"/socialNetwork/signup", this.formData, {params, withCredentials: true} )
      .subscribe(response=>{
        if (response.result == false) {
          this.incorrectInput = "Пользователь с таким именем уже существует";
        } else {
          this._router.navigate(["/mainpage"]);
        }
      })
  }
  onFileChange(evt: any): void {
    this.file = evt.target.files[0];
    this.formData = new FormData();
    this.formData.append("image", this.file);
  }
  navigateToLogin(): void{
    this._router.navigate(["/login"]);
  }
}
