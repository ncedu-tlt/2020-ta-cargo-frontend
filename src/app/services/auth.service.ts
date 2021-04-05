import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {Router} from "@angular/router";
import {JwtHelperService} from "@auth0/angular-jwt";
import {Auth} from "../model/auth.model";

export const ACCESS_TOKEN_KEY = 'token_key';
export const ACCESS_USER_EMAIL = 'user_email';
export const ACCESS_USER_ID = 'user_id';
export const ACCESS_IS_DRIVER = 'isDriver';

@Injectable({providedIn:'root'})
export class AuthService {

  constructor(public http: HttpClient,
              public router: Router,
              private jwtHelper: JwtHelperService
            ) {
  }


  private urlLog: string = 'http://localhost:9000/login';
  private urlReg: string = 'http://localhost:9000/reg';


  public login(auth: Auth): void {
    this.http.post(this.urlLog, auth).subscribe((resp: any) => {
      localStorage.setItem(ACCESS_TOKEN_KEY, resp.token);
      localStorage.setItem(ACCESS_USER_EMAIL, resp.email);
      localStorage.setItem(ACCESS_IS_DRIVER, resp.driver);
      localStorage.setItem(ACCESS_USER_ID, resp.id);
    });
  }

  public reg(regUser: Auth): void {
    this.http.post(this.urlReg, regUser).subscribe(()=>{},
      error => alert('error, you not registration'),
      ()=> {alert('success registration')});
  }

  public isAuthenticated(): boolean{
    let token = localStorage.getItem(ACCESS_TOKEN_KEY);
    return token && !this.jwtHelper.isTokenExpired(token);
  }

  public isDriver(): boolean{
    let isDriver = this.getIsDriver();
    if(isDriver == 'true'){
      return true;
    }else return false;
  }

  public getToken(): string {
    return localStorage.getItem(ACCESS_TOKEN_KEY);
  }

  public getAuthEmail(): string {
    return localStorage.getItem(ACCESS_USER_EMAIL);
  }

  public getClientId(): string {
    return localStorage.getItem(ACCESS_USER_ID);
  }

  public getIsDriver(): string {
    return localStorage.getItem(ACCESS_IS_DRIVER);
  }

  public  logout(){
    localStorage.removeItem(ACCESS_TOKEN_KEY);
    localStorage.removeItem(ACCESS_USER_EMAIL);
    this.router.navigate(['']);
  }

}