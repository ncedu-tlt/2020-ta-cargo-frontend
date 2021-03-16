import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {Client} from "../model/client.model";


@Injectable({providedIn: 'root'})
export class ClientService {

  constructor(public http: HttpClient) {}


  //urlClient: string = 'https://app-cargo2020.herokuapp.com/client';
  urlClient: string = 'http://localhost:9000/client/';

  clientList: Client[] = [];

  public showAllClient(): void {
    this.http.get(this.urlClient).subscribe((date: Client[]) => {
      this.clientList = date;
    });
  }

  public delete(id: number) : void {
    this.http.delete(this.urlClient + id)
      .subscribe( ()=>{},error => {alert('error')},
        () => {alert('deleted'),  this.clientList = this.clientList.filter(c => c.userId !== id);});
  }

  public create(client: Client): void {
    this.http.post(this.urlClient, client).subscribe(()=>{},
        error => {alert('error')},
      ()=>{this.showAllClient();});

  }
}