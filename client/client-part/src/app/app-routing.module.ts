import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FriendsnewsComponent } from './friendsnews/friendsnews.component';
import { LoginComponent } from './login/login.component';
import { MainpageComponent } from './mainpage/mainpage.component';
import { MessengerComponent } from './messenger/messenger.component';
import { PeoplesearchComponent } from './peoplesearch/peoplesearch.component';
import { SignupComponent } from './signup/signup.component';

const routes: Routes = [
  { path: 'login', component: LoginComponent},
  { path: 'signup', component: SignupComponent},
  { path: 'mainpage', component: MainpageComponent},
  { path: 'peoplesearch', component: PeoplesearchComponent},
  { path: 'friendsnews', component: FriendsnewsComponent},
  { path: 'messenger', component: MessengerComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
